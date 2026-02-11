import express from 'express';
import Order from '../models/Order.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Third-party payment provider configuration
const PAYMENT_GATEWAY_URL = process.env.PAYMENT_GATEWAY_URL || 'https://payment.example.com';
const PAYMENT_API_KEY = process.env.PAYMENT_API_KEY;

/**
 * Create payment session and redirect URL
 * Instead of creating payment intent locally, we generate a secure redirect to third-party gateway
 */
router.post('/create-checkout', authenticate, async (req, res) => {
  try {
    const { orderId } = req.body;

    // Validate order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to order' });
    }

    if (order.paymentStatus === 'completed') {
      return res.status(400).json({ message: 'Order already paid' });
    }

    // Generate secure redirect URL for third-party payment gateway
    const paymentSessionData = {
      orderId: order._id.toString(),
      userId: req.user.id,
      amount: order.totalAmount,
      currency: 'USD',
      items: order.items.map(item => ({
        id: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      customerEmail: order.customerEmail || req.user.email,
      returnUrl: process.env.FRONTEND_URL + '/orders/' + orderId,
      cancelUrl: process.env.FRONTEND_URL + '/checkout'
    };

    // Create secure redirect URL
    const params = new URLSearchParams();
    params.append('data', Buffer.from(JSON.stringify(paymentSessionData)).toString('base64'));
    params.append('signature', generateSignature(paymentSessionData));
    params.append('apiKey', PAYMENT_API_KEY);

    const checkoutUrl = `${PAYMENT_GATEWAY_URL}/checkout?${params.toString()}`;

    res.json({
      checkoutUrl,
      orderId: order._id,
      amount: order.totalAmount
    });
  } catch (error) {
    console.error('Payment session creation error:', error);
    res.status(500).json({ message: 'Failed to create payment session' });
  }
});

/**
 * Webhook endpoint for payment gateway to confirm payment
 * Third-party gateway will POST here to update order status
 */
router.post('/webhook', express.json(), async (req, res) => {
  try {
    const { orderId, status, transactionId, signature } = req.body;

    // Verify webhook signature for security
    if (!verifyWebhookSignature(req.body, signature)) {
      return res.status(401).json({ message: 'Invalid webhook signature' });
    }

    if (status === 'success' || status === 'completed') {
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: 'completed',
          transactionId: transactionId,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      console.log(`✓ Payment confirmed for order ${orderId}`);
      res.json({ success: true, message: 'Payment processed successfully' });
    } else if (status === 'failed' || status === 'cancelled') {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'failed',
        updatedAt: new Date()
      });

      console.log(`✗ Payment failed for order ${orderId}`);
      res.json({ success: false, message: 'Payment failed' });
    } else {
      res.json({ success: true, message: 'Status received' });
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

/**
 * Get payment status
 */
router.get('/status/:orderId', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({
      orderId: order._id,
      paymentStatus: order.paymentStatus,
      transactionId: order.transactionId || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payment status' });
  }
});

/**
 * Helper function to generate webhook signature
 * Use HMAC-SHA256 with API secret for secure communication
 */
function generateSignature(data) {
  // In production, use crypto.createHmac with your API secret
  const crypto = require('crypto');
  return crypto
    .createHmac('sha256', PAYMENT_API_KEY || 'secret')
    .update(JSON.stringify(data))
    .digest('hex');
}

/**
 * Helper function to verify webhook signature
 * Ensure payment gateway requests are legitimate
 */
function verifyWebhookSignature(data, signature) {
  try {
    const crypto = require('crypto');
    const { orderId, status, transactionId } = data;
    
    const payload = JSON.stringify({ orderId, status, transactionId });
    const expectedSignature = crypto
      .createHmac('sha256', PAYMENT_API_KEY || 'secret')
      .update(payload)
      .digest('hex');

    return signature === expectedSignature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

export default router;
