// Cart & Wishlist module — integrated with Railway API

const Cart = {
  // LocalStorage keys sebagai cache lokal
  CART_KEY: 'cireng_cart',
  WISHLIST_KEY: 'cireng_wishlist',

  _getUser() {
    return Utils.getCurrentUser();
  },

  // ─── CART ──────────────────────────────────────────────────

  getCart() {
    return JSON.parse(localStorage.getItem(this.CART_KEY) || '[]');
  },

  saveCart(cart) {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  },

  async addItem(product, qty = 1) {
    const user = this._getUser();
    if (user) {
      try {
        const res = await apiFetch(API.cart(user.id), {
          method: 'POST',
          body: JSON.stringify({ product, qty })
        });
        if (res.success) {
          this.saveCart(res.data);
          Utils.updateCartBadge();
          return;
        }
      } catch {}
    }
    // Fallback LocalStorage
    const cart = this.getCart();
    const existing = cart.find(i => i.id === product.id);
    if (existing) { existing.qty += qty; } else { cart.push({ ...product, qty }); }
    this.saveCart(cart);
    Utils.updateCartBadge();
  },

  async removeItem(productId) {
    const user = this._getUser();
    if (user) {
      try {
        const res = await apiFetch(API.cartItem(user.id, productId), { method: 'DELETE' });
        if (res.success) { this.saveCart(res.data); Utils.updateCartBadge(); return; }
      } catch {}
    }
    this.saveCart(this.getCart().filter(i => i.id !== productId));
    Utils.updateCartBadge();
  },

  async updateQty(productId, qty) {
    if (qty <= 0) { await this.removeItem(productId); return; }
    const user = this._getUser();
    if (user) {
      try {
        const res = await apiFetch(API.cartItem(user.id, productId), {
          method: 'PUT',
          body: JSON.stringify({ qty })
        });
        if (res.success) { this.saveCart(res.data); Utils.updateCartBadge(); return; }
      } catch {}
    }
    const cart = this.getCart();
    const item = cart.find(i => i.id === productId);
    if (item) { item.qty = qty; this.saveCart(cart); }
    Utils.updateCartBadge();
  },

  async clearCart() {
    const user = this._getUser();
    if (user) {
      try {
        await apiFetch(API.cart(user.id), { method: 'DELETE' });
      } catch {}
    }
    localStorage.removeItem(this.CART_KEY);
    Utils.updateCartBadge();
  },

  async syncFromAPI() {
    const user = this._getUser();
    if (!user) return;
    try {
      const res = await apiFetch(API.cart(user.id));
      if (res.success) { this.saveCart(res.data); Utils.updateCartBadge(); }
    } catch {}
  },

  getTotal() {
    return this.getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  getCount() {
    return this.getCart().reduce((sum, i) => sum + i.qty, 0);
  },

  // ─── WISHLIST ───────────────────────────────────────────────

  getWishlist() {
    return JSON.parse(localStorage.getItem(this.WISHLIST_KEY) || '[]');
  },

  saveWishlist(list) {
    localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(list));
  },

  async toggleWishlist(product) {
    const user = this._getUser();
    if (user) {
      try {
        const res = await apiFetch(API.wishlist(user.id), {
          method: 'POST',
          body: JSON.stringify({ product })
        });
        if (res.success) {
          this.saveWishlist(res.data);
          return res.added;
        }
      } catch {}
    }
    // Fallback LocalStorage
    const list = this.getWishlist();
    const idx = list.findIndex(i => i.id === product.id);
    if (idx >= 0) { list.splice(idx, 1); this.saveWishlist(list); return false; }
    list.push(product); this.saveWishlist(list); return true;
  },

  isWishlisted(productId) {
    return this.getWishlist().some(i => i.id === productId);
  },

  async syncWishlistFromAPI() {
    const user = this._getUser();
    if (!user) return;
    try {
      const res = await apiFetch(API.wishlist(user.id));
      if (res.success) this.saveWishlist(res.data);
    } catch {}
  }
};
