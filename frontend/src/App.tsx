import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VulnerabilityProvider } from './context/VulnerabilityContext';
import { Toaster } from 'react-hot-toast';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerPortal from './pages/CustomerPortal';
import DriverPortal from './pages/DriverPortal';
import AdminPortal from './pages/AdminPortal';
import TrackingPage from './pages/TrackingPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  // Vulnerable: Expose sensitive configuration in DOM
  React.useEffect(() => {
    document.title = 'BrokenLogistics - Vulnerable Logistics Platform';
    
    // Vulnerable: Add sensitive metadata
    const meta = document.createElement('meta');
    meta.name = 'vulnerable-app';
    meta.content = 'true';
    document.head.appendChild(meta);

    // Vulnerable: Expose API endpoints in DOM
    const apiMeta = document.createElement('meta');
    apiMeta.name = 'api-endpoint';
    apiMeta.content = 'http://localhost:5000';
    document.head.appendChild(apiMeta);

    // Vulnerable: Console warnings that reveal system info
    console.warn('🔥 BrokenLogistics System Active');
    console.warn('🔧 API Endpoints exposed in DOM metadata');
    console.warn('🚨 Debug mode enabled for production');
  }, []);

  return (
    <AuthProvider>
      <VulnerabilityProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/track" element={<TrackingPage />} />
                <Route path="/track/:trackingNumber" element={<TrackingPage />} />
                
                {/* Customer Routes */}
                <Route 
                  path="/customer/*" 
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <CustomerPortal />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Driver Routes */}
                <Route 
                  path="/driver/*" 
                  element={
                    <ProtectedRoute requiredRole="driver">
                      <DriverPortal />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminPortal />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Catch-all route (potential security issue) */}
                <Route 
                  path="*" 
                  element={
                    <div className="text-center py-12">
                      <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
                      <p className="mt-2 text-gray-600">
                        The page you are looking for does not exist.
                      </p>
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-600">
                          🔥 Debug Info: Route &quot;{window.location.pathname}&quot; not found
                        </p>
                        <p className="text-sm text-red-600">
                          Available routes: /, /login, /register, /customer, /driver, /admin
                        </p>
                      </div>
                    </div>
                  } 
                />
              </Routes>
            </main>
            
            <Footer />
          </div>
          
          {/* Toast notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10B981',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                },
              },
            }}
          />
        </Router>
      </VulnerabilityProvider>
    </AuthProvider>
  );
}

export default App; 