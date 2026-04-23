// Cart module

const Cart = {
  CART_KEY: 'cireng_cart',
  WISHLIST_KEY: 'cireng_wishlist',

  getCart() {
    return JSON.parse(localStorage.getItem(this.CART_KEY) || '[]');
  },

  saveCart(cart) {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  },

  addItem(product, qty = 1) {
    const cart = this.getCart();
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ ...product, qty });
    }
    this.saveCart(cart);
    Utils.updateCartBadge();
  },

  removeItem(productId) {
    const cart = this.getCart().filter(i => i.id !== productId);
    this.saveCart(cart);
    Utils.updateCartBadge();
  },

  updateQty(productId, qty) {
    const cart = this.getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
      if (qty <= 0) {
        this.removeItem(productId);
        return;
      }
      item.qty = qty;
      this.saveCart(cart);
    }
    Utils.updateCartBadge();
  },

  clearCart() {
    localStorage.removeItem(this.CART_KEY);
    Utils.updateCartBadge();
  },

  getTotal() {
    return this.getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  getCount() {
    return this.getCart().reduce((sum, i) => sum + i.qty, 0);
  },

  // Wishlist
  getWishlist() {
    return JSON.parse(localStorage.getItem(this.WISHLIST_KEY) || '[]');
  },

  toggleWishlist(product) {
    const list = this.getWishlist();
    const idx = list.findIndex(i => i.id === product.id);
    if (idx >= 0) {
      list.splice(idx, 1);
      this.saveWishlist(list);
      return false;
    } else {
      list.push(product);
      this.saveWishlist(list);
      return true;
    }
  },

  isWishlisted(productId) {
    return this.getWishlist().some(i => i.id === productId);
  },

  saveWishlist(list) {
    localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(list));
  }
};
