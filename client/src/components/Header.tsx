import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          🏢 FranchiseHub
        </Link>
        
        <nav className="nav-links">
          <Link to="/">Discover</Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              {user?.userType === 'franchisee' && (
                <Link to="/create-franchise">List Franchise</Link>
              )}
              <Link to="/profile">Profile</Link>
            </>
          )}
        </nav>

        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              <span>Welcome, {user?.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;