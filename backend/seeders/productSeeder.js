// Seeder — jalankan sekali untuk mengisi database dari products.json
// Cara pakai: node seeders/productSeeder.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const seed = async () => {
  await connectDB();

  try {
    // Hapus semua produk lama
    await Product.deleteMany({});
    console.log('🗑  Data produk lama dihapus');

    // Baca data dari products.json
    const jsonPath = join(__dirname, '../../cireng-shop/data/products.json');
    const products = JSON.parse(readFileSync(jsonPath, 'utf-8'));

    // Insert semua produk
    await Product.insertMany(products);
    console.log(`✅ ${products.length} produk berhasil dimasukkan ke database`);
  } catch (error) {
    console.error('❌ Seeder error:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Koneksi MongoDB ditutup');
  }
};

seed();
