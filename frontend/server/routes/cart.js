import express from 'express';
import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const resolveProductId = async (rawId) => {
  if (mongoose.Types.ObjectId.isValid(rawId)) {
    const product = await Product.findById(rawId);
    if (product) return product._id;
  }

  const product = await Product.findOne({ id: rawId });
  return product?._id || null;
};

// Get cart
router.get('/', authenticate, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const ensureProduct = async (candidate = {}) => {
  if (!candidate.id) return null;

  const existing = await Product.findOne({ id: candidate.id });
  if (existing) return existing._id;

  const created = await Product.create({
    id: candidate.id,
    name: candidate.name,
    brand: candidate.brand,
    description: candidate.description,
    short: candidate.short,
    price: candidate.price,
    family: candidate.family,
    occasion: candidate.occasion,
    performance: candidate.performance,
    notes: candidate.notes,
    images: candidate.images,
    exclusive: candidate.exclusive,
    stock: candidate.stock || 50
  });

  return created._id;
};

// Add to cart
router.post('/add', authenticate, async (req, res) => {
  try {
    const { productId, quantity = 1, product } = req.body;
    let resolvedId = await resolveProductId(productId);

    if (!resolvedId && product) {
      resolvedId = await ensureProduct(product);
    }

    if (!resolvedId) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productDoc = await Product.findById(resolvedId);

    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === resolvedId.toString()
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        productId: resolvedId,
        quantity: Number(quantity),
        price: productDoc?.price || product?.price || 0
      });
    }

    await cart.save();
    await cart.populate('items.productId');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update cart item
router.put('/item/:productId', authenticate, async (req, res) => {
  try {
    const { quantity } = req.body;

    const resolvedId = await resolveProductId(req.params.productId);
    if (!resolvedId) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (quantity <= 0) {
      // Remove item
      const cart = await Cart.findOneAndUpdate(
        { userId: req.user.id },
        { $pull: { items: { productId: resolvedId } } },
        { new: true }
      ).populate('items.productId');
      return res.json(cart);
    }

    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id, 'items.productId': resolvedId },
      { $set: { 'items.$.quantity': quantity } },
      { new: true }
    ).populate('items.productId');

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from cart
router.delete('/item/:productId', authenticate, async (req, res) => {
  try {
    const resolvedId = await resolveProductId(req.params.productId);
    if (!resolvedId) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { items: { productId: resolvedId } } },
      { new: true }
    ).populate('items.productId');

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear cart
router.delete('/', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { items: [] },
      { new: true }
    );

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
