// ─── API Configuration ─────────────────────────────────────────
// Ganti BASE_URL sesuai environment:
// - Development (lokal) : http://localhost:5000
// - Production (Railway): https://dedesurahmanutsweb2-production.up.railway.app

const BASE_URL = 'https://dedesurahmanutsweb2-production.up.railway.app';

// ─── API Endpoints ─────────────────────────────────────────────
const API = {
  // Auth
  register:    `${BASE_URL}/api/auth/register`,
  login:       `${BASE_URL}/api/auth/login`,
  profile:     (userId)    => `${BASE_URL}/api/auth/profile/${userId}`,
  allUsers:    `${BASE_URL}/api/auth/users`,

  // Products
  products:    `${BASE_URL}/api/products`,
  product:     (id)        => `${BASE_URL}/api/products/${id}`,

  // Cart
  cart:        (userId)    => `${BASE_URL}/api/cart/${userId}`,
  cartItem:    (userId, productId) => `${BASE_URL}/api/cart/${userId}/${productId}`,

  // Wishlist
  wishlist:    (userId)    => `${BASE_URL}/api/wishlist/${userId}`,
  wishlistCheck: (userId, productId) => `${BASE_URL}/api/wishlist/${userId}/${productId}`,

  // Orders
  orders:      `${BASE_URL}/api/orders`,
  userOrders:  (userId)    => `${BASE_URL}/api/orders/user/${userId}`,
  orderDetail: (orderId)   => `${BASE_URL}/api/orders/${orderId}`,
  orderStatus: (orderId)   => `${BASE_URL}/api/orders/${orderId}/status`,

  // Ratings
  ratings:     `${BASE_URL}/api/ratings`,
  userRating:  (userId, productId) => `${BASE_URL}/api/ratings/${userId}/${productId}`,
  userRatings: (userId)    => `${BASE_URL}/api/ratings/user/${userId}`,

  // Admin
  adminStats:  `${BASE_URL}/api/admin/stats`,
  recentOrders:`${BASE_URL}/api/admin/recent-orders`,
};

// ─── Helper fetch dengan error handling ────────────────────────
const apiFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API Error:', error.message);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};
