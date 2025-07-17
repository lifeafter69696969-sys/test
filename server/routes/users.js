const express = require('express');
const dataStore = require('../data/store');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user applications (investor only)
router.get('/applications', auth, (req, res) => {
  try {
    const user = dataStore.getUserById(req.user.userId);
    if (!user || user.userType !== 'investor') {
      return res.status(403).json({ message: 'Only investors can view their applications' });
    }

    const applications = dataStore.getApplicationsByUser(req.user.userId);
    
    // Add franchise info to each application
    const applicationsWithFranchises = applications.map(app => {
      const franchise = dataStore.getFranchiseById(app.franchiseId);
      return {
        ...app,
        franchise: franchise ? {
          id: franchise.id,
          title: franchise.title,
          category: franchise.category,
          investment: franchise.investment
        } : null
      };
    });

    res.json(applicationsWithFranchises);
  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user dashboard stats
router.get('/dashboard', auth, (req, res) => {
  try {
    const user = dataStore.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let stats = {};

    if (user.userType === 'investor') {
      const applications = dataStore.getApplicationsByUser(req.user.userId);
      stats = {
        totalApplications: applications.length,
        pendingApplications: applications.filter(a => a.status === 'pending').length,
        approvedApplications: applications.filter(a => a.status === 'approved').length,
        rejectedApplications: applications.filter(a => a.status === 'rejected').length
      };
    } else if (user.userType === 'franchisee') {
      const franchises = dataStore.getFranchisesByUser(req.user.userId);
      const allApplications = franchises.flatMap(f => 
        dataStore.getApplicationsByFranchise(f.id)
      );
      
      stats = {
        totalListings: franchises.length,
        activeListings: franchises.filter(f => f.status === 'active').length,
        totalApplications: allApplications.length,
        pendingApplications: allApplications.filter(a => a.status === 'pending').length
      };
    }

    res.json(stats);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;