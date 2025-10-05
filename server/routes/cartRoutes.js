import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All cart routes require authentication (users only)
router.get('/', authenticateToken, getCart); // Get user's cart
router.post('/add', authenticateToken, addToCart); // Add item to cart
router.put('/item/:cart_item_id', authenticateToken, updateCartItem); // Update cart item quantity
router.delete('/item/:cart_item_id', authenticateToken, removeFromCart); // Remove item from cart
router.delete('/clear', authenticateToken, clearCart); // Clear entire cart

export default router;