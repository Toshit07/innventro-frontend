import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const perfumes = [
  {
    id: "noir-atelier",
    name: "Noir Atelier",
    brand: "Maison Francis Kurkdjian",
    price: 295,
    short: "Velvet amber, black tea, and smoked cedar with a whisper of iris.",
    description: "Noir Atelier is a polished, nocturnal signature. It opens with black tea and bergamot, settles into suede iris, and leaves a low, glowing amber trail that feels bespoke.",
    family: "Woody",
    occasion: "Luxury",
    performance: { longevity: 86, projection: 72 },
    notes: {
      top: ["Bergamot", "Black Tea", "Cardamom"],
      middle: ["Iris", "Suede", "Violet"],
      base: ["Amber", "Cedar", "Labdanum"]
    },
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80"
    ],
    exclusive: true,
    stock: 25
  },
  {
    id: "citrine-veil",
    name: "Citrine Veil",
    brand: "Byredo",
    price: 220,
    short: "Sunlit citrus, chilled neroli, and creamy woods.",
    description: "Citrine Veil is a bright, airy perfume with sparkling citrus and a clean neroli heart. It finishes with soft sandalwood and musks that stay close to the skin.",
    family: "Citrus",
    occasion: "Daily",
    performance: { longevity: 68, projection: 60 },
    notes: {
      top: ["Bitter Orange", "Yuzu", "Petitgrain"],
      middle: ["Neroli", "Orange Blossom", "Fig Leaf"],
      base: ["Sandalwood", "White Musk", "Amberwood"]
    },
    images: [
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80"
    ],
    exclusive: false,
    stock: 40
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('✓ Cleared existing data');

    // Seed products
    await Product.insertMany(perfumes);
    console.log('✓ Seeded products');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@innoventure.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('✓ Created admin user');

    console.log(`
✅ Database seeded successfully!
Admin Email: ${process.env.ADMIN_EMAIL || 'admin@innoventure.com'}
Admin Password: ${process.env.ADMIN_PASSWORD || 'admin123'}
    `);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
