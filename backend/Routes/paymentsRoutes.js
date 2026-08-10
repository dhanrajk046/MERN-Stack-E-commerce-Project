const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getPaymentConfig, createCheckoutSession, getCheckoutSession, createPaymentIntent, getPaymentIntent } = require('../Controllers/paymentController');
const router = express.Router();

router.get('/config', getPaymentConfig);
router.post('/create-checkout-session', protect, createCheckoutSession);
router.get('/checkout-sessions/:sessionId', protect, getCheckoutSession);
router.post('/create-payment-intent', protect, createPaymentIntent);
router.get('/payment-intents/:paymentIntentId', protect, getPaymentIntent);

module.exports = router;
