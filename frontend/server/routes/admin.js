import express from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Dashboard stats
router.get('/stats', adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders
router.get('/orders', adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put('/orders/:id', adminOnly, async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, trackingNumber, updatedAt: new Date() },
      { new: true }
    );

    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add product
router.post('/products', adminOnly, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product
router.put('/products/:id', adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product
router.delete('/products/:id', adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
