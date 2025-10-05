import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getAllCategories); // Get all categories
router.get('/:id', getCategoryById); // Get category by ID with products

// Admin only routes (authentication + admin role required)
router.post('/', authenticateToken, requireAdmin, createCategory); // Create new category
router.put('/:id', authenticateToken, requireAdmin, updateCategory); // Update category
router.delete('/:id', authenticateToken, requireAdmin, deleteCategory); // Delete category

export default router;