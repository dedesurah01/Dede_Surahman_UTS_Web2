import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: Number,
  nama: String,
  price: Number,
  image: String,
  category: String,
  qty: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: Number,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    payment: { type: String, required: true }
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'],
    default: 'Diproses'
  },
  waNotified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
