import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ShippingForm from '../components/ShippingForm';
import { useAuth } from '../context/AuthContext';

const ShippingPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [userShipments, setUserShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load user's shipments when on history tab
  useEffect(() => {
    if (activeTab === 'history' && user) {
      loadUserShipments();
    }
  }, [activeTab, user]);

  const loadUserShipments = async () => {
    try {
      setLoading(true);
          const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/shipping/user/${user?.id}`);
      setUserShipments(response.data.shipments);
    } catch (error) {
      console.error('Failed to load shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping</h1>
          <p className="text-gray-600">Create new shipments and track your deliveries</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('create')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'create'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Create Shipment
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Shipping History
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          {activeTab === 'create' ? (
            <ShippingForm />
          ) : (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping History</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-500">Loading your shipments...</p>
                </div>
              ) : userShipments.length > 0 ? (
                <div className="space-y-4">
                  {userShipments.map((shipment) => (
                    <div key={shipment.id} className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {shipment.recipientName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            To: {shipment.destination}
                          </p>
                          <p className="text-sm text-gray-500">
                            Tracking: {shipment.trackingNumber}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            shipment.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                            shipment.status === 'created' ? 'bg-yellow-100 text-yellow-800' :
                            shipment.status === 'dropped_off' ? 'bg-orange-100 text-orange-800' :
                            shipment.status === 'picked_up' ? 'bg-purple-100 text-purple-800' :
                            shipment.status === 'origin_depot' ? 'bg-indigo-100 text-indigo-800' :
                            shipment.status === 'destination_depot' ? 'bg-cyan-100 text-cyan-800' :
                            shipment.status === 'out_for_delivery' ? 'bg-pink-100 text-pink-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {shipment.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            ${shipment.totalCost}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Created: {new Date(shipment.createdAt).toLocaleDateString()}</span>
                          <span>Est. {shipment.estimatedDays} days</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No shipping history yet</h3>
                  <p className="text-gray-500 mb-6">
                    Create your first shipment to see it appear here.
                  </p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Shipment
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingPage; 