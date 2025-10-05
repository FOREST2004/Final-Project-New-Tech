import { apiClient, API_ENDPOINTS } from './apiConfig.js';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
const authService = {
  /**
   * Get user profile
   * @returns {Promise} User profile data
   */
  async getUserProfile() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.PROFILE);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Login response with token
   */
  async loginUser(email, password) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USERS.LOGIN, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  /**
   * Register new user
   * @param {string} username - User name
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Registration response
   */
  async registerUser(username, email, password) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USERS.REGISTER, {
        username,
        email,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  /**
   * Logout user (if needed for API call)
   * @returns {Promise} Logout response
   */
  async logoutUser() {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USERS.LOGOUT);
      return response.data;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }
};

export default authService;

// Named exports for convenience
export const getUserProfile = authService.getUserProfile;
export const loginUser = authService.loginUser;
export const registerUser = authService.registerUser;
export const logoutUser = authService.logoutUser;