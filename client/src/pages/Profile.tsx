import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    company: user?.company || '',
    bio: user?.profile?.bio || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await authAPI.updateProfile({
        name: formData.name,
        phone: formData.phone,
        company: formData.company,
        profile: {
          ...user?.profile,
          bio: formData.bio,
        },
      });

      updateUser(response.data.user);
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      company: user?.company || '',
      bio: user?.profile?.bio || '',
    });
    setEditing(false);
    setError('');
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            My Profile
          </h1>
          <p style={{ color: '#6b7280' }}>
            Manage your account information and preferences
          </p>
        </div>

        {error && (
          <div className="error-message" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '0.375rem', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="success-message" style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#d1fae5', borderRadius: '0.375rem', border: '1px solid #a7f3d0' }}>
            {success}
          </div>
        )}

        <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
          {/* Profile Info */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Profile Info</h3>
            </div>
            <div className="card-body" style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                backgroundColor: '#e5e7eb', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 1rem',
                fontSize: '2rem'
              }}>
                {user.userType === 'investor' ? '👤' : '🏢'}
              </div>
              
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                {user.name}
              </h4>
              
              <div style={{ marginBottom: '1rem' }}>
                <span className={`badge ${user.userType === 'investor' ? 'badge-primary' : 'badge-success'}`}>
                  {user.userType === 'investor' ? '👤 Investor' : '🏢 Franchisee'}
                </span>
              </div>
              
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>

              {user.profile?.verified && (
                <div style={{ marginBottom: '1rem' }}>
                  <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                    ✓ Verified Account
                  </span>
                </div>
              )}

              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div style={{ gridColumn: 'span 2' }}>
            <form onSubmit={handleSubmit} className="card">
              <div className="card-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Account Details</h3>
                  {editing && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-outline"
                        disabled={loading}
                        style={{ fontSize: '0.875rem' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ fontSize: '0.875rem' }}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="card-body">
                <div className="grid grid-cols-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    {editing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                        required
                      />
                    ) : (
                      <p style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem', margin: 0 }}>
                        {user.name}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <p style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem', margin: 0, color: '#6b7280' }}>
                      {user.email}
                      <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem' }}>(Cannot be changed)</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    {editing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem', margin: 0 }}>
                        {user.phone || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company</label>
                    {editing ? (
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter your company name"
                      />
                    ) : (
                      <p style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem', margin: 0 }}>
                        {user.company || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Bio</label>
                  {editing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="form-textarea"
                      placeholder="Tell us about yourself, your experience, and your goals..."
                      rows={4}
                    />
                  ) : (
                    <div style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem', minHeight: '100px' }}>
                      {user.profile?.bio || (
                        <span style={{ color: '#6b7280', fontStyle: 'italic' }}>
                          No bio provided. {user.userType === 'investor' 
                            ? 'Share your investment interests and experience.' 
                            : 'Describe your franchise business and what makes it unique.'
                          }
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <div className="grid grid-cols-2" style={{ gap: '1.5rem', fontSize: '0.875rem' }}>
                    <div>
                      <span style={{ color: '#6b7280' }}>Account Type:</span>
                      <span style={{ marginLeft: '0.5rem', fontWeight: '500' }}>
                        {user.userType === 'investor' ? 'Investor' : 'Franchisee'}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#6b7280' }}>Member Since:</span>
                      <span style={{ marginLeft: '0.5rem', fontWeight: '500' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Account Actions */}
            <div className="card" style={{ marginTop: '1.5rem' }}>
              <div className="card-header">
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Account Settings</h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                      Change Password
                    </h4>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                      Update your password to keep your account secure
                    </p>
                  </div>
                  <button 
                    className="btn btn-outline"
                    onClick={() => alert('Password change functionality would be implemented here')}
                  >
                    Change Password
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                      Download Data
                    </h4>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                      Export all your account data and activity
                    </p>
                  </div>
                  <button 
                    className="btn btn-outline"
                    onClick={() => alert('Data export functionality would be implemented here')}
                  >
                    Export Data
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.25rem', color: '#ef4444' }}>
                      Delete Account
                    </h4>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <button 
                    className="btn btn-danger"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                        alert('Account deletion functionality would be implemented here');
                      }
                    }}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;