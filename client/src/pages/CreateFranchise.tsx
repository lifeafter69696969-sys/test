import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { franchiseAPI } from '../services/api';

const CreateFranchise: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    minInvestment: '',
    maxInvestment: '',
    location: '',
    establishedYear: new Date().getFullYear(),
    totalUnits: '',
    features: [''],
  });

  useEffect(() => {
    // Redirect if not franchisee
    if (user && user.userType !== 'franchisee') {
      navigate('/dashboard');
      return;
    }

    loadCategories();
  }, [user, navigate]);

  const loadCategories = async () => {
    try {
      const response = await franchiseAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        features: newFeatures
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (parseInt(formData.minInvestment) >= parseInt(formData.maxInvestment)) {
      setError('Maximum investment must be greater than minimum investment');
      return;
    }

    const validFeatures = formData.features.filter(f => f.trim() !== '');
    if (validFeatures.length === 0) {
      setError('Please add at least one feature');
      return;
    }

    setLoading(true);

    try {
      await franchiseAPI.create({
        title: formData.title,
        category: formData.category,
        description: formData.description,
        investment: {
          min: parseInt(formData.minInvestment),
          max: parseInt(formData.maxInvestment)
        },
        location: formData.location,
        establishedYear: formData.establishedYear,
        totalUnits: parseInt(formData.totalUnits),
        features: validFeatures
      });

      setSuccess('Franchise listing created successfully!');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create franchise listing');
    } finally {
      setLoading(false);
    }
  };

  if (user && user.userType !== 'franchisee') {
    return null; // Will redirect
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            List Your Franchise Opportunity
          </h1>
          <p style={{ color: '#6b7280' }}>
            Create a compelling listing to attract potential investors to your franchise
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

        <form onSubmit={handleSubmit} className="card">
          <div className="card-body">
            <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Franchise Name *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="e.g., Premium Coffee Co."
                />
              </div>

              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                required
                placeholder="Describe your franchise opportunity, what makes it unique, and what support you provide..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
              <div className="form-group">
                <label htmlFor="minInvestment" className="form-label">
                  Minimum Investment ($) *
                </label>
                <input
                  type="number"
                  id="minInvestment"
                  name="minInvestment"
                  value={formData.minInvestment}
                  onChange={handleChange}
                  className="form-input"
                  required
                  min="0"
                  placeholder="50000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxInvestment" className="form-label">
                  Maximum Investment ($) *
                </label>
                <input
                  type="number"
                  id="maxInvestment"
                  name="maxInvestment"
                  value={formData.maxInvestment}
                  onChange={handleChange}
                  className="form-input"
                  required
                  min="0"
                  placeholder="200000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  Available Locations *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="e.g., Nationwide, California, Urban Markets"
                />
              </div>

              <div className="form-group">
                <label htmlFor="establishedYear" className="form-label">
                  Established Year *
                </label>
                <input
                  type="number"
                  id="establishedYear"
                  name="establishedYear"
                  value={formData.establishedYear}
                  onChange={handleChange}
                  className="form-input"
                  required
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="totalUnits" className="form-label">
                Total Existing Units *
              </label>
              <input
                type="number"
                id="totalUnits"
                name="totalUnits"
                value={formData.totalUnits}
                onChange={handleChange}
                className="form-input"
                required
                min="1"
                placeholder="25"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Key Features & Benefits *
              </label>
              {formData.features.map((feature, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="form-input"
                    placeholder="e.g., Training Included, Marketing Support, Proven ROI"
                    style={{ flex: 1 }}
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="btn btn-outline"
                      style={{ padding: '0.5rem' }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="btn btn-outline"
                style={{ marginTop: '0.5rem' }}
              >
                + Add Feature
              </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-outline"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating Listing...' : 'Create Listing'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFranchise;