const Order = require("../model/Order");
const Product = require("../model/Product");
const { getStripeClient } = require("../config/stripe");

const createPaymentIntentForOrder = async (order) => {
  const paymentIntent = await getStripeClient().paymentIntents.create({
    amount: Math.round(order.totalPrice * 100),
    currency: "inr",
    automatic_payment_methods: { enabled: true },
    metadata: {
      orderId: order.orderId,
      mongoOrderId: order._id.toString(),
      userId: order.user.toString(),
    },
  });

  order.payment.paymentIntentId = paymentIntent.id;
  await order.save();
  return paymentIntent;
};

const getPaymentConfig = (req, res) => {
  if (!process.env.STRIPE_PUBLISHABLE_KEY) {
    return res.status(503).json({ message: "Payments are not configured" });
  }

  return res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
};

const createCheckoutSession = async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ message: "orderId is required" });

  try {
    const order = await Order.findOne({ orderId, user: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.payment.provider !== "stripe")
      return res
        .status(400)
        .json({ message: "This order uses Cash on Delivery" });
    if (order.payment.status === "paid")
      return res.status(409).json({ message: "Order is already paid" });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const session = await getStripeClient().checkout.sessions.create({
      mode: "payment",
      line_items: [
        ...order.items.map((item) => ({
          price_data: {
            currency: "inr",
            product_data: { name: item.name },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Shipping" },
            unit_amount: Math.round((order.shippingPrice || 0) * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { orderId: order.orderId, userId: req.user._id.toString() },
      success_url: `${frontendUrl}/payment-return?orderId=${encodeURIComponent(order.orderId)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/checkout`,
    });

    return res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating Stripe Checkout Session:", error.message);
    return res.status(500).json({ message: "Unable to start secure checkout" });
  }
};

const getCheckoutSession = async (req, res) => {
  try {
    const session = await getStripeClient().checkout.sessions.retrieve(
      req.params.sessionId,
    );
    if (session.metadata.userId !== req.user._id.toString())
      return res
        .status(403)
        .json({ message: "Not authorized to view this payment" });

    if (session.payment_status === "paid") {
      await Order.updateOne(
        { orderId: session.metadata.orderId, user: req.user._id },
        { $set: { "payment.paymentIntentId": session.payment_intent } },
      );
    }

    return res.json({
      orderId: session.metadata.orderId,
      verified: session.payment_status === "paid",
    });
  } catch (error) {
    console.error("Error retrieving Stripe Checkout Session:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to verify checkout session" });
  }
};

const createPaymentIntent = async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ message: "orderId is required" });

  try {
    const order = await Order.findOne({ orderId, user: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.payment.status === "paid")
      return res.status(409).json({ message: "Order is already paid" });

    const paymentIntent = order.payment.paymentIntentId
      ? await getStripeClient().paymentIntents.retrieve(
          order.payment.paymentIntentId,
        )
      : await createPaymentIntentForOrder(order);

    return res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderId: order.orderId,
    });
  } catch (error) {
    console.error("Error creating Stripe PaymentIntent:", error.message);
    return res.status(500).json({ message: "Unable to create payment intent" });
  }
};

const getPaymentIntent = async (req, res) => {
  const { paymentIntentId } = req.params;

  try {
    const paymentIntent =
      await getStripeClient().paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.metadata.userId !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this payment" });
    }

    return res.json({
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      verified: paymentIntent.status === "succeeded",
    });
  } catch (error) {
    if (error.type === "StripeInvalidRequestError") {
      return res.status(404).json({ message: "Payment intent not found" });
    }

    console.error("Error retrieving Stripe PaymentIntent:", error.message);
    return res
      .status(500)
      .json({ message: "Unable to retrieve payment intent" });
  }
};

const confirmOrderPayment = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.orderId,
      user: req.user._id,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.payment.status === "paid") return res.json(order);
    if (!order.payment.paymentIntentId)
      return res
        .status(400)
        .json({ message: "No payment was started for this order" });

    const paymentIntent = await getStripeClient().paymentIntents.retrieve(
      order.payment.paymentIntentId,
    );
    if (
      paymentIntent.status !== "succeeded" ||
      paymentIntent.metadata.mongoOrderId !== order._id.toString()
    ) {
      return res.status(400).json({ message: "Payment has not succeeded yet" });
    }

    // Only one confirmation can move this order into processing.
    const lockedOrder = await Order.findOneAndUpdate(
      { _id: order._id, "payment.status": { $in: ["pending", "failed"] } },
      { $set: { "payment.status": "processing" } },
      { new: true },
    );
    if (!lockedOrder) return res.json(await Order.findById(order._id));

    const reducedProducts = [];
    for (const item of lockedOrder.items) {
      const result = await Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
      );
      if (result.modifiedCount !== 1) {
        await Promise.all(
          reducedProducts.map((reduced) =>
            Product.updateOne(
              { _id: reduced.product },
              { $inc: { stock: reduced.quantity } },
            ),
          ),
        );
        await Order.updateOne(
          { _id: order._id },
          { $set: { "payment.status": "failed" } },
        );
        return res
          .status(409)
          .json({
            message: `Insufficient stock for ${item.name}. Payment was successful; contact support for a refund.`,
          });
      }
      reducedProducts.push(item);
    }

    const paidOrder = await Order.findByIdAndUpdate(
      order._id,
      {
        $set: {
          "payment.status": "paid",
          "payment.paidAt": new Date(),
          status: "processing",
        },
      },
      { new: true },
    );
    return res.json(paidOrder);
  } catch (error) {
    console.error("Error confirming payment:", error.message);
    return res.status(500).json({ message: "Unable to confirm payment" });
  }
};

module.exports = {
  getPaymentConfig,
  createCheckoutSession,
  getCheckoutSession,
  createPaymentIntent,
  createPaymentIntentForOrder,
  getPaymentIntent,
  confirmOrderPayment,
};
