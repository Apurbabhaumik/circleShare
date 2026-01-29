import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddItemPage from './pages/AddItemPage';
import LandingPage from './pages/LandingPage';
import LoanManager from './pages/LoanManager';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-blue-600 font-bold animate-pulse">Loading CircleShare...</div>
            </div>
        </div>
    );
    if (!user) return <Navigate to="/login" />;
    
    return children;
};

const PublicRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return null;
    if (user) return <Navigate to="/dashboard" />;
    return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          
          {/* Protected Routes */}
          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-item" element={<AddItemPage />} />
            <Route path="/loans" element={<LoanManager />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
