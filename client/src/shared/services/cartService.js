import { apiClient, API_ENDPOINTS } from './apiConfig';

/**
 * Cart Service - Handles all cart-related API calls
 */
export const cartService = {
  /**
   * Fetch user's cart items
   * @returns {Promise<Array>} Array of cart items
   */
  async getCart() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CART);
      return response.data.data || [];
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng:', error);
      throw new Error('Không thể tải giỏ hàng.');
    }
  },

  /**
   * Add product to cart
   * @param {string|number} productId - Product ID to add
   * @param {number} quantity - Quantity to add (default: 1)
   * @returns {Promise<Object>} Response data
   */
  async addToCart(productId, quantity = 1) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CART_ADD, {
        product_id: productId,
        quantity: quantity
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
      throw new Error('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
    }
  },

  /**
   * Update cart item quantity
   * @param {string|number} cartItemId - Cart item ID
   * @param {number} newQuantity - New quantity
   * @returns {Promise<Object>} Response data
   */
  async updateCartQuantity(cartItemId, newQuantity) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.CART_ITEM(cartItemId), {
        quantity: newQuantity
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
      throw new Error('Có lỗi xảy ra khi cập nhật số lượng.');
    }
  },

  /**
   * Remove item from cart
   * @param {string|number} cartItemId - Cart item ID to remove
   * @returns {Promise<Object>} Response data
   */
  async removeCartItem(cartItemId) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.CART_ITEM(cartItemId));
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      throw new Error('Có lỗi xảy ra khi xóa sản phẩm.');
    }
  },

  /**
   * Clear all items from cart
   * @returns {Promise<Object>} Response data
   */
  async clearCart() {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.CART_CLEAR);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa giỏ hàng:', error);
      throw new Error('Có lỗi xảy ra khi xóa giỏ hàng.');
    }
  }
};

export default cartService;