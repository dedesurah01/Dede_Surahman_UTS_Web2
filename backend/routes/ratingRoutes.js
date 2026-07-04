import express from 'express';
import { rateProduct, getUserRating, getUserRatings } from '../controllers/ratingController.js';

const router = express.Router();

// POST /api/ratings
router.post('/', rateProduct);

// GET  /api/ratings/user/:userId  (semua rating milik user)
router.get('/user/:userId', getUserRatings);

// GET  /api/ratings/:userId/:productId
router.get('/:userId/:productId', getUserRating);

export default router;
