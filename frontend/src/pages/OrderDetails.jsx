import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { ordersApi } from '../services/api';
import '../styles/order.css';

const money = (value) => `₹${Number(value || 0).toFixed(2)}`;

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  useEffect(() => {
    ordersApi.getById(orderId)
      .then((data) => setOrder(data))
      .catch((requestError) => setError(requestError.message || 'Unable to load this order.'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const cancelOrder = async () => {
    if (!cancellationReason.trim()) {
      setError('Please select or enter a cancellation reason.');
      return;
    }
    setCancelling(true);
    setError('');
    try {
      setOrder(await ordersApi.cancel(order.orderId, cancellationReason));
      setShowCancelDialog(false);
    } catch (requestError) {
      setError(requestError.message || 'Unable to cancel this order.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <p className="page-state">Loading order...</p>;
  if (error && !order) return <div className="order-state"><p role="alert">{error}</p><Link className="btn" to="/profile">My Orders</Link></div>;

  const canCancel = order.payment?.provider === 'cod' && ['pending', 'processing'].includes(order.status);
  const paymentName = order.payment?.provider === 'cod' ? 'Cash on Delivery' : 'Online Payment (Stripe)';

  return (
    <div className="order-page">
      <div className="order-header"><div><p className="order-eyebrow">Order {order.orderId}</p><h2>Order Details</h2></div><span className={`order-status status-${order.status}`}>{order.status}</span></div>
      {error && <p className="checkout-error" role="alert">{error}</p>}
      <div className="order-layout">
        <section className="order-items-section"><h3>Items Ordered</h3>{order.items.map((item) => <article className="order-item" key={item.product}><img src={item.imageUrl || '/logo.jpg'} alt="" onError={(event) => { event.currentTarget.src = '/logo.jpg'; }} /><div><strong>{item.name}</strong><p>Quantity: {item.quantity}</p></div><strong>{money(item.price * item.quantity)}</strong></article>)}</section>
        <aside className="order-summary-card"><h3>Order Summary</h3><div className="summary-row"><span>Status</span><span className={`order-status status-${order.status}`}>{order.status}</span></div><div className="summary-row"><span>Payment</span><strong>{paymentName}</strong></div><div className="summary-row"><span>Store</span><strong>ShopNest</strong></div><hr /><div className="summary-row"><span>Subtotal</span><strong>{money(order.itemsPrice ?? order.totalPrice - (order.shippingPrice || 0) - (order.taxPrice || 0))}</strong></div><div className="summary-row"><span>Tax</span><strong>{money(order.taxPrice || 0)}</strong></div><div className="summary-row"><span>Shipping Cost</span><strong>{money(order.shippingPrice || 0)}</strong></div><div className="summary-row total-row"><span>Total</span><strong>{money(order.totalPrice)}</strong></div><hr /><h4>Delivery Address</h4><address>{order.shippingAddress.fullName}<br />{order.shippingAddress.street}<br />{order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />{order.shippingAddress.country}</address>{order.cancellation?.reason && <p className="cancellation-note">Cancellation reason: {order.cancellation.reason}</p>}{canCancel && <button type="button" className="cancel-order" onClick={() => setShowCancelDialog(true)}>Cancel Order</button>}<button type="button" className="btn" onClick={() => { dispatch(clearCart()); navigate('/profile'); }}>My Orders</button></aside>
      </div>
      {showCancelDialog && <div className="dialog-backdrop" role="presentation"><section className="cancel-dialog" role="dialog" aria-modal="true" aria-labelledby="cancel-title"><h3 id="cancel-title">Cancel Order</h3><p>Tell us why you are cancelling order {order.orderId}.</p><label>Reason<select value={cancellationReason} onChange={(event) => setCancellationReason(event.target.value)}><option value="">Select a reason</option><option value="Changed my mind">Changed my mind</option><option value="Ordered by mistake">Ordered by mistake</option><option value="Delivery is taking too long">Delivery is taking too long</option><option value="Other">Other</option></select></label><div className="dialog-actions"><button type="button" onClick={() => setShowCancelDialog(false)}>Keep Order</button><button type="button" className="cancel-confirm" onClick={cancelOrder} disabled={cancelling}>{cancelling ? 'Cancelling...' : 'Confirm Cancellation'}</button></div></section></div>}
    </div>
  );
};

export default OrderDetails;
