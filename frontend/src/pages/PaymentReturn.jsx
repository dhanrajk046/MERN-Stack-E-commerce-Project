import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { clearCart } from '../redux/cartSlice';
import { ordersApi, paymentsApi } from '../services/api';

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('Verifying your payment…');

  useEffect(() => {
    const confirmPayment = async () => {
      const orderId = searchParams.get('orderId');
      const sessionId = searchParams.get('session_id');
      if (!orderId || !sessionId) {
        setMessage('We could not identify this payment. Please check your orders.');
        return;
      }
      try {
        const payment = await paymentsApi.getCheckoutSession(sessionId);
        if (!payment.verified) throw new Error('Your payment has not completed.');
        await ordersApi.confirmPayment(payment.orderId);
        dispatch(clearCart());
        navigate('/ordersuccess', { replace: true });
      } catch (error) {
        setMessage(error.message || 'Unable to verify your payment. Please contact support if you were charged.');
      }
    };
    confirmPayment();
  }, [dispatch, navigate, searchParams]);

  return <div className="status-page"><h2>Payment status</h2><p>{message}</p></div>;
};

export default PaymentReturn;
