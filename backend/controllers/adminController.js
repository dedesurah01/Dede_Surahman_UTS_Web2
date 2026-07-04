import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// ─── DASHBOARD STATS ───────────────────────────────────────────
// GET /api/admin/stats
export const getDashboardStats = async (req, res) => {
  try {
    const [totalOrders, totalUsers, totalProducts, orders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments(),
      Order.find({}, 'total status createdAt')
    ]);

    const totalRevenue = orders
      .filter(o => o.status !== 'Dibatalkan')
      .reduce((sum, o) => sum + o.total, 0);

    const statusCount = {
      Diproses: 0, Dikirim: 0, Selesai: 0, Dibatalkan: 0
    };
    orders.forEach(o => { if (statusCount[o.status] !== undefined) statusCount[o.status]++; });

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        totalUsers,
        totalProducts,
        statusCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET RECENT ORDERS ─────────────────────────────────────────
// GET /api/admin/recent-orders?limit=5
export const getRecentOrders = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
