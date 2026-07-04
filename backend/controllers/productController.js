import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';

// ─── GET ALL PRODUCTS ───────────────────────────────────────────
// GET /api/products
// Query: search, category, minPrice, maxPrice, sort, page, limit
export const getAllProducts = async (req, res) => {
  try {
    const {
      search = '',
      category = '',
      minPrice,
      maxPrice,
      sort = '',
      page = 1,
      limit = 12
    } = req.query;

    const filter = {};

    // Search by nama or description
    if (search) {
      filter.$or = [
        { nama: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Sort options
    const sortMap = {
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'rating': { rating: -1 },
      'popular': { sold: -1 }
    };
    const sortOption = sortMap[sort] || { id: 1 };

    // Pagination
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── SEARCH PRODUCTS ───────────────────────────────────────────
// GET /api/products/search?q=ayam
export const searchProducts = async (req, res) => {
  try {
    const { q = '' } = req.query;

    const products = await Product.find({
      $or: [
        { nama: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);

    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET PRODUCT BY ID ─────────────────────────────────────────
// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── CREATE PRODUCT ────────────────────────────────────────────
// POST /api/products
// Body: { nama, price, image, description, category, stock, rating?, sold? }
export const createProduct = async (req, res) => {
  try {
    const { nama, price, image, description, category, stock, rating, sold } = req.body;

    // Validasi field wajib
    if (!nama || !price || !image || !description || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Field wajib: nama, price, image, description, category, stock'
      });
    }

    // Auto-generate id (increment dari id terbesar)
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const newId = lastProduct ? lastProduct.id + 1 : 1;

    const product = new Product({
      id: newId,
      nama,
      price: Number(price),
      image,
      description,
      category,
      stock: Number(stock),
      rating: rating ? Number(rating) : 0,
      sold: sold ? Number(sold) : 0
    });

    const saved = await product.save();
    res.status(201).json({ success: true, data: saved, message: 'Produk berhasil ditambahkan' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'ID produk sudah ada' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── UPDATE PRODUCT ────────────────────────────────────────────
// PUT /api/products/:id
// Body: field yang ingin diubah (partial update didukung)
export const updateProduct = async (req, res) => {
  try {
    const { nama, price, image, description, category, stock, rating, sold } = req.body;

    const updateData = {};
    if (nama !== undefined) updateData.nama = nama;
    if (price !== undefined) updateData.price = Number(price);
    if (image !== undefined) updateData.image = image;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (stock !== undefined) updateData.stock = Number(stock);
    if (rating !== undefined) updateData.rating = Number(rating);
    if (sold !== undefined) updateData.sold = Number(sold);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada field yang diubah' });
    }

    const product = await Product.findOneAndUpdate(
      { id: Number(req.params.id) },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    res.json({ success: true, data: product, message: 'Produk berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE PRODUCT ────────────────────────────────────────────
// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: Number(req.params.id) });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    // Hapus file gambar lokal jika bukan URL eksternal
    if (product.image && product.image.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), product.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.json({ success: true, message: `Produk "${product.nama}" berhasil dihapus` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── UPLOAD PRODUCT IMAGE ──────────────────────────────────────
// PATCH /api/products/:id/image
// Form-data: image (file)
export const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'File gambar wajib diupload' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const product = await Product.findOneAndUpdate(
      { id: Number(req.params.id) },
      { $set: { image: imageUrl } },
      { new: true }
    );

    if (!product) {
      // Hapus file yang sudah diupload jika produk tidak ditemukan
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    res.json({
      success: true,
      data: { imageUrl, product },
      message: 'Gambar produk berhasil diperbarui'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
