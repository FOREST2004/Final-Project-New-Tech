import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl sm:text-2xl font-bold flex items-center space-x-2 hover:text-blue-200 transition duration-200"
            onClick={closeMobileMenu}
          >
            <span className="text-2xl">🐠</span>
            <span className="hidden sm:inline">Aquarium Shop</span>
            <span className="sm:hidden">AquaShop</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-blue-100 text-sm">
                  Xin chào, <span className="font-medium">{user.username}</span>
                </span>
                {isAdmin ? (
                  <Link 
                    to="/admin" 
                    className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition duration-200 text-sm font-medium"
                  >
                    Quản trị
                  </Link>
                ) : (
                  <Link 
                    to="/products" 
                    className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition duration-200 text-sm font-medium"
                  >
                    Sản phẩm
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition duration-200 text-sm font-medium"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition duration-200 text-sm font-medium"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register" 
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition duration-200 text-sm font-medium"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-blue-700 transition duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-blue-500">
            <nav className="flex flex-col space-y-3 pt-4">
              {user ? (
                <>
                  <div className="text-blue-100 text-sm px-2">
                    Xin chào, <span className="font-medium">{user.username}</span>
                  </div>
                  {isAdmin ? (
                    <Link 
                      to="/admin" 
                      className="bg-blue-700 hover:bg-blue-800 px-4 py-3 rounded-lg transition duration-200 text-sm font-medium text-center"
                      onClick={closeMobileMenu}
                    >
                      Quản trị
                    </Link>
                  ) : (
                    <Link 
                      to="/products" 
                      className="bg-blue-700 hover:bg-blue-800 px-4 py-3 rounded-lg transition duration-200 text-sm font-medium text-center"
                      onClick={closeMobileMenu}
                    >
                      Sản phẩm
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-3 rounded-lg transition duration-200 text-sm font-medium"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="bg-blue-700 hover:bg-blue-800 px-4 py-3 rounded-lg transition duration-200 text-sm font-medium text-center"
                    onClick={closeMobileMenu}
                  >
                    Đăng nhập
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-green-500 hover:bg-green-600 px-4 py-3 rounded-lg transition duration-200 text-sm font-medium text-center"
                    onClick={closeMobileMenu}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;