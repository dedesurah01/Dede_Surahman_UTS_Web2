// Checkout & Orders module

const Orders = {
  ORDERS_KEY: 'cireng_orders',
  // expose key for admin panel direct access

  getOrders() {
    return JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]');
  },

  getUserOrders(userId) {
    return this.getOrders().filter(o => o.userId === userId);
  },

  saveOrder(order) {
    const orders = this.getOrders();
    orders.unshift(order);
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
  },

  createOrder({ userId, userName, items, total, customer }) {
    const order = {
      id: Utils.generateTxId(),
      userId,
      userName,
      customer,
      items,
      total,
      status: 'Diproses',
      createdAt: new Date().toISOString()
    };
    this.saveOrder(order);
    return order;
  },

  getStatusBadge(status) {
    const map = {
      'Diproses': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      'Dikirim': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'Selesai': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'Dibatalkan': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  }
};
