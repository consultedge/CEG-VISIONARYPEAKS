import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-phone-alt me-2"></i>
          AI Calling Agent
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/dashboard')}`} to="/dashboard">
                <i className="fas fa-tachometer-alt me-1"></i>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/upload')}`} to="/upload">
                <i className="fas fa-upload me-1"></i>
                File Upload
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/calls')}`} to="/calls">
                <i className="fas fa-phone me-1"></i>
                Call Management
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/analytics')}`} to="/analytics">
                <i className="fas fa-chart-bar me-1"></i>
                Analytics
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/settings')}`} to="/settings">
                <i className="fas fa-cog me-1"></i>
                Settings
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/ai-reminder')}`} to="/ai-reminder">
                <i className="fas fa-bell me-1"></i>
                AI Reminder (Test)
              </Link>
            </li>
          </ul>
          
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                id="navbarDropdown" 
                role="button" 
                data-bs-toggle="dropdown"
              >
                <i className="fas fa-user me-1"></i>
                {currentUser?.name || 'User'}
              </a>
              <ul className="dropdown-menu">
                <li>
                  <span className="dropdown-item-text">
                    <small className="text-muted">{currentUser?.email}</small>
                  </span>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-1"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
