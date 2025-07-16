import React from 'react';

const AdminPortal: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Portal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <p className="text-gray-600 mb-4">Manage users and roles</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Manage Users
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Package Monitoring</h2>
          <p className="text-gray-600 mb-4">Monitor all packages</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            View Packages
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">System Reports</h2>
          <p className="text-gray-600 mb-4">Generate system reports</p>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
            View Reports
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Security Logs</h2>
          <p className="text-gray-600 mb-4">Review security events</p>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Security Logs
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <p className="text-gray-600 mb-4">System settings</p>
          <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
            Configure
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-red-300">
          <h2 className="text-xl font-semibold mb-4 text-red-600">🔥 Debug Panel</h2>
          <p className="text-gray-600 mb-4">Intentionally vulnerable admin tools</p>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Access Debug
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal; 