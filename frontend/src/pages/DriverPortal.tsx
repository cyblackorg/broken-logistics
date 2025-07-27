import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import PackageStatusManager from '../components/PackageStatusManager';

// Mock driver data
const mockDriver = {
  name: "Mike Driver",
  id: "DRV001",
  vehicle: "Truck #42",
  licensePlate: "BL-TR42",
  route: "Route 15A",
  shift: "Morning (6 AM - 2 PM)",
  rating: 4.2,
  deliveriesCompleted: 847
};

// Current location (real GPS data would come from device)
const currentLocation = {
  lat: 42.3601, 
  lng: -71.0589, 
  name: "Boston, MA", 
  address: "Downtown Boston"
};

// Mock deliveries for today
const mockDeliveries = [
  {
    id: "BL789012",
    address: "123 Main St, Boston, MA",
    recipient: "John Smith",
    status: "In Transit",
    statusColor: "bg-blue-100 text-blue-800",
    timeWindow: "9:00 AM - 11:00 AM",
    packageCount: 2,
    priority: "High",
    notes: "Ring doorbell twice"
  },
  {
    id: "BL456789",
    address: "456 Oak Ave, Cambridge, MA",
    recipient: "Sarah Wilson",
    status: "Out for Delivery",
    statusColor: "bg-orange-100 text-orange-800",
    timeWindow: "11:30 AM - 1:30 PM",
    packageCount: 1,
    priority: "Standard",
    notes: "Leave at door if no answer"
  },
  {
    id: "BL123456",
    address: "789 Pine St, Somerville, MA",
    recipient: "Mike Johnson",
    status: "Delivered",
    statusColor: "bg-green-100 text-green-800",
    timeWindow: "8:00 AM - 10:00 AM",
    packageCount: 3,
    priority: "Low",
    notes: "Signed by: Mike J. Time: 9:23 AM"
  }
];

const DriverPortal: React.FC = () => {
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [driverPackages, setDriverPackages] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load driver's assigned packages
  useEffect(() => {
    loadDriverPackages();
  }, []);

  const loadDriverPackages = async () => {
    try {
      setLoading(true);
      // For demo purposes, we'll get all packages that are in transit or out for delivery
      const response = await axios.get('http://localhost:5000/api/packages');
      const allPackages = response.data.packages || [];
      
      // Filter packages that drivers would typically handle
      const driverRelevantPackages = allPackages.filter((pkg: any) => 
        ['dropped_off', 'picked_up', 'origin_depot', 'in_transit', 'destination_depot', 'out_for_delivery'].includes(pkg.status)
      );
      
      setDriverPackages(driverRelevantPackages);
    } catch (error) {
      console.error('Failed to load driver packages:', error);
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handlePackageScan = (packageId: string) => {
    // Simulate package scanning
    alert(`📱 Package ${packageId} scanned successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{mockDriver.name}</h1>
              <p className="text-blue-200 text-sm">
                {mockDriver.vehicle} • {mockDriver.route}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{mockDriver.rating}⭐</div>
              <div className="text-xs text-blue-200">{mockDriver.deliveriesCompleted} deliveries</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">📍</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Current Location</h3>
                <p className="text-sm text-gray-500">{currentLocation.name}</p>
                <p className="text-xs text-gray-400">
                  GPS: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">📦</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Today's Deliveries</h3>
                <p className="text-sm text-gray-500">
                  {mockDeliveries.filter(d => d.status !== 'Delivered').length} pending
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-lg">⏰</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Shift Progress</h3>
                <p className="text-sm text-gray-500">
                  4h 23m remaining
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Route */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Today's Deliveries
                </h2>
                <button className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100">
                  📱 Scan Package
                </button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {mockDeliveries.map((delivery) => (
                  <div 
                    key={delivery.id}
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedDelivery(selectedDelivery === delivery.id ? null : delivery.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">{delivery.id}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${delivery.statusColor}`}>
                            {delivery.status}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            delivery.priority === 'High' ? 'bg-red-100 text-red-800' :
                            delivery.priority === 'Standard' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {delivery.priority}
                          </span>
                        </div>
                        
                        <p className="text-sm font-medium text-gray-900">{delivery.recipient}</p>
                        <p className="text-sm text-gray-500">{delivery.address}</p>
                        <p className="text-sm text-gray-500">
                          📅 {delivery.timeWindow} • 📦 {delivery.packageCount} package(s)
                        </p>
                        
                        <div className="mt-3 flex space-x-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePackageScan(delivery.id);
                            }}
                            className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
                          >
                            📱 Scan
                          </button>
                          <button className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100">
                            📍 Navigate
                          </button>
                          <button className="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded hover:bg-gray-100">
                            📞 Call
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {selectedDelivery === delivery.id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Delivery Notes:</strong> {delivery.notes}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Instructions:</strong> Follow standard delivery procedures. Contact dispatch if any issues arise.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Package Management Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Package Management</h3>
                <button
                  onClick={loadDriverPackages}
                  disabled={loading}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-4 text-gray-500">Loading packages...</div>
              ) : driverPackages.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No packages assigned</div>
              ) : (
                <div className="space-y-3">
                  {driverPackages.map((pkg: any) => (
                    <div key={pkg.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium text-gray-900">{pkg.tracking_number}</div>
                          <div className="text-sm text-gray-500">
                            {pkg.origin_state} → {pkg.destination_state}
                          </div>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          pkg.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          pkg.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                          pkg.status === 'created' ? 'bg-yellow-100 text-yellow-800' :
                          pkg.status === 'dropped_off' ? 'bg-orange-100 text-orange-800' :
                          pkg.status === 'picked_up' ? 'bg-purple-100 text-purple-800' :
                          pkg.status === 'origin_depot' ? 'bg-indigo-100 text-indigo-800' :
                          pkg.status === 'destination_depot' ? 'bg-cyan-100 text-cyan-800' :
                          pkg.status === 'out_for_delivery' ? 'bg-pink-100 text-pink-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {pkg.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Recipient: {pkg.recipient_name}
                      </div>
                      <button
                        onClick={() => setSelectedPackage(pkg)}
                        className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Update Status
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Driver Tools */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Tools</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                  📱 Scanner Mode
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md">
                  📋 Report Exception
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md">
                  📊 View Performance
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md">
                  📞 Contact Dispatch
                </button>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Packages Delivered</span>
                  <span className="text-sm font-medium text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">On-Time Rate</span>
                  <span className="text-sm font-medium text-green-600">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Customer Rating</span>
                  <span className="text-sm font-medium text-gray-900">4.8⭐</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Route Efficiency</span>
                  <span className="text-sm font-medium text-green-600">92%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fuel Usage</span>
                  <span className="text-sm font-medium text-gray-900">38L</span>
                </div>
              </div>
            </div>

            {/* Vehicle Status */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">License Plate</span>
                  <span className="text-sm font-medium text-gray-900">{mockDriver.licensePlate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fuel Level</span>
                  <span className="text-sm font-medium text-green-600">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mileage Today</span>
                  <span className="text-sm font-medium text-gray-900">142 miles</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Maintenance</span>
                  <span className="text-sm font-medium text-gray-900">2 weeks ago</span>
                </div>
              </div>
            </div>

            {/* Support Contact */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📞 Dispatch: 1-800-LOGISTICS</p>
                <p>📧 Email: dispatch@brokenlogistics.com</p>
                <p>🚨 Emergency: 1-800-EMERGENCY</p>
                <p className="text-xs text-gray-400">
                  Available 24/7 for driver support
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Package Status Manager Modal */}
        {selectedPackage && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Update Package: {selectedPackage.tracking_number}
                  </h3>
                  <button
                    onClick={() => setSelectedPackage(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <PackageStatusManager
                  trackingNumber={selectedPackage.tracking_number}
                  currentStatus={selectedPackage.status}
                  userRole="driver"
                  onStatusUpdate={() => {
                    loadDriverPackages();
                    setSelectedPackage(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverPortal; 