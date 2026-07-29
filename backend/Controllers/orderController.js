const Order = require("../model/Order");
const Product = require("../model/Product");
const sendEmail = require("../utils/sendEmail");

const createOrder = async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ message: "An order must contain at least one item" });
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

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice,
    });

    await Promise.all(
      orderItems.map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        }),
      ),
    );

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
      `Thank you for your order at ShopNest. Your order #${order._id} has been placed successfully.`,
      "",
      "Order summary:",
      itemSummary,
      "",
      `Total: INR ${totalPrice.toFixed(2)}`,
      `Status: ${order.status}`,
      "",
      "We will notify you when your order status changes.",
    ].join("\n");

    // A delivery failure must not undo an order that was successfully saved.
    const emailSent = await sendEmail(
      req.user.email,
      `ShopNest order confirmation #${order._id}`,
      message,
    );
    if (!emailSent) {
      console.warn(
        `Order confirmation email was not sent for order ${order._id}`,
      );
    }

    return res.status(201).json(order);
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
    const order = await Order.findById(req.params.id).populate(
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
    const order = await Order.findByIdAndUpdate(
      req.params.id,
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
