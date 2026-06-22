import express from 'express';
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Require auth for all cart routes

router.get('/', getCart);
router.post('/', addToCart);
router.put('/', updateCartQuantity);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

export default router;
