const Stripe = require('stripe');

const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key is not configured');
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const createPaymentIntent = async (req, res) => {
  const amount = Number(req.body.amount);
  const currency = (req.body.currency || 'usd').toLowerCase();

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: 'A valid payment amount is required' });
  }

  try {
    const paymentIntent = await getStripeClient().paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: { userId: req.user._id.toString() },
    });

    return res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating Stripe PaymentIntent:', error.message);
    return res.status(500).json({ message: 'Unable to create payment intent' });
  }
};

const getPaymentIntent = async (req, res) => {
  const { paymentIntentId } = req.params;

  try {
    const paymentIntent = await getStripeClient().paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.metadata.userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this payment' });
    }

    return res.json({
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      verified: paymentIntent.status === 'succeeded',
    });
  } catch (error) {
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(404).json({ message: 'Payment intent not found' });
    }

    console.error('Error retrieving Stripe PaymentIntent:', error.message);
    return res.status(500).json({ message: 'Unable to retrieve payment intent' });
  }
};

module.exports = { createPaymentIntent, getPaymentIntent };
