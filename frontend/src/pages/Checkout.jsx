import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ordersApi, paymentsApi } from '../services/api';
import { clearCart } from '../redux/cartSlice';
import '../styles/cart.css';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [address, setAddress] = useState({ fullName: '', street: '', city: '', postalCode: '', country: '' });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const itemsPrice = cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  const shippingPrice = 40;
  const totalPrice = itemsPrice + shippingPrice;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!user) return navigate('/login');
    if (!cartItems.length) return setError('Your cart is empty.');

    setProcessing(true);
    try {
      const items = cartItems.map((item) => ({ product: item.productId, quantity: item.qty }));
      const order = await ordersApi.create(items, address, paymentMethod);
      if (paymentMethod === 'cod') {
        dispatch(clearCart());
        navigate(`/orders/${order.orderId}`, { replace: true });
        return;
      }
      const session = await paymentsApi.createCheckoutSession(order.orderId);
      window.location.assign(session.url);
    } catch (requestError) {
      setError(requestError.message || 'Unable to start secure checkout. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-layout">
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>
          <input type="text" placeholder="Full Name" required value={address.fullName} onChange={(event) => setAddress({ ...address, fullName: event.target.value })} />
          <input type="text" placeholder="Street" required value={address.street} onChange={(event) => setAddress({ ...address, street: event.target.value })} />
          <input type="text" placeholder="City" required value={address.city} onChange={(event) => setAddress({ ...address, city: event.target.value })} />
          <input type="text" placeholder="Postal Code" required value={address.postalCode} onChange={(event) => setAddress({ ...address, postalCode: event.target.value })} />
          <input type="text" placeholder="Country" required value={address.country} onChange={(event) => setAddress({ ...address, country: event.target.value })} />
          <fieldset className="payment-options">
            <legend>Payment Method</legend>
            <label className={`payment-option ${paymentMethod === 'stripe' ? 'selected' : ''}`}>
              <input type="radio" name="paymentMethod" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} />
              <span><strong>Online Payment</strong><small>Secure payment through Stripe Checkout</small></span>
            </label>
            <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
              <input type="radio" name="paymentMethod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              <span><strong>Cash on Delivery</strong><small>Pay when your order arrives</small></span>
            </label>
          </fieldset>
          {error && <p role="alert" className="checkout-error">{error}</p>}
          <div className="checkout-summary">
            <h4>Total to Pay: ₹{totalPrice.toFixed(2)}</h4>
            <button type="submit" className="btn" disabled={processing}>{processing ? 'Placing order...' : paymentMethod === 'cod' ? 'Place Cash on Delivery Order' : 'Continue to Stripe Checkout'}</button>
          </div>
        </form>
        <aside className="checkout-order-summary">
          <h3>Order Summary</h3>
          {cartItems.map((item) => <div className="checkout-item" key={item.productId}><span>{item.name} x {item.qty}</span><strong>₹{(item.price * item.qty).toFixed(2)}</strong></div>)}
          <div className="checkout-item"><span>Shipping</span><strong>₹{shippingPrice.toFixed(2)}</strong></div>
          <div className="checkout-total"><span>Total</span><strong>₹{totalPrice.toFixed(2)}</strong></div>
          <Link to="/cart">Edit cart</Link>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
