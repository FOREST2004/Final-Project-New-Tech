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
  },

  /**
   * Create new product
   * @param {Object} productData - Product data {name, description, price, stock_quantity, category_id, image_url}
   * @returns {Promise<Object>} Created product
   */
  async createProduct(productData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PRODUCTS, productData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo sản phẩm:', error);
      throw new Error('Không thể tạo sản phẩm. Vui lòng thử lại sau.');
    }
  },

  /**
   * Update product
   * @param {string|number} productId - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise<Object>} Updated product
   */
  async updateProduct(productId, productData) {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.PRODUCTS}/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
      throw new Error('Không thể cập nhật sản phẩm. Vui lòng thử lại sau.');
    }
  },

  /**
   * Delete product
   * @param {string|number} productId - Product ID
   * @returns {Promise<Object>} Delete response
   */
  async deleteProduct(productId) {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.PRODUCTS}/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      throw new Error('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
    }
  }
};

export default productService;

// Named exports for convenience
export const getProducts = productService.getProducts;
export const getProductById = productService.getProductById;
export const createProduct = productService.createProduct;
export const updateProduct = productService.updateProduct;
export const deleteProduct = productService.deleteProduct;