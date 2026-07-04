import express from 'express';
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();

// POST /api/orders                    — Checkout & buat order baru
router.post('/', createOrder);

// GET  /api/orders                    — Semua order (admin)
router.get('/', getAllOrders);

// GET  /api/orders/user/:userId       — Order by user
router.get('/user/:userId', getUserOrders);

// GET  /api/orders/:orderId           — Detail order by ID
router.get('/:orderId', getOrderById);

// PATCH /api/orders/:orderId/status   — Update status order (admin)
router.patch('/:orderId/status', updateOrderStatus);

export default router;
