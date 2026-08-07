const Order = require("../model/Order");
const Product = require("../model/Product");
const sendEmail = require("../utils/sendEmail");

const createOrder = async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ message: "An order must contain at least one item" });
  }

  const addressFields = ['fullName', 'street', 'city', 'postalCode', 'country'];
  if (!shippingAddress || addressFields.some((field) => !String(shippingAddress[field] || '').trim())) {
    return res.status(400).json({ message: 'A complete shipping address is required' });
  }

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
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice,
      shippingAddress,
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
      `Your ShopNest order #${order.orderId} is ready for secure checkout.`,
      "",
      "Order summary:",
      itemSummary,
      "",
      `Total: INR ${totalPrice.toFixed(2)}`,
      `Payment status: ${order.payment.status}`,
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
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Unable to create order" });
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
};
