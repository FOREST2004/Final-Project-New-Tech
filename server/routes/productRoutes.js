import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getAllProducts); // Get all products with pagination and filters
router.get('/:id', getProductById); // Get product by ID

// Admin only routes (authentication + admin role required)
router.post('/', authenticateToken, requireAdmin, createProduct); // Create new product
router.put('/:id', authenticateToken, requireAdmin, updateProduct); // Update product
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct); // Delete product

export default router;