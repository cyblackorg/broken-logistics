import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to <span className="text-yellow-300">BrokenLogistics</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            The world&apos;s most intentionally vulnerable logistics platform. 
            Where packages find their way... eventually.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Get Started
            </Link>
            <Link 
              to="/track" 
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-800 font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Track Package
            </Link>
          </div>
        </div>
      </section>

      {/* Warning Section */}
      <section className="bg-red-50 border-t-4 border-red-500 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-100 border border-red-300 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              🔥 Educational Security Platform
            </h2>
            <p className="text-red-700 mb-4">
              This application contains intentional security vulnerabilities for educational purposes.
              <strong> DO NOT use in production environments.</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white p-4 rounded border-l-4 border-orange-500">
                <h3 className="font-semibold text-orange-800">OWASP Top 10</h3>
                <p className="text-sm text-orange-700">SQL Injection, XSS, IDOR, and more</p>
              </div>
              <div className="bg-white p-4 rounded border-l-4 border-red-500">
                <h3 className="font-semibold text-red-800">Authentication Flaws</h3>
                <p className="text-sm text-red-700">Weak passwords, JWT issues, privilege escalation</p>
              </div>
              <div className="bg-white p-4 rounded border-l-4 border-purple-500">
                <h3 className="font-semibold text-purple-800">Logistics Specific</h3>
                <p className="text-sm text-purple-700">Package spoofing, GPS manipulation, data exposure</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Logistics Platform Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 text-3xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-3">Package Management</h3>
              <p className="text-gray-600 mb-4">
                Create, track, and manage shipments with our comprehensive package system.
              </p>
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Start Shipping →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-green-600 text-3xl mb-4">🚛</div>
              <h3 className="text-xl font-semibold mb-3">Driver Portal</h3>
              <p className="text-gray-600 mb-4">
                Real-time delivery tracking, route optimization, and GPS location updates.
              </p>
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Driver Access →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-purple-600 text-3xl mb-4">⚙️</div>
              <h3 className="text-xl font-semibold mb-3">Admin Dashboard</h3>
              <p className="text-gray-600 mb-4">
                Complete system oversight, user management, and operational controls.
              </p>
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Admin Login →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-orange-600 text-3xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-3">Package Tracking</h3>
              <p className="text-gray-600 mb-4">
                Track any package in real-time with our advanced tracking system.
              </p>
              <Link to="/track" className="text-blue-600 hover:text-blue-700 font-medium">
                Track Now →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-red-600 text-3xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-3">Customer Portal</h3>
              <p className="text-gray-600 mb-4">
                Manage your shipments, view history, and create new packages.
              </p>
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Join Today →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-red-300">
              <div className="text-red-600 text-3xl mb-4">🔥</div>
              <h3 className="text-xl font-semibold mb-3 text-red-700">Security Testing</h3>
              <p className="text-gray-600 mb-4">
                Discover vulnerabilities through normal application usage and workflows.
              </p>
              <Link to="/login" className="text-red-600 hover:text-red-700 font-medium">
                Explore Security →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Ready to Get Started?
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">For Security Learners</h3>
                <p className="text-gray-600 mb-4">
                  Explore real-world vulnerabilities in a safe, controlled environment.
                  Learn about OWASP Top 10 and logistics-specific security issues.
                </p>
                <Link 
                  to="/register" 
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                  Start Learning
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">For Educators</h3>
                <p className="text-gray-600 mb-4">
                  Use BrokenLogistics as a teaching tool for cybersecurity courses.
                  Comprehensive examples with detailed vulnerability explanations.
                </p>
                <Link 
                  to="/login" 
                  className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                  Admin Access
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 