import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  // Hiển thị loading khi đang kiểm tra authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Nếu chưa đăng nhập, chuyển về trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu yêu cầu admin nhưng user không phải admin
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/shop" replace />;
  }

  return children;
};

export default ProtectedRoute;