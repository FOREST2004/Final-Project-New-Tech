import { apiClient, API_ENDPOINTS } from './apiConfig';

/**
 * Product Service - Handles all product-related API calls
 */
export const productService = {
  /**
   * Fetch products with optional filters
   * @param {string|null} categoryId - Category ID to filter by
   * @param {string|null} search - Search term to filter by
   * @returns {Promise<Array>} Array of products
   */
  async getProducts(categoryId = null, search = null) {
    try {
      const params = new URLSearchParams();
      if (categoryId) {
        params.append('category_id', categoryId);
      }
      if (search) {
        params.append('search', search);
      }
      
      const url = `${API_ENDPOINTS.PRODUCTS}${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('Fetching products from:', url);
      
      const response = await apiClient.get(url);
      console.log('Products response:', response.data);
      
      // API returns data in format: { success: true, data: { products: [...], pagination: {...} } }
      return response.data.data?.products || [];
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      throw new Error('Không thể tải sản phẩm. Vui lòng thử lại sau.');
    }
  },

  /**
   * Get product by ID
   * @param {string|number} productId - Product ID
   * @returns {Promise<Object>} Product details
   */
  async getProductById(productId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS}/${productId}`);
      return response.data.data;
    } catch (error) {
      console.error('Lỗi khi tải chi tiết sản phẩm:', error);
      throw new Error('Không thể tải chi tiết sản phẩm.');
    }
  }
};

export default productService;

// Named exports for convenience
export const getProducts = productService.getProducts;
export const getProductById = productService.getProductById;