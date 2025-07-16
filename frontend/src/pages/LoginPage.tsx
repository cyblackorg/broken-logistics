import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/customer');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const success = await login(email, password);
    if (success) {
      // Navigation will be handled by the useEffect above
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your BrokenLogistics dashboard
          </p>
        </div>
        
        {/* Vulnerable: Show example credentials in production */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">🔥 Test Credentials (Vulnerable!)</h3>
          <div className="text-xs text-yellow-700 space-y-1">
            <p><strong>Customer:</strong> customer@brokenlogistics.com / customer123</p>
            <p><strong>Driver:</strong> driver@brokenlogistics.com / driver123</p>
            <p><strong>Admin:</strong> admin@brokenlogistics.com / admin123</p>
            <p className="text-red-600 mt-2">⚠️ Try SQL injection: admin@brokenlogistics.com&apos; OR &apos;1&apos;=&apos;1&apos; --</p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-500"
            >
              Need an account? Register
            </Link>
            <Link
              to="/track"
              className="text-blue-600 hover:text-blue-500"
            >
              Track Package
            </Link>
          </div>
        </form>

        {/* Vulnerable: Expose debug information */}
        <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-xs text-red-600">
            🔥 Debug: Login endpoint vulnerable to SQL injection and weak authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 