import express from 'express';
import { getDashboardStats, getRecentOrders } from '../controllers/adminController.js';

const router = express.Router();

// GET /api/admin/stats
router.get('/stats', getDashboardStats);

// GET /api/admin/recent-orders
router.get('/recent-orders', getRecentOrders);

export default router;
