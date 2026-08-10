const Order = require("../Model/Order");
const Product = require("../Model/Product");
const sendEmail = require("../utils/sendEmail");

const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod = 'stripe' } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ message: "An order must contain at least one item" });
  }

  if (!['stripe', 'cod'].includes(paymentMethod)) {
    return res.status(400).json({ message: 'Choose Cash on Delivery or Stripe checkout' });
  }

  const addressFields = ['fullName', 'street', 'city', 'postalCode', 'country'];
  if (!shippingAddress || addressFields.some((field) => !String(shippingAddress[field] || '').trim())) {
    return res.status(400).json({ message: 'A complete shipping address is required' });
  }

  const reservedItems = [];
  try {
    const orderItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const quantity = Number(item.quantity);
      if (!item.product || !Number.isInteger(quantity) || quantity < 1) {
        return res
          .status(400)
          .json({ message: "Each item needs a product and a valid quantity" });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.product}` });
      }
      if (product.stock < quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
        imageUrl: product.imageUrl,
      });
      totalPrice += product.price * quantity;
    }

    // Product prices are always read from MongoDB, never accepted from the client.
    if (paymentMethod === 'cod') {
      for (const item of orderItems) {
        const result = await Product.updateOne(
          { _id: item.product, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
        );
        if (result.modifiedCount !== 1) {
          await Promise.all(reservedItems.map((reserved) => Product.updateOne(
            { _id: reserved.product }, { $inc: { stock: reserved.quantity } },
          )));
          return res.status(409).json({ message: `Insufficient stock for ${item.name}` });
        }
        reservedItems.push(item);
      }
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      itemsPrice: totalPrice,
      taxPrice: 0,
      shippingPrice: 40,
      totalPrice: totalPrice + 40,
      shippingAddress,
      status: paymentMethod === 'cod' ? 'processing' : 'pending',
      payment: { provider: paymentMethod, status: 'pending' },
    });


    const itemSummary = orderItems
      .map(
        (item) =>
          `- ${item.name} x ${item.quantity}: INR ${(item.price * item.quantity).toFixed(2)}`,
      )
      .join("\n");
    const customerName = req.user.name || "Customer";
    const message = [
      `Hi ${customerName},`,
      "",
      `Your ShopNest order #${order.orderId} has been placed.`,
      "",
      "Order summary:",
      itemSummary,
      "",
      `Shipping: INR 40.00`,
      `Total: INR ${(totalPrice + 40).toFixed(2)}`,
      `Payment method: ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Stripe Checkout'}`,
      "",
      "We will notify you when your order status changes.",
    ].join("\n");

    // A delivery failure must not undo an order that was successfully saved.
    const emailSent = await sendEmail(
      req.user.email,
      `ShopNest checkout #${order.orderId}`,
      message,
    );
    if (!emailSent) {
      console.warn(
        `Order confirmation email was not sent for order ${order._id}`,
      );
    }

    return res.status(201).json({
      order,
      orderId: order.orderId,
    });
  } catch (error) {
    if (paymentMethod === 'cod' && reservedItems.length) {
      await Promise.all(reservedItems.map((item) => Product.updateOne(
        { _id: item.product }, { $inc: { stock: item.quantity } },
      )));
    }
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Unable to create order" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!String(reason || '').trim()) return res.status(400).json({ message: 'Please provide a cancellation reason' });
    const order = await Order.findOne({ orderId: req.params.orderId, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.payment.provider !== 'cod') {
      return res.status(400).json({ message: 'Online payments cannot be cancelled here. Contact support for payment assistance.' });
    }
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(409).json({ message: 'This order can no longer be cancelled' });
    }

    const cancelled = await Order.findOneAndUpdate(
      { _id: order._id, status: { $in: ['pending', 'processing'] } },
      { $set: { status: 'cancelled', 'payment.status': 'cancelled', 'cancellation.reason': String(reason).trim(), 'cancellation.cancelledAt': new Date() } },
      { new: true },
    );
    if (!cancelled) return res.status(409).json({ message: 'This order can no longer be cancelled' });

    if (cancelled.payment.provider === 'cod') await Promise.all(cancelled.items.map((item) => Product.updateOne(
      { _id: item.product }, { $inc: { stock: item.quantity } },
    )));
    return res.json(cancelled);
  } catch (error) {
    console.error('Error cancelling order:', error);
    return res.status(500).json({ message: 'Unable to cancel order' });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error("Error getting orders:", error);
    return res.status(500).json({ message: "Unable to get orders" });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json(orders);
  } catch (error) {
    console.error("Error getting user orders:", error);
    return res.status(500).json({ message: "Unable to get orders" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const lookup = { orderId: req.params.id };
    if (require('mongoose').isValidObjectId(req.params.id)) {
      lookup.$or = [{ _id: req.params.id }, { orderId: req.params.id }];
      delete lookup.orderId;
    }
    const order = await Order.findOne(lookup).populate(
      "user",
      "name email",
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }
    return res.json(order);
  } catch (error) {
    return res.status(400).json({ message: "Invalid order id" });
  }
};

const updateOrderStatus = async (req, res) => {
  const allowedStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  if (!allowedStatuses.includes(req.body.status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  try {
    const filter = require('mongoose').isValidObjectId(req.params.id)
      ? { $or: [{ _id: req.params.id }, { orderId: req.params.id }] }
      : { orderId: req.params.id };
    const order = await Order.findOneAndUpdate(
      filter,
      { status: req.body.status },
      { new: true, runValidators: true },
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.json(order);
  } catch (error) {
    return res.status(400).json({ message: "Invalid order id" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
