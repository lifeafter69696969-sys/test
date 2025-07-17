import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { franchiseAPI } from '../services/api';
import { Franchise } from '../types';

const FranchiseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [franchise, setFranchise] = useState<Franchise | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    message: '',
    experience: '',
    investment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) {
      loadFranchise();
    }
  }, [id]);

  const loadFranchise = async () => {
    try {
      setLoading(true);
      const response = await franchiseAPI.getById(id!);
      setFranchise(response.data);
    } catch (error) {
      console.error('Failed to load franchise:', error);
      navigate('/');
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

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.userType !== 'investor') {
      setError('Only investors can apply to franchises');
      return;
    }

    if (!applicationData.investment || parseInt(applicationData.investment) <= 0) {
      setError('Please enter a valid investment amount');
      return;
    }

    setSubmitting(true);

    try {
      await franchiseAPI.apply(id!, {
        message: applicationData.message,
        experience: applicationData.experience,
        investment: parseInt(applicationData.investment),
      });

      setSuccess('Application submitted successfully! The franchisee will review your application.');
      setShowApplicationForm(false);
      setApplicationData({ message: '', experience: '', investment: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplicationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <div className="loading">Loading franchise details...</div>
      </div>
    );
  }

  if (!franchise) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <div className="empty-state">
          <h3>Franchise not found</h3>
          <p>The franchise you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {franchise.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.875rem' }}>
                  {franchise.category}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>⭐ {franchise.rating}</span>
                  <span style={{ color: '#6b7280' }}>({franchise.reviews} reviews)</span>
                </div>
              </div>
            </div>
            
            {isAuthenticated && user?.userType === 'investor' && (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="btn btn-primary"
                  style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
                >
                  📄 Apply Now
                </button>
              </div>
            )}
          </div>

          {(error || success) && (
            <div style={{ marginBottom: '1rem' }}>
              {error && (
                <div className="error-message" style={{ padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '0.375rem', border: '1px solid #fecaca' }}>
                  {error}
                </div>
              )}
              {success && (
                <div className="success-message" style={{ padding: '0.75rem', backgroundColor: '#d1fae5', borderRadius: '0.375rem', border: '1px solid #a7f3d0' }}>
                  {success}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
          {/* Main Content */}
          <div style={{ gridColumn: 'span 2' }}>
            {/* Description */}
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div className="card-header">
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>About This Franchise</h3>
              </div>
              <div className="card-body">
                <p style={{ lineHeight: '1.6', color: '#374151' }}>
                  {franchise.description}
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div className="card-header">
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Key Features & Benefits</h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                  {franchise.features.map((feature, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#10b981' }}>✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="card">
              <div className="card-header">
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Investment & Requirements</h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Investment Range
                    </h4>
                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                      {formatCurrency(franchise.investment.min)} - {formatCurrency(franchise.investment.max)}
                    </p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Available Locations
                    </h4>
                    <p style={{ color: '#6b7280' }}>{franchise.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Quick Info */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header">
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600' }}>Quick Info</h3>
              </div>
              <div className="card-body">
                <div style={{ fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: '#6b7280' }}>Established:</span>
                    <span style={{ fontWeight: '500' }}>{franchise.establishedYear}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: '#6b7280' }}>Total Units:</span>
                    <span style={{ fontWeight: '500' }}>{franchise.totalUnits}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: '#6b7280' }}>Category:</span>
                    <span style={{ fontWeight: '500' }}>{franchise.category}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Rating:</span>
                    <span style={{ fontWeight: '500' }}>⭐ {franchise.rating}/5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            {!isAuthenticated ? (
              <div className="card">
                <div className="card-body" style={{ textAlign: 'center' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Interested in this franchise?
                  </h4>
                  <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    Sign up to apply and get more information
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                      onClick={() => navigate('/register')}
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                    >
                      Sign Up to Apply
                    </button>
                    <button
                      onClick={() => navigate('/login')}
                      className="btn btn-outline"
                      style={{ width: '100%' }}
                    >
                      Already have an account?
                    </button>
                  </div>
                </div>
              </div>
            ) : user?.userType === 'franchisee' ? (
              <div className="card">
                <div className="card-body" style={{ textAlign: 'center' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Franchise Owner
                  </h4>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    You're viewing this as a fellow franchisee. Only investors can apply to franchise opportunities.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Application Modal */}
        {showApplicationForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
                  Apply to {franchise.title}
                </h3>
                <button
                  onClick={() => setShowApplicationForm(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleApplicationSubmit}>
                <div className="form-group">
                  <label htmlFor="investment" className="form-label">
                    Your Investment Amount ($) *
                  </label>
                  <input
                    type="number"
                    id="investment"
                    name="investment"
                    value={applicationData.investment}
                    onChange={handleApplicationChange}
                    className="form-input"
                    required
                    min={franchise.investment.min}
                    max={franchise.investment.max}
                    placeholder={`Between ${formatCurrency(franchise.investment.min)} - ${formatCurrency(franchise.investment.max)}`}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="experience" className="form-label">
                    Relevant Experience (Optional)
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={applicationData.experience}
                    onChange={handleApplicationChange}
                    className="form-textarea"
                    placeholder="Tell us about your business experience, management background, or industry knowledge..."
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message to Franchisee *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={applicationData.message}
                    onChange={handleApplicationChange}
                    className="form-textarea"
                    required
                    placeholder="Introduce yourself and explain why you're interested in this franchise opportunity..."
                    rows={4}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="btn btn-outline"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FranchiseDetail;