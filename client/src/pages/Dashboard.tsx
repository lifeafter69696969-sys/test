import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, franchiseAPI } from '../services/api';
import { DashboardStats, Application, Franchise } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({});
  const [applications, setApplications] = useState<Application[]>([]);
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load stats
      const statsResponse = await userAPI.getDashboardStats();
      setStats(statsResponse.data);

      if (user?.userType === 'investor') {
        // Load applications for investors
        const appsResponse = await userAPI.getApplications();
        setApplications(appsResponse.data);
      } else if (user?.userType === 'franchisee') {
        // Load franchises for franchisees
        const franchisesResponse = await franchiseAPI.getMyListings();
        setFranchises(franchisesResponse.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const badgeClass = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger',
      active: 'badge-success',
    }[status] || 'badge-primary';
    
    return <span className={`badge ${badgeClass}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{ color: '#6b7280' }}>
          {user?.userType === 'investor' 
            ? 'Track your franchise applications and discover new opportunities'
            : 'Manage your franchise listings and review investor applications'
          }
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats">
        {user?.userType === 'investor' ? (
          <>
            <div className="stat-card">
              <div className="stat-number">{stats.totalApplications || 0}</div>
              <div className="stat-label">Total Applications</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.pendingApplications || 0}</div>
              <div className="stat-label">Pending Review</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.approvedApplications || 0}</div>
              <div className="stat-label">Approved</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.rejectedApplications || 0}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </>
        ) : (
          <>
            <div className="stat-card">
              <div className="stat-number">{stats.totalListings || 0}</div>
              <div className="stat-label">Total Listings</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.activeListings || 0}</div>
              <div className="stat-label">Active Listings</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalApplications || 0}</div>
              <div className="stat-label">Total Applications</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.pendingApplications || 0}</div>
              <div className="stat-label">Pending Review</div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Quick Actions</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {user?.userType === 'investor' ? (
              <>
                <Link to="/" className="btn btn-primary">
                  🔍 Discover Franchises
                </Link>
                <Link to="/profile" className="btn btn-outline">
                  👤 Update Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/create-franchise" className="btn btn-primary">
                  ➕ List New Franchise
                </Link>
                <Link to="/profile" className="btn btn-outline">
                  👤 Update Profile
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content based on user type */}
      {user?.userType === 'investor' ? (
        /* Investor Dashboard */
        <div className="card">
          <div className="card-header">
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Your Applications</h3>
          </div>
          <div className="card-body">
            {applications.length === 0 ? (
              <div className="empty-state">
                <h4>No applications yet</h4>
                <p>Start exploring franchise opportunities and submit your first application!</p>
                <Link to="/" className="btn btn-primary">
                  Browse Franchises
                </Link>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Franchise</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Category</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Investment</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Applied</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => (
                      <tr key={application.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.75rem' }}>
                          <Link 
                            to={`/franchise/${application.franchiseId}`}
                            style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}
                          >
                            {application.franchise?.title}
                          </Link>
                        </td>
                        <td style={{ padding: '0.75rem', color: '#6b7280' }}>
                          {application.franchise?.category}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          {formatCurrency(application.investment)}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          {getStatusBadge(application.status)}
                        </td>
                        <td style={{ padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>
                          {new Date(application.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Franchisee Dashboard */
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Your Franchise Listings</h3>
              <Link to="/create-franchise" className="btn btn-primary">
                Add New Listing
              </Link>
            </div>
          </div>
          <div className="card-body">
            {franchises.length === 0 ? (
              <div className="empty-state">
                <h4>No franchise listings yet</h4>
                <p>Create your first franchise listing to start connecting with potential investors!</p>
                <Link to="/create-franchise" className="btn btn-primary">
                  Create Listing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2">
                {franchises.map((franchise) => (
                  <div key={franchise.id} className="card">
                    <div className="card-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600' }}>
                          {franchise.title}
                        </h4>
                        {getStatusBadge(franchise.status)}
                      </div>
                      
                      <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        {franchise.description.substring(0, 100)}...
                      </p>
                      
                      <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ color: '#6b7280' }}>Category:</span>
                          <span>{franchise.category}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ color: '#6b7280' }}>Investment:</span>
                          <span>{formatCurrency(franchise.investment.min)} - {formatCurrency(franchise.investment.max)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#6b7280' }}>Rating:</span>
                          <span>⭐ {franchise.rating} ({franchise.reviews} reviews)</span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link 
                          to={`/franchise/${franchise.id}`} 
                          className="btn btn-outline"
                          style={{ flex: 1, textAlign: 'center', fontSize: '0.875rem' }}
                        >
                          View
                        </Link>
                        <button 
                          className="btn btn-primary"
                          style={{ flex: 1, fontSize: '0.875rem' }}
                          onClick={() => alert('Edit functionality would be implemented here')}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;