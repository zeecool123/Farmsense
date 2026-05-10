import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext'; // Add this import

/**
 * Protected route component that requires authentication
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isGuest, loading } = useAuth();
  const { t } = useLanguage(); // Extract translation function

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;