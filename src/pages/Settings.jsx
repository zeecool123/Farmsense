import React from 'react';

const Settings = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Settings</h1>
      <p className="text-gray-600 mb-8">Configure your Farmsense system</p>

      <div className="space-y-6 max-w-2xl">
        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                placeholder="••••••••"
              />
            </div>
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Update
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Notifications</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span>Critical Alerts</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span>Daily Reports</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span>Marketing Emails</span>
            </label>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">System Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Data Refresh Interval (seconds)</label>
              <input
                type="number"
                defaultValue="5"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Alert Sensitivity</label>
              <select className="w-full border rounded px-3 py-2">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Save Settings
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Danger Zone</h2>
          <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
