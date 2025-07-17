import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Icons with fixed sizing
const MenuIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const TruckIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
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

  const navigation = [
    { name: 'Track Package', href: '/track' },
    { name: 'Services', href: '/#services' },
    { name: 'About', href: '/#about' },
  ];

  return (
    <header className="bg-blue-600 text-white shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-700 rounded-lg">
              <TruckIcon />
            </div>
            <div className="flex flex-col">
              <div className="text-xl font-bold text-white">
                BrokenLogistics
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-red-500 px-2 py-0.5 rounded text-xs font-medium text-white">
                  VULNERABLE
                </div>
                <div className="text-xs text-blue-200">
                  Enterprise Platform
                </div>
              </div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-white hover:text-blue-200 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu / Auth */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={getRoleBasedDashboard()}
                  className="text-white hover:text-blue-200 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                
                {/* User Info */}
                <div className="flex items-center space-x-3 bg-blue-700 rounded-lg px-3 py-2">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-white">
                      {user?.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-blue-200">
                        ID: {user?.id}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
                        {user?.role?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-blue-200 transition-colors p-1"
                    title="Logout"
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-white hover:text-blue-200 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* System Info */}
        <div className="pb-3 border-t border-blue-500 mt-3">
          <div className="flex items-center justify-between text-xs">
            <div className="text-blue-200">
              Global logistics network • Real-time tracking • Secure delivery
            </div>
            <div className="flex items-center space-x-4 text-blue-300">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>API Online</span>
              </span>
              <span className="hidden md:block">
                {isAuthenticated ? `Session: ${user?.id}` : 'Public Access'}
              </span>
              <span className="hidden md:block bg-orange-500 bg-opacity-20 px-2 py-1 rounded text-orange-300 font-medium">
                🔥 Debug Mode
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-blue-700 border-t border-blue-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-white hover:text-blue-200 font-medium py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="border-t border-blue-600 pt-4 space-y-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      to={getRoleBasedDashboard()}
                      className="block text-white hover:text-blue-200 font-medium py-2 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    
                    <div className="bg-blue-600 rounded-lg p-4">
                      <div className="text-white font-medium">{user?.name}</div>
                      <div className="text-blue-200 text-sm">
                        {user?.role?.toUpperCase()} • ID: {user?.id}
                      </div>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left text-white hover:text-blue-200 font-medium py-2 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block text-white hover:text-blue-200 font-medium py-2 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-semibold px-4 py-3 rounded-lg transition-colors text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 