import CartModel from '../models/Cart.js';

// Helper: get or create cart
const getOrCreateCart = async (userId) => {
  let cart = await CartModel.findOne({ userId });
  if (!cart) cart = await CartModel.create({ userId, items: [] });
  return cart;
};

// ─── GET CART ──────────────────────────────────────────────────
// GET /api/cart/:userId
export const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(Number(req.params.userId));
    const total = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const count = cart.items.reduce((sum, i) => sum + i.qty, 0);
    res.json({ success: true, data: cart.items, total, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── ADD TO CART ───────────────────────────────────────────────
// POST /api/cart/:userId
// Body: { product, qty }
export const addToCart = async (req, res) => {
  try {
    const { product, qty = 1 } = req.body;
    if (!product || !product.id) {
      return res.status(400).json({ success: false, message: 'Data produk tidak valid' });
    }

    const cart = await getOrCreateCart(Number(req.params.userId));
    const existing = cart.items.find(i => i.id === product.id);

    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({ ...product, qty });
    }

    await cart.save();
    const total = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    res.json({ success: true, data: cart.items, total, message: `${product.nama} ditambahkan ke keranjang!` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── UPDATE QTY ────────────────────────────────────────────────
// PUT /api/cart/:userId/:productId
// Body: { qty }
export const updateQty = async (req, res) => {
  try {
    const { qty } = req.body;
    const productId = Number(req.params.productId);
    const cart = await getOrCreateCart(Number(req.params.userId));

    if (qty <= 0) {
      cart.items = cart.items.filter(i => i.id !== productId);
    } else {
      const item = cart.items.find(i => i.id === productId);
      if (!item) return res.status(404).json({ success: false, message: 'Item tidak ditemukan di keranjang' });
      item.qty = qty;
    }

    await cart.save();
    const total = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    res.json({ success: true, data: cart.items, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── REMOVE FROM CART ──────────────────────────────────────────
// DELETE /api/cart/:userId/:productId
export const removeFromCart = async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const cart = await getOrCreateCart(Number(req.params.userId));
    cart.items = cart.items.filter(i => i.id !== productId);
    await cart.save();
    const total = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    res.json({ success: true, data: cart.items, total, message: 'Item dihapus dari keranjang' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── CLEAR CART ────────────────────────────────────────────────
// DELETE /api/cart/:userId
export const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(Number(req.params.userId));
    cart.items = [];
    await cart.save();
    res.json({ success: true, data: [], total: 0, message: 'Keranjang dikosongkan' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
