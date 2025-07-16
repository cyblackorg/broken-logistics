import React from 'react';

const DriverPortal: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Driver Portal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Active Deliveries</h2>
          <p className="text-gray-600 mb-4">View assigned packages</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            View Deliveries
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Update Location</h2>
          <p className="text-gray-600 mb-4">Share your current location</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Update GPS
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Delivery History</h2>
          <p className="text-gray-600 mb-4">View completed deliveries</p>
          <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
            View History
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Route Optimization</h2>
          <p className="text-gray-600 mb-4">Optimize delivery route</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Optimize Route
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverPortal; 