import Rating from '../models/Rating.js';

// ─── RATE PRODUCT ──────────────────────────────────────────────
// POST /api/ratings
// Body: { userId, productId, stars }
export const rateProduct = async (req, res) => {
  try {
    const { userId, productId, stars } = req.body;

    if (!userId || !productId || !stars) {
      return res.status(400).json({ success: false, message: 'userId, productId, stars wajib diisi' });
    }
    if (stars < 1 || stars > 5) {
      return res.status(400).json({ success: false, message: 'Rating harus antara 1-5' });
    }

    // Upsert — update jika sudah ada, insert jika belum
    const rating = await Rating.findOneAndUpdate(
      { userId: Number(userId), productId: Number(productId) },
      { stars: Number(stars) },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: rating, message: `Rating ${stars} bintang diberikan!` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET USER RATING FOR PRODUCT ──────────────────────────────
// GET /api/ratings/:userId/:productId
export const getUserRating = async (req, res) => {
  try {
    const rating = await Rating.findOne({
      userId: Number(req.params.userId),
      productId: Number(req.params.productId)
    });
    res.json({ success: true, stars: rating ? rating.stars : 0 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET ALL RATINGS BY USER ───────────────────────────────────
// GET /api/ratings/user/:userId
export const getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ userId: Number(req.params.userId) });
    // Format: { productId: stars, ... }
    const map = {};
    ratings.forEach(r => { map[r.productId] = r.stars; });
    res.json({ success: true, data: map });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
