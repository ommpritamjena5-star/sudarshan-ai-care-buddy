import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import ContactsManager from './pages/ContactsManager';
import SOS from './pages/SOS';
import AIAssistant from './pages/AIAssistant';
import Scanner from './pages/Scanner';
import Routines from './pages/Routines';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/contacts"
        element={
          <PrivateRoute>
            <ContactsManager />
          </PrivateRoute>
        }
      />
      <Route
        path="/sos"
        element={
          <PrivateRoute>
            <SOS />
          </PrivateRoute>
        }
      />
      <Route
        path="/ai-assistant"
        element={
          <PrivateRoute>
            <AIAssistant />
          </PrivateRoute>
        }
      />
      <Route
        path="/scanner"
        element={
          <PrivateRoute>
            <Scanner />
          </PrivateRoute>
        }
      />
      <Route
        path="/routines"
        element={
          <PrivateRoute>
            <Routines />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
