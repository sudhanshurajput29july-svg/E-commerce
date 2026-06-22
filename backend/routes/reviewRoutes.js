import express from 'express';
import {
  addProductReview,
  getProductReviews,
  deleteReview,
  getAllReviews
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);

// Protected actions
router.post('/', protect, addProductReview);
router.delete('/:id', protect, deleteReview);

// Admin actions
router.get('/', protect, admin, getAllReviews);

export default router;
