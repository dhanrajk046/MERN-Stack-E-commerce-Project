const mongoose = require('mongoose');
const crypto = require('crypto');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    imageUrl: { type: String, default: '' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // This is the customer-facing ID. Keep Mongo's _id for database relations.
    orderId: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    itemsPrice: { type: Number, required: true, min: 0 },
    taxPrice: { type: Number, required: true, min: 0, default: 0 },
    shippingPrice: { type: Number, required: true, min: 0, default: 40 },
    totalPrice: { type: Number, required: true, min: 0 },
    cancellation: {
      reason: { type: String, trim: true, maxlength: 500, default: '' },
      cancelledAt: { type: Date, default: null },
    },
    shippingAddress: {
      fullName: { type: String, required: true, trim: true },
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      postalCode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    payment: {
      provider: { type: String, enum: ['stripe', 'cod'], default: 'stripe' },
      paymentIntentId: { type: String, default: null, index: true },
      status: {
        type: String,
        enum: ['pending', 'processing', 'paid', 'failed', 'cancelled'],
        default: 'pending',
      },
      paidAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

orderSchema.pre('validate', function setOrderId() {
  if (!this.orderId) {
    this.orderId = `SN-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  }
});

module.exports = mongoose.model('Order', orderSchema);
