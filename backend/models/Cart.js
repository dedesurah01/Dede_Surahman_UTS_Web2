import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  id: Number,
  nama: String,
  price: Number,
  image: String,
  category: String,
  description: String,
  rating: Number,
  sold: Number,
  stock: Number,
  qty: { type: Number, default: 1, min: 1 }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  items: [cartItemSchema]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
