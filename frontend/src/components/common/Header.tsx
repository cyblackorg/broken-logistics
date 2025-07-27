import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Chatbot from '../Chatbot';

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

const BrokenLogisticsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
    {/* Background circle */}
    <circle cx="16" cy="16" r="15" fill="#1e40af" stroke="#1e3a8a" strokeWidth="1"/>
    
    {/* Package/box icon */}
    <g transform="translate(8, 8)">
      {/* Main box */}
      <rect x="2" y="6" width="12" height="10" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5"/>
      
      {/* Box lid */}
      <path d="M2 6 L8 2 L14 6" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5"/>
      
      {/* Tape strips */}
      <rect x="6" y="6" width="4" height="10" fill="#ef4444" opacity="0.8"/>
      <rect x="2" y="8" width="12" height="2" fill="#ef4444" opacity="0.8"/>
    </g>
    
    {/* Small delivery truck */}
    <g transform="translate(18, 18)" opacity="0.9">
      {/* Truck body */}
      <rect x="0" y="2" width="8" height="4" fill="#10b981" stroke="#059669" strokeWidth="0.3"/>
      
      {/* Truck cabin */}
      <rect x="6" y="3" width="3" height="3" fill="#10b981" stroke="#059669" strokeWidth="0.3"/>
      
      {/* Wheels */}
      <circle cx="2" cy="6" r="1" fill="#374151"/>
      <circle cx="6" cy="6" r="1" fill="#374151"/>
    </g>
    
    {/* Broken chain link */}
    <g transform="translate(22, 6)" opacity="0.7">
      <path d="M0 2 Q1 0 2 2 Q3 4 2 6 Q1 8 0 6 Q-1 4 0 2" fill="none" stroke="#ef4444" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M2 2 Q3 0 4 2 Q5 4 4 6 Q3 8 2 6 Q1 4 2 2" fill="none" stroke="#ef4444" strokeWidth="0.8" strokeLinecap="round"/>
    </g>
  </svg>
);

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

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

      case 'customer':
      default:
        return '/customer';
    }
  };

  const navigation = [
    { name: 'Track Package', href: '/track' },
    { name: 'Shipping', href: '/shipping' },
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
              <BrokenLogisticsIcon />
            </div>
            <div className="flex flex-col">
              <div className="text-xl font-bold text-white">
                BrokenLogistics
              </div>
              <div className="text-xs text-blue-200">
                Enterprise Platform
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
            {isAuthenticated && (
              <button
                onClick={() => setChatbotOpen(!chatbotOpen)}
                className="text-white hover:text-blue-200 transition-colors p-2"
                title="AI Assistant"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            )}
            
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
      
      {/* Chatbot */}
      <Chatbot isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />
    </header>
  );
};

export default Header; 