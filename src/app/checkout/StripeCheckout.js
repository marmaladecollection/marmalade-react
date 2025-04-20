"use client";

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useMarmaladeContext } from '../context/MarmaladeContext';
import { sellItem } from '../firebase';
import PaymentSuccess from './PaymentSuccess';
import DeliveryAddressForm from './DeliveryAddressForm';
import LoadingSpinner from './LoadingSpinner';
import styles from './StripeCheckout.module.scss';

// Replace with your Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function ({ onPaymentSuccess }) {
  const { basketIds, basketItems, clearBasket } = useMarmaladeContext();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  const handleAddressSubmit = async (address) => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: basketItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
          })),
          shippingAddress: {
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            postal_code: address.postcode,
            country: address.country
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setLoading(false);
      setShowAddressForm(false);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const newSessionId = urlParams.get('session_id');
    if (newSessionId) {
      setSessionId(newSessionId);
      setProcessingPayment(true);
    }
  }, []);

  useEffect(() => {
    if (sessionId && !paymentSuccess) {
      let isMounted = true;
      
      const checkPaymentStatus = async () => {
        try {
          const response = await fetch(`/api/checkout-status?session_id=${sessionId}`);
          if (!response.ok) throw new Error('Failed to fetch payment status');
          
          const data = await response.json();
          if (isMounted && (data.status === "complete" || data.payment_status === "paid")) {
            setPaymentSuccess(true);
            setProcessingPayment(false);
            onPaymentSuccess?.();
            clearBasket();
            
            for (const item of basketItems) {
              try {
                console.log("selling item " + item.id);
                await sellItem(item, data);
              } catch (error) {
                console.error("Error recording sale for item:", item.id, error);
              }
            }

            const totalAmount = basketItems.reduce((sum, item) => sum + item.price, 0);
            const itemsList = basketItems.map(item => `- ${item.name} (£${item.price})`).join('\n');
            
            try {
              console.log('Sending seller notification email');
              const sellerResponse = await fetch('/api/send-sale-email', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  itemName: basketItems.length === 1 ? basketItems[0].name : `${basketItems.length} items`,
                  customerName: data.customer_details?.name || 'Unknown Customer',
                  customerEmail: data.customer_details?.email || 'No email provided',
                  customerAddress: data.customer_details?.address ? 
                    `${data.customer_details.address.line1}, ${data.customer_details.address.city}, ${data.customer_details.address.postal_code}, ${data.customer_details.address.country}` : 
                    'No address provided',
                  itemCost: totalAmount,
                  itemsList: itemsList,
                  isCustomerEmail: false
                }),
              });

              if (!sellerResponse.ok) {
                const errorData = await sellerResponse.json();
                console.error('Seller email sending failed:', errorData);
                throw new Error('Failed to send seller email');
              }

              console.log('Sending customer confirmation email');
              const customerResponse = await fetch('/api/send-sale-email', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  itemName: basketItems.length === 1 ? basketItems[0].name : `${basketItems.length} items`,
                  customerName: data.customer_details?.name || 'Unknown Customer',
                  customerEmail: data.customer_details?.email || 'No email provided',
                  customerAddress: data.customer_details?.address ? 
                    `${data.customer_details.address.line1}, ${data.customer_details.address.city}, ${data.customer_details.address.postal_code}, ${data.customer_details.address.country}` : 
                    'No address provided',
                  itemCost: totalAmount,
                  itemsList: itemsList,
                  isCustomerEmail: true
                }),
              });

              if (!customerResponse.ok) {
                const errorData = await customerResponse.json();
                console.error('Customer email sending failed:', errorData);
                throw new Error('Failed to send customer email');
              }
            } catch (error) {
              console.error('Error sending email notifications:', error);
            }
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
          setError(error.message);
          setProcessingPayment(false);
        }
      };
      
      checkPaymentStatus();
      return () => { isMounted = false; };
    }
  }, [sessionId, paymentSuccess]);

  if (paymentSuccess) {
    return <PaymentSuccess />;
  }

  if (processingPayment) {
    return <LoadingSpinner />;
  }

  if (showAddressForm) {
    return <DeliveryAddressForm onSubmit={handleAddressSubmit} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.checkoutContainer}>
        {error && <div className={styles.error}>{error}</div>}
        {loading && <div className={styles.loading}>Loading checkout...</div>}
        {clientSecret && (
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        )}
      </div>
    </div>
  );
}