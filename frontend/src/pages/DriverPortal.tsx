import React, { useState, useEffect } from 'react';

// Mock driver data
const mockDriver = {
  name: "Mike Driver",
  id: "DRV001",
  vehicle: "Truck #42",
  licensePlate: "BL-HACK",
  route: "Route 15A",
  shift: "Morning (6 AM - 2 PM)",
  rating: 4.2,
  deliveriesCompleted: 847
};

// Mock current location (with spoofing capabilities)
const mockLocations = [
  { lat: 42.3601, lng: -71.0589, name: "Boston, MA", address: "Downtown Boston" },
  { lat: 40.7128, lng: -74.0060, name: "New York, NY", address: "Times Square" },
  { lat: 34.0522, lng: -118.2437, name: "Los Angeles, CA", address: "Hollywood" },
  { lat: 51.5074, lng: -0.1278, name: "London, UK", address: "Big Ben" },
  { lat: 35.6762, lng: 139.6503, name: "Tokyo, Japan", address: "Shibuya" }
];

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
    notes: "Ring doorbell twice. Vulnerable door code: 1234",
    actualOwner: "driver_002", // Not this driver's package
    isAssigned: false
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
    notes: "Leave at door if no answer",
    actualOwner: "driver_001",
    isAssigned: true
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
    notes: "Signed by: Mike J. Time: 9:23 AM",
    actualOwner: "driver_001",
    isAssigned: true
  }
];

const DriverPortal: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState(mockLocations[0]);
  const [isLocationSpoofed, setIsLocationSpoofed] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [spoofingEnabled, setSpoofingEnabled] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update delivery statuses, location, etc.
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLocationSpoof = (newLocation: typeof mockLocations[0]) => {
    setCurrentLocation(newLocation);
    setIsLocationSpoofed(true);
    // In a real vulnerable app, this would update the backend with fake GPS data
  };

  const handlePackageScan = (packageId: string) => {
    // Simulate package scanning - vulnerable to scanning any package
    alert(`📱 Package ${packageId} scanned! No verification required. 🎉`);
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
                <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded">
                  🔓 ID: {mockDriver.id} (Publicly Visible!)
                </span>
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
                <p className="text-sm text-gray-500">
                  {currentLocation.name}
                  {isLocationSpoofed && (
                    <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                      🚨 SPOOFED
                    </span>
                  )}
                </p>
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
                  <span className="ml-1 text-xs text-gray-400">
                    (+ {Math.floor(Math.random() * 50)} others' packages)
                  </span>
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
                  <span className="ml-2 text-sm text-gray-500">
                    (Including packages from other routes 😈)
                  </span>
                </h2>
                <button className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100">
                  📱 Scan Package
                </button>
              </div>
              
              <div className="divide-y divide-gray-200">
                {mockDeliveries.map((delivery) => (
                  <div 
                    key={delivery.id}
                    className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !delivery.isAssigned ? 'bg-red-50 border-l-4 border-l-red-400' : ''
                    }`}
                    onClick={() => setSelectedDelivery(selectedDelivery === delivery.id ? null : delivery.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">{delivery.id}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${delivery.statusColor}`}>
                            {delivery.status}
                          </span>
                          {!delivery.isAssigned && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              🚨 Not Your Route
                            </span>
                          )}
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
                          <strong>Security Info:</strong> Assigned to: {delivery.actualOwner} | 
                          Access via: /api/deliveries/{delivery.id} | 
                          No driver verification! 🎯
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* GPS Spoofing Tool */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📍 Location Manager
                <span className="ml-2 text-xs text-green-600">(Zero verification!)</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">GPS Spoofing</span>
                  <button
                    onClick={() => setSpoofingEnabled(!spoofingEnabled)}
                    className={`text-xs px-3 py-1 rounded-lg ${
                      spoofingEnabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {spoofingEnabled ? '✅ Enabled' : '❌ Disabled'}
                  </button>
                </div>
                
                {spoofingEnabled && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Choose fake location:</p>
                    {mockLocations.map((location, index) => (
                      <button
                        key={index}
                        onClick={() => handleLocationSpoof(location)}
                        className="w-full text-left text-xs p-2 hover:bg-gray-50 rounded border"
                      >
                        📍 {location.name}
                      </button>
                    ))}
                  </div>
                )}
                
                <button className="w-full mt-3 px-4 py-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100">
                  📡 Update GPS (No Authentication!)
                </button>
              </div>
            </div>

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
                <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 hover:bg-orange-100 rounded-md">
                  🚚 Access Other Routes (Oops!)
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
                  <span className="text-sm text-gray-600">GPS Accuracy</span>
                  <span className="text-sm font-medium text-red-600">
                    {isLocationSpoofed ? '0% (Spoofed!)' : '99%'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Security Compliance</span>
                  <span className="text-sm font-medium text-red-600">F+ (Excellent!)</span>
                </div>
              </div>
            </div>

            {/* "Support" Contact */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📞 Support: 1-800-NO-SECURITY</p>
                <p>📧 Email: help@brokenlogistics.com</p>
                <p>🔑 Emergency Override Code: admin123</p>
                <p className="text-xs text-gray-400">
                  (This code works for everything! 🎉)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverPortal; 