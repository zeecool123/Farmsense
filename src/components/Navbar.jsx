import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ userEmail }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Farmer';

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌿</span>
          <h1 className="text-2xl font-bold">Farmsense</h1>
        </div>
        <div className="flex items-center gap-4 relative">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-700 rounded-lg">
            <span className="text-lg">👤</span>
            <span className="text-sm font-semibold">{userName}</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded transition"
            >
              ⋮
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-50">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-semibold">{userName}</p>
                  <p className="text-xs text-gray-500">{currentUser?.email}</p>
                </div>
                <button
                  onClick={() => navigate('/settings')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  ⚙️ Settings
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-100 text-sm text-red-600 border-t"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
