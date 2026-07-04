// Checkout & Orders module — integrated with Railway API

const Orders = {
  ORDERS_KEY: 'cireng_orders',

  getStatusBadge(status) {
    const map = {
      'Diproses':   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      'Dikirim':    'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'Selesai':    'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'Dibatalkan': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  },

  // ─── CREATE ORDER ───────────────────────────────────────────
  async createOrder({ userId, userName, items, total, customer }) {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = total - subtotal;

    try {
      const res = await apiFetch(API.orders, {
        method: 'POST',
        body: JSON.stringify({ userId, userName, customer, items, subtotal, shipping, total })
      });

      if (res.success) {
        // Simpan juga ke LocalStorage sebagai cache
        const order = {
          id: res.data.orderId,
          orderId: res.data.orderId,
          userId, userName, customer, items, subtotal, shipping, total,
          status: res.data.status,
          createdAt: res.data.createdAt
        };
        this._saveToLocal(order);
        return { success: true, order };
      }
      return { success: false, message: res.message };
    } catch {
      // Fallback LocalStorage
      const order = {
        id: Utils.generateTxId(),
        orderId: Utils.generateTxId(),
        userId, userName, customer, items,
        subtotal, shipping, total,
        status: 'Diproses',
        createdAt: new Date().toISOString()
      };
      this._saveToLocal(order);
      return { success: true, order };
    }
  },

  _saveToLocal(order) {
    const orders = JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]');
    orders.unshift(order);
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
  },

  // ─── GET USER ORDERS ────────────────────────────────────────
  async getUserOrders(userId) {
    try {
      const res = await apiFetch(API.userOrders(userId));
      if (res.success) {
        // Normalize field orderId → id untuk kompatibilitas tampilan
        return res.data.map(o => ({ ...o, id: o.orderId || o.id }));
      }
    } catch {}
    // Fallback LocalStorage
    const orders = JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]');
    return orders.filter(o => o.userId === userId);
  },

  // ─── GET ALL ORDERS (Admin) ─────────────────────────────────
  async getAllOrders() {
    try {
      const res = await apiFetch(API.orders);
      if (res.success) return res.data.map(o => ({ ...o, id: o.orderId || o.id }));
    } catch {}
    return JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]');
  },

  // ─── UPDATE ORDER STATUS (Admin) ────────────────────────────
  async updateStatus(orderId, status) {
    try {
      const res = await apiFetch(API.orderStatus(orderId), {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      return res;
    } catch {
      return { success: false, message: 'Gagal update status' };
    }
  },

  // Kompatibilitas dengan kode lama yang pakai getOrders() synchronous
  getOrders() {
    return JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]');
  }
};
