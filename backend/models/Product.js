import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { 
    type: Number, 
    required: true, 
    unique: true 
  },
  nama: { 
    type: String, 
    required: true, 
    trim: true 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  image: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true, 
    enum: ['pedas', 'original', 'vegetarian', 'manis']
  },
  rating: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 5 
  },
  sold: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  stock: { 
    type: Number, 
    required: true, 
    min: 0 
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
