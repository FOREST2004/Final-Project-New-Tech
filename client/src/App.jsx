import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './shared/context/AuthContext';
import ProtectedRoute from './shared/components/ProtectedRoute';
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
            {/* Mặc định chuyển về login nếu chưa đăng nhập */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Các trang không cần đăng nhập */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Các trang cần đăng nhập */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/shop" 
              element={
                <ProtectedRoute>
                  <User />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;