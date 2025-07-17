import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { franchiseAPI } from '../services/api';
import { Franchise, FranchiseFilters } from '../types';

const FranchiseCard: React.FC<{ franchise: Franchise }> = ({ franchise }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>{franchise.title}</h3>
          <span className="badge badge-primary">{franchise.category}</span>
        </div>
        
        <p style={{ color: '#6b7280', marginBottom: '1rem', lineHeight: '1.5' }}>
          {franchise.description}
        </p>
        
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Investment Range:</span>
            <span style={{ fontWeight: '600' }}>
              {formatCurrency(franchise.investment.min)} - {formatCurrency(franchise.investment.max)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Location:</span>
            <span>{franchise.location}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Established:</span>
            <span>{franchise.establishedYear}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total Units:</span>
            <span>{franchise.totalUnits}</span>
          </div>
        </div>
        
        {franchise.features.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {franchise.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⭐ {franchise.rating}</span>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>({franchise.reviews} reviews)</span>
          </div>
          
          <Link to={`/franchise/${franchise.id}`} className="btn btn-primary">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FranchiseFilters>({
    search: '',
    category: '',
    minInvestment: undefined,
    maxInvestment: undefined,
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    pages: 1,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadFranchises();
  }, [filters]);

  const loadCategories = async () => {
    try {
      const response = await franchiseAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadFranchises = async () => {
    try {
      setLoading(true);
      const response = await franchiseAPI.getAll(filters);
      setFranchises(response.data.franchises);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to load franchises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
  };

  const handleFilterChange = (key: keyof FranchiseFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Discover Your Perfect Franchise Opportunity</h1>
          <p>Connect with proven franchise opportunities and start your entrepreneurial journey</p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="search-bar" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <input
              type="text"
              placeholder="Search franchises..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '2rem 0' }}>
        <div className="container">
          {/* Filters */}
          <div className="filters">
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={filters.minInvestment || ''}
              onChange={(e) => handleFilterChange('minInvestment', e.target.value ? parseInt(e.target.value) : undefined)}
              className="filter-select"
            >
              <option value="">Min Investment</option>
              <option value="25000">$25,000+</option>
              <option value="50000">$50,000+</option>
              <option value="100000">$100,000+</option>
              <option value="250000">$250,000+</option>
            </select>

            <select
              value={filters.maxInvestment || ''}
              onChange={(e) => handleFilterChange('maxInvestment', e.target.value ? parseInt(e.target.value) : undefined)}
              className="filter-select"
            >
              <option value="">Max Investment</option>
              <option value="100000">Up to $100,000</option>
              <option value="250000">Up to $250,000</option>
              <option value="500000">Up to $500,000</option>
              <option value="1000000">Up to $1,000,000</option>
            </select>
          </div>

          {/* Results */}
          {loading ? (
            <div className="loading">
              <p>Loading franchises...</p>
            </div>
          ) : franchises.length === 0 ? (
            <div className="empty-state">
              <h3>No franchises found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1rem', color: '#6b7280' }}>
                Showing {franchises.length} of {pagination.total} franchises
              </div>
              
              <div className="grid grid-cols-3">
                {franchises.map((franchise) => (
                  <FranchiseCard key={franchise.id} franchise={franchise} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={page === pagination.page ? 'active' : ''}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;