import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Vulnerable: Expose application configuration in global scope
(window as any).__BROKEN_LOGISTICS__ = {
  version: '1.0.0',
  // api: 'http://localhost:5000',
      api: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  debug: true,
  vulnerabilities: {
    xss: true,
    idor: true,
    csrf: true
  }
};

// Vulnerable: Console logging sensitive information
console.log('🚀 BrokenLogistics Frontend Starting...');
console.log('⚠️  SECURITY WARNING: This application contains intentional vulnerabilities');
// console.log('🔧 API Endpoint:', 'http://localhost:5000');
console.log('🔧 API Endpoint:', import.meta.env.VITE_API_URL || 'http://localhost:5000');
console.log('🔑 Debug Mode:', true);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 