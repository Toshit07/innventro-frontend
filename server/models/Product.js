import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  brand: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  short: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
    min: 0
  },
  family: {
    type: String,
    enum: ['Citrus', 'Floral', 'Oriental', 'Woody', 'Fresh', 'Fruity', 'Aromatic'],
    required: true
  },
  occasion: {
    type: String,
    enum: ['Daily', 'Evening', 'Luxury', 'Sport', 'Casual', 'Office', 'Party', 'Gifting'],
    required: true
  },
  performance: {
    longevity: Number,
    projection: Number
  },
  notes: {
    top: [String],
    middle: [String],
    base: [String]
  },
  images: [String],
  stock: {
    type: Number,
    default: 50
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  },
  exclusive: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Product', productSchema);
