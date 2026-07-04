import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  productId: { type: Number, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 }
}, { timestamps: true });

// Satu user hanya bisa rate satu produk sekali
ratingSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Rating = mongoose.model('Rating', ratingSchema);
export default Rating;
