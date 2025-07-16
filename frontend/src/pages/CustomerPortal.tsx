import React from 'react';

const CustomerPortal: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Portal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Create Shipment</h2>
          <p className="text-gray-600 mb-4">Send a new package</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            New Shipment
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Track Packages</h2>
          <p className="text-gray-600 mb-4">Monitor your shipments</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Track Now
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Shipping History</h2>
          <p className="text-gray-600 mb-4">View past shipments</p>
          <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerPortal; 