const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');
const { confirmOrderPayment } = require('../controllers/paymentController');
const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.post('/:orderId/confirm-payment', protect, confirmOrderPayment);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
