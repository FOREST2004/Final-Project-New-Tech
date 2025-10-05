import { apiClient, API_ENDPOINTS } from './apiConfig';

/**
 * Category Service - Handles all category-related API calls
 */
export const categoryService = {
  /**
   * Fetch all categories
   * @returns {Promise<Array>} Array of categories
   */
  async getCategories() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIES);
      console.log('Categories response:', response.data);
      return response.data.data || [];
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
      throw new Error('Không thể tải danh mục. Vui lòng thử lại sau.');
    }
  },

  /**
   * Get category by ID
   * @param {string|number} categoryId - Category ID
   * @returns {Promise<Object>} Category details
   */
  async getCategoryById(categoryId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CATEGORIES}/${categoryId}`);
      return response.data.data;
    } catch (error) {
      console.error('Lỗi khi tải chi tiết danh mục:', error);
      throw new Error('Không thể tải chi tiết danh mục.');
    }
  }
};

export default categoryService;

// Named exports for convenience
export const getCategories = categoryService.getCategories;
export const getCategoryById = categoryService.getCategoryById;