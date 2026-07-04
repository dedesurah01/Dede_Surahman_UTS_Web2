import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
  id: Number,
  nama: String,
  price: Number,
  image: String,
  category: String,
  description: String,
  rating: Number,
  sold: Number,
  stock: Number
}, { _id: false });

const wishlistSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  items: [wishlistItemSchema]
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;
