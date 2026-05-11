import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AreaManagement from './pages/AreaManagement';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import MLInsights from './pages/MLInsights';
import AIChat from './pages/AIChat';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SmartOptimization from './pages/SmartOptimization';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppProvider>
              <Routes>
                <Route
                path="/smart-optimization"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SmartOptimization />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/areas"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AreaManagement />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Analytics />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ml-insights"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <MLInsights />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-chat"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AIChat />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;