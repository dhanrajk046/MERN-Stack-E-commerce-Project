import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ordersApi, paymentsApi } from '../services/api';
import '../styles/cart.css';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();
  const [address, setAddress] = useState({ fullName: '', street: '', city: '', postalCode: '', country: '' });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.qty, 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!user) return navigate('/login');
    if (!cartItems.length) return setError('Your cart is empty.');

    setProcessing(true);
    try {
      const items = cartItems.map((item) => ({ product: item.productId, quantity: item.qty }));
      const order = await ordersApi.create(items, address);
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
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>
          <input type="text" placeholder="Full Name" required value={address.fullName} onChange={(event) => setAddress({ ...address, fullName: event.target.value })} />
          <input type="text" placeholder="Street" required value={address.street} onChange={(event) => setAddress({ ...address, street: event.target.value })} />
          <input type="text" placeholder="City" required value={address.city} onChange={(event) => setAddress({ ...address, city: event.target.value })} />
          <input type="text" placeholder="Postal Code" required value={address.postalCode} onChange={(event) => setAddress({ ...address, postalCode: event.target.value })} />
          <input type="text" placeholder="Country" required value={address.country} onChange={(event) => setAddress({ ...address, country: event.target.value })} />
          {error && <p role="alert" className="checkout-error">{error}</p>}
          <div className="checkout-summary">
            <h4>Total to Pay: ₹{totalPrice.toFixed(2)}</h4>
            <button type="submit" className="btn" disabled={processing}>{processing ? 'Redirecting to Stripe…' : 'Continue to Stripe Checkout'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
