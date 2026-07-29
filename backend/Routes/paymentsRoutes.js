const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createPaymentIntent, getPaymentIntent } = require('../controllers/paymentController');
const router = express.Router();

router.post('/create-payment-intent', protect, createPaymentIntent);
router.get('/payment-intents/:paymentIntentId', protect, getPaymentIntent);

module.exports = router;
