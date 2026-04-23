// Utility functions

const Utils = {
  // Format currency to IDR
  formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  },

  // Generate unique transaction ID
  generateTxId() {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CRG-${ts}-${rand}`;
  },

  // Show toast notification
  showToast(message, type = 'success') {
    const existing = document.getElementById('toast-container');
    if (!existing) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
      warning: 'bg-yellow-500'
    };
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠'
    };

    toast.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-64 transform translate-x-full transition-transform duration-300`;
    toast.innerHTML = `<span class="font-bold text-lg">${icons[type]}</span><span>${message}</span>`;

    document.getElementById('toast-container').appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-x-full');
    });

    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // Get current logged-in user
  getCurrentUser() {
    const session = localStorage.getItem('cireng_session');
    return session ? JSON.parse(session) : null;
  },

  // Require auth - redirect if not logged in
  requireAuth() {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = 'index.html';
      return null;
    }
    return user;
  },

  // Redirect if already logged in
  redirectIfLoggedIn() {
    const user = this.getCurrentUser();
    if (user) {
      window.location.href = user.role === 'admin' ? 'admin.html' : 'shop.html';
    }
  },

  // Update navbar cart count
  updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const cart = Cart.getCart();
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    badge.textContent = total;
    badge.classList.toggle('hidden', total === 0);
  },

  // Dark mode toggle
  initDarkMode() {
    const isDark = localStorage.getItem('cireng_dark') === 'true';
    if (isDark) document.documentElement.classList.add('dark');

    const btn = document.getElementById('dark-toggle');
    if (btn) {
      btn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const nowDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('cireng_dark', nowDark);
        btn.textContent = nowDark ? '☀️' : '🌙';
      });
      const nowDark = document.documentElement.classList.contains('dark');
      btn.textContent = nowDark ? '☀️' : '🌙';
    }
  },

  // Render star rating
  renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < full; i++) stars += '★';
    if (half) stars += '½';
    const empty = 5 - full - (half ? 1 : 0);
    for (let i = 0; i < empty; i++) stars += '☆';
    return stars;
  }
};
