import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart as addToCartService, updateCartQuantity as updateCartQuantityService, removeCartItem as removeCartItemService, clearCart as clearCartService } from '../../../shared/services/cartService.js';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);

  // Fetch cart when user changes
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [], total: 0, itemCount: 0 });
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    
    try {
      const response = await getCart();
      setCart(response.data || { items: [], total: 0, itemCount: 0 });
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [], total: 0, itemCount: 0 });
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      throw new Error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
    }

    setLoading(true);
    try {
      await addToCartService(product.product_id, quantity);
      await fetchCart();
      return { success: true, message: 'Đã thêm sản phẩm vào giỏ hàng!' };
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw new Error('Lỗi khi thêm sản phẩm vào giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateCartQuantity = async (cartItemId, newQuantity) => {
    if (!user) return;

    setLoading(true);
    try {
      await updateCartQuantityService(cartItemId, newQuantity);
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw new Error('Lỗi khi cập nhật số lượng');
    } finally {
      setLoading(false);
    }
  };

  const removeCartItem = async (cartItemId) => {
    if (!user) return;

    setLoading(true);
    try {
      await removeCartItemService(cartItemId);
      await fetchCart();
      return { success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng' };
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw new Error('Lỗi khi xóa sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await clearCartService();
      await fetchCart();
      return { success: true, message: 'Đã xóa tất cả sản phẩm trong giỏ hàng' };
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw new Error('Lỗi khi xóa giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartQuantity,
    removeCartItem,
    clearCart,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;