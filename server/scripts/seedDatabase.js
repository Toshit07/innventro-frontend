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
    images: ["/black.png"],
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
    images: ["/green.png"],
    exclusive: false,
    stock: 40
  },
  {
    id: "rose-atelier",
    name: "Rose Atelier",
    brand: "Dior",
    price: 260,
    short: "An editorial rose with metallic petals and soft suede.",
    description: "Rose Atelier balances dewy rose with peppered aldehydes. A suede-iris base gives the composition a refined, couture finish.",
    family: "Floral",
    occasion: "Casual",
    performance: { longevity: 74, projection: 66 },
    notes: {
      top: ["Pink Pepper", "Aldehydes", "Pear"],
      middle: ["Rose Absolute", "Geranium", "Peony"],
      base: ["Suede", "Iris", "Cashmere Wood"]
    },
    images: ["/purple.png"],
    exclusive: false,
    stock: 30
  },
  {
    id: "sable-ritual",
    name: "Sable Ritual",
    brand: "Le Labo",
    price: 240,
    short: "Smoked resins, mineral spice, and warm sandalwood.",
    description: "Sable Ritual is ritualistic and meditative. Dry incense and cumin spice bloom into a mineral sandalwood base with a faint amber glow.",
    family: "Oriental",
    occasion: "Evening",
    performance: { longevity: 88, projection: 76 },
    notes: {
      top: ["Cumin", "Black Pepper", "Bergamot"],
      middle: ["Incense", "Clove", "Labdanum"],
      base: ["Sandalwood", "Amber", "Patchouli"]
    },
    images: ["/black2.png"],
    exclusive: true,
    stock: 20
  },
  {
    id: "lune-blanche",
    name: "Lune Blanche",
    brand: "Byredo",
    price: 210,
    short: "Clean musk, moonlit jasmine, and silver woods.",
    description: "Lune Blanche is soft yet confident. A cool jasmine note floats over airy musks and a pale cedar base, perfect for refined evenings.",
    family: "Fresh",
    occasion: "Luxury",
    performance: { longevity: 70, projection: 58 },
    notes: {
      top: ["Pear", "Lily", "Aldehydes"],
      middle: ["Jasmine", "Magnolia", "Iris"],
      base: ["Cedar", "White Musk", "Ambergris"]
    },
    images: ["/copper.png"],
    exclusive: false,
    stock: 35
  },
  {
    id: "amber-archive",
    name: "Amber Archive",
    brand: "Maison Francis Kurkdjian",
    price: 285,
    short: "Deep amber resin, saffron, and glossy woods.",
    description: "Amber Archive is an archival, slow-burning scent. Golden saffron and resinous amber sit on glossy woods with a modern finish.",
    family: "Oriental",
    occasion: "Luxury",
    performance: { longevity: 92, projection: 80 },
    notes: {
      top: ["Saffron", "Mandarin", "Pink Pepper"],
      middle: ["Amber Resin", "Rose", "Orris"],
      base: ["Oud", "Guaiac Wood", "Vanilla"]
    },
    images: ["/black.png"],
    exclusive: true,
    stock: 15
  },
  {
    id: "cedre-atelier",
    name: "Cedre Atelier",
    brand: "Le Labo",
    price: 230,
    short: "Dry cedar, fig stem, and polished vetiver.",
    description: "Cedre Atelier is modern and minimal: crisp cedar, green fig, and a clean vetiver base that reads confident and precise.",
    family: "Woody",
    occasion: "Casual",
    performance: { longevity: 76, projection: 64 },
    notes: {
      top: ["Fig Stem", "Bergamot", "Galbanum"],
      middle: ["Cedar", "Juniper", "Sage"],
      base: ["Vetiver", "Musk", "Amber"]
    },
    images: ["/green.png"],
    exclusive: false,
    stock: 28
  },
  {
    id: "fleur-objectif",
    name: "Fleur Objectif",
    brand: "Dior",
    price: 205,
    short: "White florals, cool pear, and sheer amber.",
    description: "Fleur Objectif blooms with white florals and pear, then settles into a sheer amber base that feels poised and clean.",
    family: "Floral",
    occasion: "Daily",
    performance: { longevity: 66, projection: 52 },
    notes: {
      top: ["Pear", "Lemon Blossom", "Pink Pepper"],
      middle: ["Tuberose", "Gardenia", "Lily"],
      base: ["Sheer Amber", "Musk", "Cedar"]
    },
    images: ["/purple.png"],
    exclusive: false,
    stock: 45
  },
  {
    id: "minuit-noir",
    name: "Minuit Noir",
    brand: "Byredo",
    price: 250,
    short: "Smoked rose, incense, and midnight woods.",
    description: "Minuit Noir is intimate and smoky. Incense-laced rose and dark woods create a slow, luxurious dry down.",
    family: "Woody",
    occasion: "Evening",
    performance: { longevity: 84, projection: 70 },
    notes: {
      top: ["Plum", "Saffron", "Black Pepper"],
      middle: ["Rose", "Incense", "Cedar"],
      base: ["Patchouli", "Amber", "Musk"]
    },
    images: ["/black2.png"],
    exclusive: true,
    stock: 22
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
