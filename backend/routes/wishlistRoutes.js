import express from 'express';
import { getWishlist, toggleWishlist, isWishlisted } from '../controllers/wishlistController.js';

const router = express.Router();

// GET  /api/wishlist/:userId
router.get('/:userId', getWishlist);

// POST /api/wishlist/:userId
router.post('/:userId', toggleWishlist);

// GET  /api/wishlist/:userId/:productId
router.get('/:userId/:productId', isWishlisted);

export default router;
