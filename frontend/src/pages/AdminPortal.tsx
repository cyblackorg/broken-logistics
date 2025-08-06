import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import PackageStatusManager from '../components/PackageStatusManager';
import UserManagement from '../components/UserManagement';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { API_BASE_URL } from '../config/api';

// System statistics
const systemStats = {
  totalUsers: 15847,
  activeUsers: 12394,
  totalPackages: 847291,
  revenue: "$2,847,291.83",
  databaseSize: "2.3 TB",
  serverUptime: "99.2%"
};



// Package data for admin overview
const mockPackages = [
  {
    id: "BL789012",
    sender: "John Customer",
    recipient: "Sarah Wilson",
    status: "In Transit", 
    value: "$1,247.83",
    origin: "Boston, MA",
    destination: "New York, NY",
    created: "2 hours ago",
    driverId: "DRV001"
  },
  {
    id: "BL456789",
    sender: "Corporate Client",
    recipient: "Government Agency",
    status: "Delivered",
    value: "$15,000.00",
    origin: "Los Angeles, CA",
    destination: "Washington, DC",
    created: "1 day ago",
    driverId: "DRV002"
  },
  {
    id: "BL123456",
    sender: "Tech Startup",
    recipient: "Investor Group",
    status: "Exception",
    value: "$5,200.00",
    origin: "San Francisco, CA",
    destination: "Chicago, IL",
    created: "3 hours ago",
    driverId: "DRV003"
  }
];

const AdminPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load packages for admin management
  useEffect(() => {
    if (activeTab === 'packages' || activeTab === 'overview') {
      loadPackages();
    }
  }, [activeTab]);

  const loadPackages = async () => {
    try {
      setLoading(true);
          const response = await axios.get(`${API_BASE_URL}/packages`);
      setPackages(response.data.packages || []);
    } catch (error) {
      console.error('Failed to load packages:', error);
      toast.error('Failed to load packages');
      setPackages([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Calculate real stats from packages
  const getRealStats = () => {
    if (!packages || packages.length === 0) {
      return {
        totalPackages: 0,
        deliveredPackages: 0,
        inTransitPackages: 0,
        totalRevenue: '$0.00'
      };
    }
    
    const totalPackages = packages.length;
    const deliveredPackages = packages.filter((pkg: any) => pkg.status === 'delivered').length;
    const inTransitPackages = packages.filter((pkg: any) => pkg.status === 'in_transit').length;
    const totalRevenue = packages.reduce((sum: number, pkg: any) => sum + (pkg.total_cost || 0), 0);
    
    return {
      totalPackages,
      deliveredPackages,
      inTransitPackages,
      totalRevenue: `$${totalRevenue.toFixed(2)}`
    };
  };

  const realStats = (() => {
    try {
      return getRealStats();
    } catch (error) {
      console.error('Error calculating stats:', error);
      return {
        totalPackages: 0,
        deliveredPackages: 0,
        inTransitPackages: 0,
        totalRevenue: '$0.00'
      };
    }
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 text-sm">
                BrokenLogistics Management Portal
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Welcome back, Admin</div>
              <div className="text-xs text-gray-400">Last login: Just now</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'overview', name: 'Overview', desc: 'System Stats' },
                { id: 'users', name: 'Users', desc: 'Manage Accounts' },
                { id: 'packages', name: 'Packages', desc: 'Shipment Monitoring' },
        
                { id: 'reports', name: 'Reports', desc: 'Analytics' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                  <div className="text-xs text-gray-400">{tab.desc}</div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* System Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">👥</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                    <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+12% from last month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-semibold">💰</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                    <p className="text-2xl font-bold text-gray-900">{realStats.totalRevenue}</p>
                    <p className="text-xs text-green-600">{realStats.inTransitPackages} in transit</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">📦</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Packages</h3>
                    <p className="text-2xl font-bold text-gray-900">{realStats.totalPackages.toLocaleString()}</p>
                    <p className="text-xs text-green-600">{realStats.deliveredPackages} delivered</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-600 font-semibold">⚡</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Server Uptime</h3>
                    <p className="text-2xl font-bold text-gray-900">{systemStats.serverUptime}</p>
                    <p className="text-xs text-gray-400">Last 30 days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and recent activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Packages</h3>
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-4 text-gray-500">Loading packages...</div>
                  ) : !packages || packages.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">No packages found</div>
                  ) : (
                    packages.slice(0, 5).map((pkg: any, index: number) => (
                      <div key={pkg?.id || index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{pkg?.tracking_number || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{pkg?.origin_state || 'Unknown'} → {pkg?.destination_state || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">Cost: ${pkg?.total_cost || '0.00'}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          pkg?.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          pkg?.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                          pkg?.status === 'created' ? 'bg-yellow-100 text-yellow-800' :
                          pkg?.status === 'dropped_off' ? 'bg-orange-100 text-orange-800' :
                          pkg?.status === 'picked_up' ? 'bg-purple-100 text-purple-800' :
                          pkg?.status === 'origin_depot' ? 'bg-indigo-100 text-indigo-800' :
                          pkg?.status === 'destination_depot' ? 'bg-cyan-100 text-cyan-800' :
                          pkg?.status === 'out_for_delivery' ? 'bg-pink-100 text-pink-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {(pkg?.status || 'unknown').replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database Status</span>
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Response Time</span>
                    <span className="text-sm text-green-600">142ms</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database Size</span>
                    <span className="text-sm text-gray-900">{systemStats.databaseSize}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && <UserManagement />}

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Package Management</h2>
                <div className="flex space-x-3">
                  <button
                    onClick={loadPackages}
                    disabled={loading}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Refresh'}
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Loading packages...
                        </td>
                      </tr>
                    ) : !packages || packages.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          No packages found
                        </td>
                      </tr>
                    ) : (
                      packages.map((pkg: any) => (
                        <tr key={pkg?.id || 'unknown'} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{pkg?.tracking_number || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">ID: {pkg?.id || 'Unknown'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{pkg?.origin_state || 'Unknown'} → {pkg?.destination_state || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{pkg?.recipient_name || 'Unknown'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              pkg?.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              pkg?.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                              pkg?.status === 'created' ? 'bg-yellow-100 text-yellow-800' :
                              pkg?.status === 'dropped_off' ? 'bg-orange-100 text-orange-800' :
                              pkg?.status === 'picked_up' ? 'bg-purple-100 text-purple-800' :
                              pkg?.status === 'origin_depot' ? 'bg-indigo-100 text-indigo-800' :
                              pkg?.status === 'destination_depot' ? 'bg-cyan-100 text-cyan-800' :
                              pkg?.status === 'out_for_delivery' ? 'bg-pink-100 text-pink-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {(pkg?.status || 'unknown').replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${pkg?.total_cost || '0.00'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {pkg?.created_at ? new Date(pkg.created_at).toLocaleDateString() : 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <button 
                              onClick={() => setSelectedPackage(pkg)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Package Status Manager Modal */}
            {selectedPackage && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Manage Package: {selectedPackage?.tracking_number || 'Unknown'}
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
                      trackingNumber={selectedPackage?.tracking_number || 'Unknown'}
                      currentStatus={selectedPackage?.status || 'created'}
                      userRole="admin"
                      onStatusUpdate={() => {
                        loadPackages();
                        setSelectedPackage(null);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}



        {/* Reports Tab */}
        {activeTab === 'reports' && <AnalyticsDashboard />}
      </div>
    </div>
  );
};

export default AdminPortal; 