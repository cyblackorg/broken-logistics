import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

interface TrackingData {
  id: string;
  trackingNumber: string;
  status: string;
  sender: string;
  recipient: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  currentLocation?: string;
  events: Array<{
    timestamp: string;
    status: string;
    location: string;
    description: string;
  }>;
}

const TrackingPage: React.FC = () => {
  const { trackingNumber: urlTrackingNumber } = useParams();
  const [trackingNumber, setTrackingNumber] = useState(urlTrackingNumber || '');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-search if tracking number in URL
  useEffect(() => {
    if (urlTrackingNumber) {
      handleTrack();
    }
  }, [urlTrackingNumber]);

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(
        `${API_BASE_URL}/track/${encodeURIComponent(trackingNumber)}`
      );

      if (response.data.success) {
        setTrackingData(response.data.package);
        toast.success('Package found!');
      } else {
        setError(response.data.message || 'Package not found');
        setTrackingData(null);
      }
    } catch (err: any) {
      console.error('Tracking error:', err);
      const errorMessage = err.response?.data?.message || 'Error tracking package';
      setError(errorMessage);
      setTrackingData(null);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Track Your Package</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="tracking" className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter tracking number (e.g., BL001)"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Tracking...' : 'Track Package'}
                </button>
              </div>
            </div>
          </form>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Tracking Results */}
          {trackingData && (
            <div className="border-t pt-6">
              <h2 className="text-2xl font-semibold mb-6">Package Details</h2>
              
              {/* Package Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Shipment Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Tracking #:</strong> {trackingData.trackingNumber}</p>
                    <p><strong>Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        trackingData.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        trackingData.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                        trackingData.status === 'created' ? 'bg-yellow-100 text-yellow-800' :
                        trackingData.status === 'dropped_off' ? 'bg-orange-100 text-orange-800' :
                        trackingData.status === 'picked_up' ? 'bg-purple-100 text-purple-800' :
                        trackingData.status === 'origin_depot' ? 'bg-indigo-100 text-indigo-800' :
                        trackingData.status === 'destination_depot' ? 'bg-cyan-100 text-cyan-800' :
                        trackingData.status === 'out_for_delivery' ? 'bg-pink-100 text-pink-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {trackingData.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </p>
                    <p><strong>From:</strong> {trackingData.origin}</p>
                    <p><strong>To:</strong> {trackingData.destination}</p>
                    <p><strong>Est. Delivery:</strong> {new Date(trackingData.estimatedDelivery).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3">Package Details</h3>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p><strong>Sender:</strong> {trackingData.sender}</p>
                    <p><strong>Recipient:</strong> {trackingData.recipient}</p>
                    <p><strong>Package ID:</strong> {trackingData.id}</p>
                    {trackingData.currentLocation && (
                      <p><strong>Current Location:</strong> {trackingData.currentLocation}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tracking Events */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Tracking History</h3>
                <div className="space-y-4">
                  {trackingData.events.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        index === 0 ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <p className="font-medium">{event.status}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        <p className="text-xs text-gray-500">{event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Need Help?</h3>
          <p className="text-sm text-blue-700">
            If you're having trouble tracking your package, please contact our customer service team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage; 