// Products module

const Products = {
  RATINGS_KEY: 'cireng_ratings',
  IMAGES_KEY: 'cireng_images',
  all: [],

  async load() {
    if (this.all.length) return this.all;
    const res = await fetch('data/products.json');
    this.all = await res.json();
    return this.all;
  },

  // Get custom uploaded image for a product (base64), fallback to original
  getImage(product) {
    const overrides = JSON.parse(localStorage.getItem(this.IMAGES_KEY) || '{}');
    return overrides[product.id] || product.image;
  },

  // Save uploaded image as base64
  saveImage(productId, base64) {
    const overrides = JSON.parse(localStorage.getItem(this.IMAGES_KEY) || '{}');
    overrides[productId] = base64;
    localStorage.setItem(this.IMAGES_KEY, JSON.stringify(overrides));
  },

  // Remove custom image (revert to original)
  removeImage(productId) {
    const overrides = JSON.parse(localStorage.getItem(this.IMAGES_KEY) || '{}');
    delete overrides[productId];
    localStorage.setItem(this.IMAGES_KEY, JSON.stringify(overrides));
  },

  filter({ search = '', category = '', minPrice = 0, maxPrice = Infinity, sort = '' } = {}) {
    let result = [...this.all];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.nama.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    if (category && category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    if (minPrice) result = result.filter(p => p.price >= minPrice);
    if (maxPrice !== Infinity) result = result.filter(p => p.price <= maxPrice);

    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sort === 'popular') result.sort((a, b) => b.sold - a.sold);

    return result;
  },

  getById(id) {
    return this.all.find(p => p.id === parseInt(id));
  },

  // User ratings stored in localStorage
  getRatings() {
    return JSON.parse(localStorage.getItem(this.RATINGS_KEY) || '{}');
  },

  getUserRating(productId) {
    const user = Utils.getCurrentUser();
    if (!user) return 0;
    const ratings = this.getRatings();
    return ratings[`${user.id}_${productId}`] || 0;
  },

  rateProduct(productId, stars) {
    const user = Utils.getCurrentUser();
    if (!user) return;
    const ratings = this.getRatings();
    ratings[`${user.id}_${productId}`] = stars;
    localStorage.setItem(this.RATINGS_KEY, JSON.stringify(ratings));
  },

  renderCard(product, compact = false) {
    const wishlisted = Cart.isWishlisted(product.id);
    const userRating = this.getUserRating(product.id);
    const imgSrc = this.getImage(product);

    return `
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col" data-id="${product.id}">
        <div class="relative overflow-hidden">
          <img src="${imgSrc}" alt="${product.nama}"
            class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onerror="this.src='https://via.placeholder.com/400x300?text=Cireng'">
          <button onclick="Products.handleWishlist(${product.id})" 
            class="absolute top-2 right-2 w-9 h-9 rounded-full bg-white dark:bg-gray-700 shadow flex items-center justify-center text-lg hover:scale-110 transition-transform wishlist-btn-${product.id}">
            ${wishlisted ? '❤️' : '🤍'}
          </button>
          <span class="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full capitalize">${product.category}</span>
          ${product.stock <= 10 ? `<span class="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Stok Terbatas!</span>` : ''}
        </div>
        <div class="p-4 flex flex-col flex-1">
          <h3 class="font-bold text-gray-800 dark:text-white text-sm mb-1 line-clamp-2">${product.nama}</h3>
          <p class="text-gray-500 dark:text-gray-400 text-xs mb-2 line-clamp-2 flex-1">${product.description}</p>
          <div class="flex items-center gap-1 mb-2">
            <span class="text-yellow-400 text-sm">${Utils.renderStars(product.rating)}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">(${product.rating}) · ${product.sold} terjual</span>
          </div>
          <div class="flex items-center justify-between mt-auto">
            <span class="text-orange-600 dark:text-orange-400 font-bold text-base">${Utils.formatRupiah(product.price)}</span>
            <div class="flex gap-1">
              <button onclick="Products.showDetail(${product.id})"
                class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                Detail
              </button>
              <button onclick="Products.handleAddToCart(${product.id})"
                class="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg transition font-semibold">
                + Keranjang
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  handleAddToCart(productId) {
    const user = Utils.getCurrentUser();
    if (!user) {
      Utils.showToast('Silakan login terlebih dahulu!', 'warning');
      setTimeout(() => window.location.href = 'index.html', 1500);
      return;
    }
    const product = this.getById(productId);
    Cart.addItem(product);
    Utils.showToast(`${product.nama} ditambahkan ke keranjang!`, 'success');
  },

  handleWishlist(productId) {
    const user = Utils.getCurrentUser();
    if (!user) {
      Utils.showToast('Silakan login terlebih dahulu!', 'warning');
      return;
    }
    const product = this.getById(productId);
    const added = Cart.toggleWishlist(product);
    const btn = document.querySelector(`.wishlist-btn-${productId}`);
    if (btn) btn.textContent = added ? '❤️' : '🤍';
    Utils.showToast(added ? `${product.nama} ditambahkan ke wishlist!` : `Dihapus dari wishlist.`, added ? 'success' : 'info');
  },

  showDetail(productId) {
    const product = this.getById(productId);
    if (!product) return;
    const userRating = this.getUserRating(productId);
    const imgSrc = this.getImage(product);

    const modal = document.getElementById('product-modal');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
      <div class="flex flex-col md:flex-row gap-6">
        <img src="${imgSrc}" alt="${product.nama}" 
          class="w-full md:w-64 h-56 md:h-64 object-cover rounded-xl"
          onerror="this.src='https://via.placeholder.com/400x300?text=Cireng'">
        <div class="flex-1">
          <span class="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 text-xs font-bold px-2 py-1 rounded-full capitalize">${product.category}</span>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white mt-2">${product.nama}</h2>
          <div class="flex items-center gap-2 my-2">
            <span class="text-yellow-400 text-lg">${Utils.renderStars(product.rating)}</span>
            <span class="text-sm text-gray-500 dark:text-gray-400">${product.rating} · ${product.sold} terjual</span>
          </div>
          <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">${product.description}</p>
          <p class="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">${Utils.formatRupiah(product.price)}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Stok: <span class="${product.stock <= 10 ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}">${product.stock} pcs</span></p>
          
          <div class="mb-4">
            <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Beri Rating:</p>
            <div class="flex gap-1" id="star-rating">
              ${[1,2,3,4,5].map(s => `
                <button onclick="Products.setRating(${product.id}, ${s})" 
                  class="text-2xl transition-transform hover:scale-125 star-btn ${s <= userRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}"
                  data-star="${s}">★</button>
              `).join('')}
            </div>
          </div>

          <div class="flex gap-2">
            <button onclick="Products.handleWishlist(${product.id}); document.getElementById('product-modal').classList.add('hidden')"
              class="flex-1 border-2 border-orange-500 text-orange-500 dark:text-orange-400 py-2 rounded-xl font-semibold hover:bg-orange-50 dark:hover:bg-orange-900/20 transition">
              ${Cart.isWishlisted(product.id) ? '❤️ Wishlisted' : '🤍 Wishlist'}
            </button>
            <button onclick="Products.handleAddToCart(${product.id}); document.getElementById('product-modal').classList.add('hidden')"
              class="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl font-semibold transition">
              🛒 Tambah ke Keranjang
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
  },

  setRating(productId, stars) {
    const user = Utils.getCurrentUser();
    if (!user) {
      Utils.showToast('Login untuk memberi rating!', 'warning');
      return;
    }
    this.rateProduct(productId, stars);
    document.querySelectorAll('#star-rating .star-btn').forEach(btn => {
      const s = parseInt(btn.dataset.star);
      btn.classList.toggle('text-yellow-400', s <= stars);
      btn.classList.toggle('text-gray-300', s > stars);
      btn.classList.toggle('dark:text-gray-600', s > stars);
    });
    Utils.showToast(`Rating ${stars} bintang diberikan!`, 'success');
  }
};
