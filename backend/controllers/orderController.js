import Order from '../models/Order.js';
import { notifyNewOrder } from '../services/waService.js';

// Generate ID transaksi: CRG-XXXXX-XXXX
const generateOrderId = () => {
  const ts   = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CRG-${ts}-${rand}`;
};

// ─── CREATE ORDER (CHECKOUT) ───────────────────────────────────
// POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { userId, userName, customer, items, subtotal, shipping, total } = req.body;

    // Validasi field wajib
    if (!userId || !customer || !items?.length || !total) {
      return res.status(400).json({
        success: false,
        message: 'Field wajib: userId, customer, items, total'
      });
    }

    // Validasi customer
    const { name, phone, address, payment } = customer;
    if (!name || !phone || !address || !payment) {
      return res.status(400).json({
        success: false,
        message: 'Data customer wajib: name, phone, address, payment'
      });
    }

    // Validasi phone (min 10 digit)
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Nomor HP minimal 10 digit'
      });
    }

    const order = new Order({
      orderId: generateOrderId(),
      userId,
      userName: userName || 'Guest',
      customer: { name, phone, address, payment },
      items,
      subtotal: Number(subtotal) || 0,
      shipping: Number(shipping) || 0,
      total: Number(total),
      status: 'Diproses'
    });

    const saved = await order.save();

    // Kirim notifikasi WA ke owner (non-blocking)
    notifyNewOrder(saved).then(result => {
      if (result.success) {
        Order.findByIdAndUpdate(saved._id, { waNotified: true }).exec();
      }
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: saved.orderId,
        status: saved.status,
        total: saved.total,
        createdAt: saved.createdAt
      },
      message: 'Pesanan berhasil dibuat! Notifikasi dikirim ke penjual.'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET ALL ORDERS (Admin) ────────────────────────────────────
// GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Order.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET ORDERS BY USER ────────────────────────────────────────
// GET /api/orders/user/:userId
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: Number(req.params.userId) })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET ORDER BY ID ───────────────────────────────────────────
// GET /api/orders/:orderId
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── UPDATE ORDER STATUS (Admin) ──────────────────────────────
// PATCH /api/orders/:orderId/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status tidak valid. Pilihan: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { $set: { status } },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
    }

    res.json({ success: true, data: order, message: `Status diperbarui: ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
