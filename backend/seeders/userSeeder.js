// Seeder admin user
// Jalankan: node seeders/userSeeder.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';
import connectDB from '../config/db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const seed = async () => {
  await connectDB();
  try {
    const exists = await User.findOne({ email: 'admin@cireng.com' });
    if (!exists) {
      await User.create({
        id: 1,
        name: 'Admin Cireng',
        email: 'admin@cireng.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Admin user berhasil dibuat');
    } else {
      console.log('ℹ️  Admin sudah ada');
    }
  } catch (e) {
    console.error('❌', e.message);
  } finally {
    mongoose.connection.close();
  }
};
seed();
