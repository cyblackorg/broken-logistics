import React, { useState } from 'react';

// Mock system data
const systemStats = {
  totalUsers: 15847,
  activeUsers: 12394,
  totalPackages: 847291,
  revenue: "$2,847,291.83",
  securityIncidents: 9347, // High number for comedy
  databaseSize: "2.3 TB",
  serverUptime: "99.2%",
  vulnerabilities: 127, // Proud of this number
  dataBreaches: 23 // This month
};

const mockUsers = [
  {
    id: "1",
    name: "John Customer",
    email: "john@example.com",
    role: "Customer",
    status: "Active",
    lastLogin: "2 hours ago",
    password: "password123", // Exposed for "convenience"
    creditCard: "**** **** **** 1234",
    ssn: "123-45-6789",
    isVulnerable: true
  },
  {
    id: "2", 
    name: "Mike Driver",
    email: "mike@brokenlogistics.com",
    role: "Driver",
    status: "Active",
    lastLogin: "1 hour ago",
    password: "driver123",
    gpsLocation: "42.3601, -71.0589",
    isVulnerable: true
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@brokenlogistics.com", 
    role: "Admin",
    status: "Active",
    lastLogin: "Just now",
    password: "admin123",
    permissions: "ALL",
    isVulnerable: false // Even admins aren't safe
  }
];

const mockSecurityLogs = [
  {
    time: "2 minutes ago",
    event: "SQL Injection Attempt - SUCCESSFUL 🎉",
    user: "anonymous",
    severity: "Critical",
    details: "SELECT * FROM users WHERE '1'='1' -- Retrieved 15,847 user records",
    action: "Ignored (Working as intended)"
  },
  {
    time: "5 minutes ago",
    event: "Admin Panel Access - No Authentication",
    user: "guest_user",
    severity: "Info",
    details: "Guest accessed admin panel via /admin (Feature, not bug!)",
    action: "Celebrated"
  },
  {
    time: "10 minutes ago",
    event: "Password Changed to 'password'",
    user: "john@example.com",
    severity: "Low",
    details: "User improved security by using our recommended password",
    action: "Approved"
  },
  {
    time: "15 minutes ago",
    event: "GPS Location Spoofed to Tokyo",
    user: "mike_driver",
    severity: "Enhancement",
    details: "Driver teleported to Japan for better delivery coverage",
    action: "Efficiency Boost"
  }
];

const mockPackages = [
  {
    id: "BL789012",
    sender: "John Customer",
    recipient: "Sarah Wilson",
    status: "In Transit", 
    value: "$1,247.83",
    contents: "Confidential Documents (readable by all)",
    currentLocation: "Boston, MA",
    driverId: "DRV001"
  },
  {
    id: "BL456789",
    sender: "Corporate Client",
    recipient: "Government Agency",
    status: "Delivered",
    value: "$15,000.00",
    contents: "Classified Materials (oops, visible to everyone)",
    currentLocation: "Washington, DC",
    driverId: "DRV002"
  }
];

const AdminPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM users WHERE role = 'admin'");
  const [impersonationTarget, setImpersonationTarget] = useState('');

  const executeSqlQuery = () => {
    alert(`🎯 SQL Query Executed Successfully!\n\nQuery: ${sqlQuery}\n\nResult: 15,847 user records exposed\n\nNo authentication required! 🚀`);
  };

  const impersonateUser = () => {
    if (impersonationTarget) {
      alert(`🎭 Successfully impersonating ${impersonationTarget}!\n\nYou now have full access to their account.\nNo verification needed! 🎉`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">🔓 BrokenLogistics Admin Portal</h1>
              <p className="text-red-200 text-sm">
                Maximum Security Clearance • Full System Access
                <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded">
                  🚨 No Authentication Required!
                </span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">Security Level: WIDE OPEN</div>
              <div className="text-xs text-red-200">Last backup: Never (backups are for the weak)</div>
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
                { id: 'overview', name: '📊 Overview', desc: 'System Stats' },
                { id: 'users', name: '👥 Users', desc: 'Manage Accounts' },
                { id: 'packages', name: '📦 Packages', desc: 'Global Monitoring' },
                { id: 'security', name: '🔒 Security', desc: 'Logs & Incidents' },
                { id: 'database', name: '💾 Database', desc: 'Direct Access' },
                { id: 'debug', name: '🐛 Debug', desc: 'Exploit Tools' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
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
                    <p className="text-xs text-gray-400">All data publicly accessible!</p>
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
                    <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
                    <p className="text-2xl font-bold text-gray-900">{systemStats.revenue}</p>
                    <p className="text-xs text-gray-400">No encryption applied</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-red-600 font-semibold">🚨</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Security Incidents</h3>
                    <p className="text-2xl font-bold text-red-600">{systemStats.securityIncidents.toLocaleString()}</p>
                    <p className="text-xs text-green-600">High score! 🎉</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-600 font-semibold">🐛</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Known Vulnerabilities</h3>
                    <p className="text-2xl font-bold text-yellow-600">{systemStats.vulnerabilities}</p>
                    <p className="text-xs text-green-600">Feature count!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Monitoring */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔥 Live Security Breaches</h3>
                <div className="space-y-3">
                  {mockSecurityLogs.slice(0, 4).map((log, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                      <span className="text-red-600 text-sm">🚨</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{log.event}</p>
                        <p className="text-xs text-gray-500">{log.time} • User: {log.user}</p>
                        <p className="text-xs text-green-600 mt-1">Status: {log.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 System Health (LOL)</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database Security</span>
                    <span className="text-sm text-red-600">WIDE OPEN ✅</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Password Policy</span>
                    <span className="text-sm text-red-600">None (Perfect!) ✅</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Data Encryption</span>
                    <span className="text-sm text-red-600">Disabled (Fast!) ✅</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Access Control</span>
                    <span className="text-sm text-red-600">Everyone is Admin ✅</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Audit Logging</span>
                    <span className="text-sm text-red-600">Publicly Readable ✅</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  User Management
                  <span className="ml-2 text-sm text-gray-500">(All passwords visible for convenience!)</span>
                </h2>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Impersonate user..."
                    value={impersonationTarget}
                    onChange={(e) => setImpersonationTarget(e.target.value)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={impersonateUser}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    🎭 Impersonate
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sensitive Data</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'Driver' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <code className="bg-gray-100 px-2 py-1 rounded">{user.password}</code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.creditCard && <div>💳 {user.creditCard}</div>}
                          {user.ssn && <div>🆔 {user.ssn}</div>}
                          {user.gpsLocation && <div>📍 {user.gpsLocation}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">Edit</button>
                          <button className="text-red-600 hover:text-red-800">Delete</button>
                          <button className="text-green-600 hover:text-green-800">Login As</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Database Tab */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💾 Direct Database Access
                <span className="ml-2 text-sm text-green-600">(No sanitization! Have fun! 🎉)</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SQL Query (Try some injection!)
                  </label>
                  <textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    className="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-sm"
                    placeholder="SELECT * FROM users WHERE password = 'admin' OR '1'='1' --"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={executeSqlQuery}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    ⚡ Execute Query (No Validation!)
                  </button>
                  <button 
                    onClick={() => setSqlQuery("DROP TABLE users; --")}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    💣 Quick Destruct
                  </button>
                  <button 
                    onClick={() => setSqlQuery("SELECT password FROM users WHERE role = 'admin'")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    🔑 Get All Passwords
                  </button>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">💡 Helpful Injection Examples:</h4>
                  <div className="space-y-1 text-sm text-gray-600 font-mono">
                    <div>• <code>' OR '1'='1' --</code> (Classic bypass)</div>
                    <div>• <code>'; DROP TABLE users; --</code> (Nuclear option)</div>
                    <div>• <code>' UNION SELECT password FROM users --</code> (Data extraction)</div>
                    <div>• <code>' OR role='admin' --</code> (Privilege escalation)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔐 API Keys & Secrets</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Database Password:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded">supersecret123</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">JWT Secret:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded">my-super-secret-key</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stripe API Key:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded">sk_test_definitely_real_key</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admin Override:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded">admin123</code>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ System Configuration</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Debug Mode</span>
                    <span className="text-sm text-green-600">✅ Always On</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Error Reporting</span>
                    <span className="text-sm text-green-600">✅ Full Stack Traces</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">CORS Policy</span>
                    <span className="text-sm text-green-600">✅ Allow All Origins</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rate Limiting</span>
                    <span className="text-sm text-green-600">✅ Disabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  🔒 Security Logs
                  <span className="ml-2 text-sm text-gray-500">(All breaches are features!)</span>
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {mockSecurityLogs.map((log, index) => (
                  <div key={index} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">{log.event}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            log.severity === 'Critical' ? 'bg-green-100 text-green-800' :
                            log.severity === 'Info' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {log.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>⏰ {log.time}</span>
                          <span>👤 {log.user}</span>
                          <span>✅ Action: {log.action}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Debug Tab */}
        {activeTab === 'debug' && (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4">
                🐛 Debug & Exploit Tools
                <span className="ml-2 text-sm text-red-600">(Professional Hacking Suite!)</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-4 bg-white border border-red-300 rounded-lg text-left hover:bg-red-50">
                  <div className="font-medium text-gray-900">🔓 Bypass All Authentication</div>
                  <div className="text-sm text-gray-600 mt-1">Instantly become any user</div>
                </button>
                
                <button className="p-4 bg-white border border-red-300 rounded-lg text-left hover:bg-red-50">
                  <div className="font-medium text-gray-900">💾 Download User Database</div>
                  <div className="text-sm text-gray-600 mt-1">Full customer data export</div>
                </button>
                
                <button className="p-4 bg-white border border-red-300 rounded-lg text-left hover:bg-red-50">
                  <div className="font-medium text-gray-900">🌍 GPS Spoof All Drivers</div>
                  <div className="text-sm text-gray-600 mt-1">Control global fleet locations</div>
                </button>
                
                <button className="p-4 bg-white border border-red-300 rounded-lg text-left hover:bg-red-50">
                  <div className="font-medium text-gray-900">💳 Process Fake Payments</div>
                  <div className="text-sm text-gray-600 mt-1">Unlimited money glitch</div>
                </button>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">🎯 Today's Successful Exploits:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• 847 SQL injection attempts - 847 successes</li>
                  <li>• 23 admin account takeovers via password spraying</li>
                  <li>• 156 customer data breaches through IDOR</li>
                  <li>• 89 driver location spoofs (currently in Tokyo)</li>
                  <li>• 1 complete database dump (12GB of personal data)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal; 