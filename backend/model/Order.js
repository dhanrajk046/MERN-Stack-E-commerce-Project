const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  imageUrl: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    itemsPrice: { type: Number, required: true },
    taxPrice: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    shippingAddress: {
      fullName: String,
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },
    status: { type: String, default: "pending" },
    payment: {
      provider: { type: String, default: "stripe" },
      status: { type: String, default: "pending" },
      paymentIntentId: { type: String },
      paidAt: { type: Date },
    },
    cancellation: {
      reason: String,
      cancelledAt: Date,
    },
  },
  { timestamps: true },
);

orderSchema.pre("save", function () {
  if (!this.orderId) {
    this.orderId = `SN-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }
});

module.exports = mongoose.model("Order", orderSchema);
