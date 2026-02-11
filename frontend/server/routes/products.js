import express from 'express';
import Product from '../models/Product.js';
import Review from '../models/Review.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { family, occasion, sort } = req.query;
    let query = {};

    if (family) query.family = family;
    if (occasion) query.occasion = occasion;

    let products = Product.find(query);

    if (sort === 'price-low') products = products.sort({ price: 1 });
    if (sort === 'price-high') products = products.sort({ price: -1 });
    if (sort === 'newest') products = products.sort({ createdAt: -1 });
    if (sort === 'rating') products = products.sort({ rating: -1 });

    const result = await products;
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search products
router.get('/search/query', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const results = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review
router.post('/:id/reviews', async (req, res) => {
  try {
    const { userId, rating, title, comment } = req.body;

    const review = new Review({
      productId: req.params.id,
      userId,
      rating,
      title,
      comment
    });

    await review.save();

    // Update product rating
    const reviews = await Review.find({ productId: req.params.id });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(req.params.id, { rating: avgRating });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
