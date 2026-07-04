import express from 'express';
import { getCart, addToCart, updateQty, removeFromCart, clearCart } from '../controllers/cartController.js';

const router = express.Router();

// GET    /api/cart/:userId
router.get('/:userId', getCart);

// POST   /api/cart/:userId
router.post('/:userId', addToCart);

// PUT    /api/cart/:userId/:productId
router.put('/:userId/:productId', updateQty);

// DELETE /api/cart/:userId/:productId
router.delete('/:userId/:productId', removeFromCart);

// DELETE /api/cart/:userId
router.delete('/:userId', clearCart);

export default router;
