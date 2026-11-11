import { Link, useLocation, useNavigate} from 'react-router-dom';
import { useArticles } from '../context/ArticlesContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

function Navigation({ onSearch }) {
  const location = useLocation();
  const { getUserSavedArticles } = useArticles();
  const savedArticles = getUserSavedArticles();
  const [searchQuery, setSearchQuery] = useState('');
  const {user, isAuthenticated, logout, hasRole} = useAuth();
  const navigate = useNavigate();

    const handleLogout = () => {
    logout();
    navigate('/');
    };

  return (
    <nav>
      <div className="nav-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <h1 className="nav-brand">NewsReader</h1>
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/search" 
              className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}
            >
              Search
            </Link>
            {/* ⚠️ SECURITY ISSUE: No authentication required to access saved articles */}
            {isAuthenticated && (
            <Link 
              to="/saved" 
              className={`nav-link ${location.pathname === '/saved' ? 'active' : ''}`}
            >
              Saved Articles ({savedArticles.length})
            </Link>
            )}
            {hasRole('admin') && (
              <Link to="/admin" className="nav-link admin-link">Admin</Link>
            )}
          </div>
        </div>
        <div className="nav-user">
          <div className="auth-section">
          {isAuthenticated ? (
            <div className="user-info">
              <span className="username">👤 {user.username}</span>
              {user.role === 'admin' && (
                <span className="admin-badge">Admin</span>
              )}
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-link">
              Login
            </Link>
          )}
        </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;