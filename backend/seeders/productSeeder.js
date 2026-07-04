// Seeder — jalankan sekali untuk mengisi database dari products.json
// Cara pakai: node seeders/productSeeder.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const products = [
  { id: 1,  nama: "Cireng Isi Ayam Pedas",   price: 15000, category: "pedas",      rating: 4.8, sold: 320, stock: 50, description: "Cireng kenyal isi ayam suwir pedas dengan bumbu rempah pilihan. Cocok untuk camilan sore hari.", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop" },
  { id: 2,  nama: "Cireng Isi Keju",          price: 18000, category: "original",   rating: 4.9, sold: 510, stock: 40, description: "Cireng lembut dengan isian keju mozzarella yang meleleh. Favorit anak-anak dan keluarga.", image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop" },
  { id: 3,  nama: "Cireng Isi Daging Sapi",   price: 20000, category: "original",   rating: 4.7, sold: 210, stock: 30, description: "Cireng premium isi daging sapi cincang berbumbu. Kenyang dan lezat untuk makan siang.", image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop" },
  { id: 4,  nama: "Cireng Isi Cabe Ijo",      price: 14000, category: "pedas",      rating: 4.6, sold: 180, stock: 60, description: "Cireng dengan isian sambal cabe ijo segar. Pedas segar yang bikin nagih!", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop" },
  { id: 5,  nama: "Cireng Isi Abon",          price: 16000, category: "original",   rating: 4.5, sold: 150, stock: 45, description: "Cireng dengan isian abon sapi gurih. Tekstur renyah di luar, lembut di dalam.", image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop" },
  { id: 6,  nama: "Cireng Isi Udang Pedas",   price: 22000, category: "pedas",      rating: 4.9, sold: 290, stock: 25, description: "Cireng spesial isi udang segar dengan bumbu pedas menggugah selera.", image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop" },
  { id: 7,  nama: "Cireng Isi Jamur",         price: 13000, category: "vegetarian", rating: 4.4, sold: 120, stock: 55, description: "Pilihan vegetarian! Cireng isi jamur tiram tumis dengan bumbu bawang putih.", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop" },
  { id: 8,  nama: "Cireng Isi Tuna Pedas",    price: 19000, category: "pedas",      rating: 4.7, sold: 200, stock: 35, description: "Cireng isi tuna dengan sambal pedas manis. Kaya protein dan sangat lezat.", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop" },
  { id: 9,  nama: "Cireng Isi Coklat",        price: 17000, category: "manis",      rating: 4.3, sold: 95,  stock: 40, description: "Cireng manis dengan isian coklat leleh. Unik dan cocok untuk dessert.", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop" },
  { id: 10, nama: "Cireng Isi Rendang",       price: 25000, category: "original",   rating: 5.0, sold: 400, stock: 20, description: "Cireng premium isi rendang daging sapi asli Padang. Cita rasa autentik yang memanjakan lidah.", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop" },
  { id: 11, nama: "Cireng Isi Tempe Orek",    price: 12000, category: "vegetarian", rating: 4.2, sold: 80,  stock: 70, description: "Cireng ekonomis isi tempe orek pedas manis. Lezat dan terjangkau.", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop" },
  { id: 12, nama: "Cireng Isi Sosis",         price: 16000, category: "original",   rating: 4.6, sold: 260, stock: 50, description: "Cireng isi sosis sapi dengan saus tomat. Favorit anak-anak yang selalu habis cepat.", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop" }
];

const seed = async () => {
  await connectDB();
  try {
    await Product.deleteMany({});
    console.log('🗑  Data produk lama dihapus');
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
