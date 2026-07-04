import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  searchProducts
} from '../controllers/productController.js';

const router = express.Router();

// Multer config — simpan upload ke folder uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `product-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const isValid = allowed.test(path.extname(file.originalname).toLowerCase()) 
               && allowed.test(file.mimetype);
  isValid ? cb(null, true) : cb(new Error('Hanya file gambar (jpg, png, webp) yang diizinkan!'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // maks 2MB
});

// ─── Routes ────────────────────────────────────────────────────

// GET  /api/products?search=&category=&minPrice=&maxPrice=&sort=&page=&limit=
router.get('/', getAllProducts);

// GET  /api/products/search?q=
router.get('/search', searchProducts);

// GET  /api/products/:id
router.get('/:id', getProductById);

// POST /api/products
router.post('/', createProduct);

// PUT  /api/products/:id
router.put('/:id', updateProduct);

// DELETE /api/products/:id
router.delete('/:id', deleteProduct);

// PATCH /api/products/:id/image  (upload gambar)
router.patch('/:id/image', upload.single('image'), uploadProductImage);

export default router;
