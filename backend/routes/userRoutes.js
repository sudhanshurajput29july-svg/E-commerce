import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUser,
  getWishlist,
  toggleWishlist
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User profile endpoints
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Wishlist endpoints
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist', protect, toggleWishlist);

// Admin-only user directory paths
router.get('/', protect, admin, getUsers);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

export default router;
