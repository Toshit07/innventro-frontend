import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

dotenv.config();

const perfumes = [
  {
    id: "laviure-noir-signature",
    name: "LAVIURE NOIR SIGNATURE",
    brand: "LAVIURE",
    price: 1499,
    short: "A confident, modern fragrance with dark woods and warm spice.",
    description: "A confident, modern fragrance with dark woods and warm spice. Strong, clean, and long-lasting without being overpowering.",
    family: "Woody",
    occasion: "Evening",
    performance: { longevity: 88, projection: 78 },
    notes: {
      top: ["Black Pepper", "Bergamot"],
      middle: ["Patchouli", "Incense"],
      base: ["Amber", "Vetiver"]
    },
    images: ["/black.png", "/black.png", "/black.png"],
    exclusive: false,
    stock: 50
  },
  {
    id: "laviure-noir-velvet",
    name: "LAVIURE NOIR VELVET",
    brand: "LAVIURE",
    price: 1399,
    short: "Soft, creamy, and elegant. Designed for close encounters and everyday luxury.",
    description: "Soft, creamy, and elegant. Designed for close encounters and everyday luxury.",
    family: "Floral",
    occasion: "Daily",
    performance: { longevity: 75, projection: 65 },
    notes: {
      top: ["Pink Pepper", "Mandarin"],
      middle: ["Iris", "Jasmine"],
      base: ["Sandalwood", "Vanilla", "Musk"]
    },
    images: ["/black2.png", "/black2.png", "/black2.png"],
    exclusive: false,
    stock: 50
  },
  {
    id: "laviure-ambre-royale",
    name: "LAVIURE AMBRE ROYALE",
    brand: "LAVIURE",
    price: 1699,
    short: "Rich amber blended with gentle sweetness and spice. Feels expensive, wears beautifully.",
    description: "Rich amber blended with gentle sweetness and spice. Feels expensive, wears beautifully.",
    family: "Oriental",
    occasion: "Luxury",
    performance: { longevity: 92, projection: 82 },
    notes: {
      top: ["Cinnamon", "Saffron"],
      middle: ["Amber", "Rose"],
      base: ["Vanilla", "Tonka Bean"]
    },
    images: ["/copper.png", "/copper.png", "/copper.png"],
    exclusive: true,
    stock: 50
  },
  {
    id: "laviure-emeraude-elixir",
    name: "LAVIURE ÉMERAUDE ÉLIXIR",
    brand: "LAVIURE",
    price: 1449,
    short: "Fresh, green, and classy. Clean citrus and woods—perfect for office and warm weather.",
    description: "Fresh, green, and classy. Clean citrus and woods—perfect for office and warm weather.",
    family: "Fresh",
    occasion: "Daily",
    performance: { longevity: 70, projection: 60 },
    notes: {
      top: ["Bergamot", "Green Apple"],
      middle: ["Lavender", "Geranium"],
      base: ["Cedarwood", "Musk"]
    },
    images: ["/green.png", "/green.png", "/green.png"],
    exclusive: false,
    stock: 50
  },
  {
    id: "laviure-violet-nocturne",
    name: "LAVIURE VIOLET NOCTURNE",
    brand: "LAVIURE",
    price: 1599,
    short: "A mysterious blend of dark florals and soft warmth. Smooth, artistic, and addictive.",
    description: "A mysterious blend of dark florals and soft warmth. Smooth, artistic, and addictive.",
    family: "Floral",
    occasion: "Evening",
    performance: { longevity: 85, projection: 72 },
    notes: {
      top: ["Plum", "Pink Pepper"],
      middle: ["Violet", "Orchid"],
      base: ["Patchouli", "Amber", "Musk"]
    },
    images: ["/purple.png", "/purple.png", "/purple.png"],
    exclusive: false,
    stock: 50
  }
];

async function resetDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('✓ Cleared products');

    await Cart.updateMany({}, { $set: { items: [] } });
    console.log('✓ Cleared all carts');

    await Product.insertMany(perfumes);
    console.log('✓ Added new LAVIURE products');

    console.log('\n✅ Database reset complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetDatabase();
