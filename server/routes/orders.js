import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const resolveProduct = async (rawId) => {
  if (mongoose.Types.ObjectId.isValid(rawId)) {
    const product = await Product.findById(rawId);
    if (product) return product;
  }

  return Product.findOne({ id: rawId });
};

// Get user orders
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.productId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order details
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order from cart
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
      customerEmail,
      items: bodyItems,
      totalAmount: providedTotal
    } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');

    let items = [];
    let totalAmount = 0;

    if (cart && cart.items.length > 0) {
      items = cart.items.map((item) => ({
        productId: item.productId?._id || item.productId,
        name: item.productId?.name || 'Product',
        price: item.price,
        quantity: item.quantity
      }));
      totalAmount = cart.totalPrice;
    } else if (Array.isArray(bodyItems) && bodyItems.length > 0) {
      for (const item of bodyItems) {
        const rawId = item.productId || item.id;
        const product = await resolveProduct(rawId);
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        const quantity = Number(item.quantity || item.qty || 1);
        items.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity
        });
        totalAmount += product.price * quantity;
      }
    } else {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const order = new Order({
      userId: req.user.id,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'card',
      customerEmail,
      totalAmount: providedTotal || totalAmount,
      paymentStatus: 'pending'
    });

    await order.save();

    // Update product stock
    for (let item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart if it existed
    if (cart) {
      await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [] });
    }

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel order
router.put('/:id/cancel', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (order.orderStatus === 'delivered' || order.orderStatus === 'shipped') {
      return res.status(400).json({ message: 'Cannot cancel shipped or delivered order' });
    }

    order.orderStatus = 'cancelled';
    order.paymentStatus = 'refunded';
    await order.save();

    // Restore stock
    for (let item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
