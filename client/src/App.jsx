import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './shared/context/AuthContext';
import Login from './shared/components/Login';
import Register from './shared/components/Register';
import Admin from './features/admin/pages/Admin';
import User from './features/user/pages/User';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Navigate to="/shop" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/shop" element={<User />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;