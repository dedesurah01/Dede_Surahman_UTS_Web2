import WishlistModel from '../models/Wishlist.js';

const getOrCreate = async (userId) => {
  let wl = await WishlistModel.findOne({ userId });
  if (!wl) wl = await WishlistModel.create({ userId, items: [] });
  return wl;
};

// ─── GET WISHLIST ──────────────────────────────────────────────
// GET /api/wishlist/:userId
export const getWishlist = async (req, res) => {
  try {
    const wl = await getOrCreate(Number(req.params.userId));
    res.json({ success: true, data: wl.items, total: wl.items.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── TOGGLE WISHLIST ───────────────────────────────────────────
// POST /api/wishlist/:userId
// Body: { product }
export const toggleWishlist = async (req, res) => {
  try {
    const { product } = req.body;
    if (!product || !product.id) {
      return res.status(400).json({ success: false, message: 'Data produk tidak valid' });
    }

    const wl = await getOrCreate(Number(req.params.userId));
    const idx = wl.items.findIndex(i => i.id === product.id);
    let added;

    if (idx >= 0) {
      wl.items.splice(idx, 1);
      added = false;
    } else {
      wl.items.push(product);
      added = true;
    }

    await wl.save();
    res.json({
      success: true,
      added,
      data: wl.items,
      message: added ? `${product.nama} ditambahkan ke wishlist!` : 'Dihapus dari wishlist'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── CHECK IS WISHLISTED ───────────────────────────────────────
// GET /api/wishlist/:userId/:productId
export const isWishlisted = async (req, res) => {
  try {
    const wl = await getOrCreate(Number(req.params.userId));
    const wishlisted = wl.items.some(i => i.id === Number(req.params.productId));
    res.json({ success: true, wishlisted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
