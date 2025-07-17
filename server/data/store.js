// In-memory data store (in production, this would be a database)
class DataStore {
  constructor() {
    this.users = new Map();
    this.franchises = new Map();
    this.applications = new Map();
    this.initializeData();
  }

  initializeData() {
    // Add demo user accounts
    this.createUser({
      id: 'demo-investor-1',
      email: 'investor@demo.com',
      password: '$2a$10$8K1p/a0dClAuN7Hv5K9E4ec.V8NKYMFzV8Z8J7ZGJw8G5t8uZJ8ve', // password123
      name: 'John Investor',
      userType: 'investor',
      phone: '+1-555-0123',
      company: 'Investment Partners LLC',
      profile: {
        bio: 'Experienced investor looking for profitable franchise opportunities with strong ROI potential.',
        avatar: '',
        verified: true
      }
    });

    this.createUser({
      id: 'demo-franchisee-1',
      email: 'franchisee@demo.com',
      password: '$2a$10$8K1p/a0dClAuN7Hv5K9E4ec.V8NKYMFzV8Z8J7ZGJw8G5t8uZJ8ve', // password123
      name: 'Sarah Franchisor',
      userType: 'franchisee',
      phone: '+1-555-0456',
      company: 'Premium Coffee Co.',
      profile: {
        bio: 'Founder of Premium Coffee Co. with 10+ years experience in franchise development.',
        avatar: '',
        verified: true
      }
    });

    // Add some sample franchise data
    const sampleFranchises = [
      {
        id: '1',
        title: 'Premium Coffee Co.',
        category: 'Food & Beverage',
        investment: { min: 150000, max: 300000 },
        description: 'Join the fastest-growing coffee franchise with premium beans and exceptional customer service.',
        features: ['Training Included', 'Marketing Support', 'Prime Locations'],
        images: ['/api/placeholder/400/300'],
        rating: 4.8,
        reviews: 156,
        franchiseeId: 'demo-franchisee-1',
        location: 'Multiple States Available',
        establishedYear: 2015,
        totalUnits: 250,
        createdAt: new Date().toISOString(),
        status: 'active'
      },
      {
        id: '2',
        title: 'QuickFit Gym',
        category: 'Health & Fitness',
        investment: { min: 75000, max: 200000 },
        description: '24/7 fitness franchise with cutting-edge equipment and proven business model.',
        features: ['24/7 Operations', 'Equipment Included', 'Proven ROI'],
        images: ['/api/placeholder/400/300'],
        rating: 4.6,
        reviews: 89,
        franchiseeId: 'demo-franchisee-1',
        location: 'Urban Markets',
        establishedYear: 2018,
        totalUnits: 120,
        createdAt: new Date().toISOString(),
        status: 'active'
      },
      {
        id: '3',
        title: 'EcoClean Services',
        category: 'Services',
        investment: { min: 25000, max: 75000 },
        description: 'Eco-friendly cleaning services with recurring revenue and growing demand.',
        features: ['Low Investment', 'Recurring Revenue', 'Eco-Friendly'],
        images: ['/api/placeholder/400/300'],
        rating: 4.7,
        reviews: 203,
        franchiseeId: 'demo-franchisee-1',
        location: 'Nationwide',
        establishedYear: 2012,
        totalUnits: 450,
        createdAt: new Date().toISOString(),
        status: 'active'
      }
    ];

    sampleFranchises.forEach(franchise => {
      this.franchises.set(franchise.id, franchise);
    });
  }

  // User methods
  createUser(userData) {
    const user = {
      ...userData,
      id: userData.id || Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.users.set(user.id, user);
    return user;
  }

  getUserById(id) {
    return this.users.get(id);
  }

  getUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  updateUser(id, updates) {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return null;
  }

  // Franchise methods
  createFranchise(franchiseData) {
    const franchise = {
      ...franchiseData,
      id: franchiseData.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    this.franchises.set(franchise.id, franchise);
    return franchise;
  }

  getFranchiseById(id) {
    return this.franchises.get(id);
  }

  getAllFranchises(filters = {}) {
    let franchises = Array.from(this.franchises.values());
    
    // Apply filters
    if (filters.category) {
      franchises = franchises.filter(f => f.category === filters.category);
    }
    
    if (filters.minInvestment) {
      franchises = franchises.filter(f => f.investment.min >= filters.minInvestment);
    }
    
    if (filters.maxInvestment) {
      franchises = franchises.filter(f => f.investment.max <= filters.maxInvestment);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      franchises = franchises.filter(f => 
        f.title.toLowerCase().includes(searchTerm) ||
        f.description.toLowerCase().includes(searchTerm) ||
        f.category.toLowerCase().includes(searchTerm)
      );
    }

    return franchises.filter(f => f.status === 'active');
  }

  getFranchisesByUser(userId) {
    return Array.from(this.franchises.values()).filter(f => f.franchiseeId === userId);
  }

  updateFranchise(id, updates) {
    const franchise = this.franchises.get(id);
    if (franchise) {
      const updatedFranchise = { ...franchise, ...updates, updatedAt: new Date().toISOString() };
      this.franchises.set(id, updatedFranchise);
      return updatedFranchise;
    }
    return null;
  }

  deleteFranchise(id) {
    return this.franchises.delete(id);
  }

  // Application methods
  createApplication(applicationData) {
    const application = {
      ...applicationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    this.applications.set(application.id, application);
    return application;
  }

  getApplicationsByUser(userId) {
    return Array.from(this.applications.values()).filter(a => a.userId === userId);
  }

  getApplicationsByFranchise(franchiseId) {
    return Array.from(this.applications.values()).filter(a => a.franchiseId === franchiseId);
  }
}

module.exports = new DataStore();