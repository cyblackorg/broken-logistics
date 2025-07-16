import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBasedDashboard = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'driver':
        return '/driver';
      case 'customer':
      default:
        return '/customer';
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">BrokenLogistics</div>
            <div className="text-xs bg-red-500 px-2 py-1 rounded">VULNERABLE</div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/track" className="hover:text-blue-200 transition-colors">
              Track Package
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to={getRoleBasedDashboard()} className="hover:text-blue-200 transition-colors">
                  Dashboard
                </Link>
                
                {/* Vulnerable: Show user role in UI */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm">
                    Welcome, {user?.name}
                  </span>
                  <span className="text-xs bg-blue-500 px-2 py-1 rounded">
                    {user?.role?.toUpperCase()}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="hover:text-blue-200 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition-colors">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
          
          {/* Mobile menu button - simplified for now */}
          <div className="md:hidden">
            <Link 
              to={isAuthenticated ? getRoleBasedDashboard() : '/login'}
              className="text-sm bg-blue-500 hover:bg-blue-400 px-3 py-2 rounded"
            >
              {isAuthenticated ? 'Dashboard' : 'Login'}
            </Link>
          </div>
        </div>
        
        {/* Vulnerable: Expose system info in header */}
        <div className="mt-2 text-xs opacity-90">
          Where packages find their way... eventually | 
          <span className="text-yellow-300 ml-1">
            🔥 Debug Mode Active | API: http://localhost:5000
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header; 