const express = require('express');
const { body, validationResult } = require('express-validator');
const dataStore = require('../data/store');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all franchises with filters
router.get('/', optionalAuth, (req, res) => {
  try {
    const {
      category,
      minInvestment,
      maxInvestment,
      search,
      page = 1,
      limit = 12
    } = req.query;

    const filters = {
      category,
      minInvestment: minInvestment ? parseInt(minInvestment) : undefined,
      maxInvestment: maxInvestment ? parseInt(maxInvestment) : undefined,
      search
    };

    const allFranchises = dataStore.getAllFranchises(filters);
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const franchises = allFranchises.slice(startIndex, endIndex);

    res.json({
      franchises,
      pagination: {
        total: allFranchises.length,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(allFranchises.length / limit)
      }
    });
  } catch (error) {
    console.error('Get franchises error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get franchise by ID
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const franchise = dataStore.getFranchiseById(req.params.id);
    if (!franchise) {
      return res.status(404).json({ message: 'Franchise not found' });
    }

    res.json(franchise);
  } catch (error) {
    console.error('Get franchise error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new franchise (franchisee only)
router.post('/', auth, [
  body('title').trim().isLength({ min: 3 }),
  body('category').trim().isLength({ min: 2 }),
  body('description').trim().isLength({ min: 10 }),
  body('investment.min').isInt({ min: 0 }),
  body('investment.max').isInt({ min: 0 }),
  body('location').trim().isLength({ min: 2 }),
  body('establishedYear').isInt({ min: 1900, max: new Date().getFullYear() }),
  body('totalUnits').isInt({ min: 1 }),
  body('features').isArray({ min: 1 })
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user is a franchisee
    const user = dataStore.getUserById(req.user.userId);
    if (!user || user.userType !== 'franchisee') {
      return res.status(403).json({ message: 'Only franchisees can create franchise listings' });
    }

    const franchiseData = {
      ...req.body,
      franchiseeId: req.user.userId,
      rating: 0,
      reviews: 0,
      images: req.body.images || ['/api/placeholder/400/300']
    };

    const franchise = dataStore.createFranchise(franchiseData);

    res.status(201).json({
      message: 'Franchise created successfully',
      franchise
    });
  } catch (error) {
    console.error('Create franchise error:', error);
    res.status(500).json({ message: 'Server error during franchise creation' });
  }
});

// Update franchise (owner only)
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 3 }),
  body('category').optional().trim().isLength({ min: 2 }),
  body('description').optional().trim().isLength({ min: 10 }),
  body('investment.min').optional().isInt({ min: 0 }),
  body('investment.max').optional().isInt({ min: 0 }),
  body('location').optional().trim().isLength({ min: 2 }),
  body('establishedYear').optional().isInt({ min: 1900, max: new Date().getFullYear() }),
  body('totalUnits').optional().isInt({ min: 1 }),
  body('features').optional().isArray({ min: 1 })
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const franchise = dataStore.getFranchiseById(req.params.id);
    if (!franchise) {
      return res.status(404).json({ message: 'Franchise not found' });
    }

    // Check if user owns this franchise
    if (franchise.franchiseeId !== req.user.userId) {
      return res.status(403).json({ message: 'You can only update your own franchises' });
    }

    const updatedFranchise = dataStore.updateFranchise(req.params.id, req.body);

    res.json({
      message: 'Franchise updated successfully',
      franchise: updatedFranchise
    });
  } catch (error) {
    console.error('Update franchise error:', error);
    res.status(500).json({ message: 'Server error during franchise update' });
  }
});

// Delete franchise (owner only)
router.delete('/:id', auth, (req, res) => {
  try {
    const franchise = dataStore.getFranchiseById(req.params.id);
    if (!franchise) {
      return res.status(404).json({ message: 'Franchise not found' });
    }

    // Check if user owns this franchise
    if (franchise.franchiseeId !== req.user.userId) {
      return res.status(403).json({ message: 'You can only delete your own franchises' });
    }

    dataStore.deleteFranchise(req.params.id);

    res.json({ message: 'Franchise deleted successfully' });
  } catch (error) {
    console.error('Delete franchise error:', error);
    res.status(500).json({ message: 'Server error during franchise deletion' });
  }
});

// Get franchises by current user (franchisee only)
router.get('/my/listings', auth, (req, res) => {
  try {
    const user = dataStore.getUserById(req.user.userId);
    if (!user || user.userType !== 'franchisee') {
      return res.status(403).json({ message: 'Only franchisees can view their listings' });
    }

    const franchises = dataStore.getFranchisesByUser(req.user.userId);
    res.json(franchises);
  } catch (error) {
    console.error('Get user franchises error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply to franchise (investor only)
router.post('/:id/apply', auth, [
  body('message').trim().isLength({ min: 10 }),
  body('experience').optional().trim(),
  body('investment').isInt({ min: 0 })
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = dataStore.getUserById(req.user.userId);
    if (!user || user.userType !== 'investor') {
      return res.status(403).json({ message: 'Only investors can apply to franchises' });
    }

    const franchise = dataStore.getFranchiseById(req.params.id);
    if (!franchise) {
      return res.status(404).json({ message: 'Franchise not found' });
    }

    const applicationData = {
      ...req.body,
      userId: req.user.userId,
      franchiseId: req.params.id,
      userInfo: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company
      }
    };

    const application = dataStore.createApplication(applicationData);

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Apply to franchise error:', error);
    res.status(500).json({ message: 'Server error during application submission' });
  }
});

// Get applications for a franchise (franchise owner only)
router.get('/:id/applications', auth, (req, res) => {
  try {
    const franchise = dataStore.getFranchiseById(req.params.id);
    if (!franchise) {
      return res.status(404).json({ message: 'Franchise not found' });
    }

    // Check if user owns this franchise
    if (franchise.franchiseeId !== req.user.userId) {
      return res.status(403).json({ message: 'You can only view applications for your own franchises' });
    }

    const applications = dataStore.getApplicationsByFranchise(req.params.id);
    res.json(applications);
  } catch (error) {
    console.error('Get franchise applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get categories
router.get('/meta/categories', (req, res) => {
  try {
    const categories = [
      'Food & Beverage',
      'Health & Fitness',
      'Services',
      'Retail',
      'Education',
      'Automotive',
      'Real Estate',
      'Technology',
      'Home Services',
      'Entertainment'
    ];

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;