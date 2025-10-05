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
  },

  /**
   * Create new category
   * @param {Object} categoryData - Category data {name, description}
   * @returns {Promise<Object>} Created category
   */
  async createCategory(categoryData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CATEGORIES, categoryData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo danh mục:', error);
      throw new Error('Không thể tạo danh mục. Vui lòng thử lại sau.');
    }
  },

  /**
   * Update category
   * @param {string|number} categoryId - Category ID
   * @param {Object} categoryData - Updated category data {name, description}
   * @returns {Promise<Object>} Updated category
   */
  async updateCategory(categoryId, categoryData) {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.CATEGORIES}/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật danh mục:', error);
      throw new Error('Không thể cập nhật danh mục. Vui lòng thử lại sau.');
    }
  },

  /**
   * Delete category
   * @param {string|number} categoryId - Category ID
   * @returns {Promise<Object>} Delete response
   */
  async deleteCategory(categoryId) {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.CATEGORIES}/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa danh mục:', error);
      throw new Error('Không thể xóa danh mục. Vui lòng thử lại sau.');
    }
  }
};

export default categoryService;

// Named exports for convenience
export const getCategories = categoryService.getCategories;
export const getCategoryById = categoryService.getCategoryById;
export const createCategory = categoryService.createCategory;
export const updateCategory = categoryService.updateCategory;
export const deleteCategory = categoryService.deleteCategory;