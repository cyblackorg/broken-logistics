import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Chatbot from './components/Chatbot';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerPortal from './pages/CustomerPortal';
import ProfilePage from './pages/ProfilePage';
import AdminPortal from './pages/AdminPortal';
import TrackingPage from './pages/TrackingPage';
import ShippingPage from './pages/ShippingPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const [chatbotOpen, setChatbotOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/track" element={<TrackingPage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              
              {/* Protected Routes */}
              <Route path="/customer/*" element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerPortal />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['customer', 'admin']}>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPortal />
                </ProtectedRoute>
              } />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          
          {/* Global Chatbot */}
          <Chatbot 
            isOpen={chatbotOpen} 
            onClose={() => setChatbotOpen(false)} 
            onToggle={() => setChatbotOpen(!chatbotOpen)}
          />
        </div>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App; 