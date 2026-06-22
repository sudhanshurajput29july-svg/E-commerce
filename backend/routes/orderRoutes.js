import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getMyOrders,
  getOrders,
  getDashboardStats
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Require auth for all order routes

// Customer order paths
router.post('/', addOrderItems);
router.get('/myorders', getMyOrders);

// Admin-specific analytics and lists
router.get('/admin/dashboard', admin, getDashboardStats);
router.get('/', admin, getOrders);

// Specific order details and updates
router.get('/:id', getOrderById);
router.put('/:id/pay', updateOrderToPaid);
router.put('/:id/status', admin, updateOrderStatus);

export default router;
