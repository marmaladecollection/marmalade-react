"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useMarmaladeContext } from "../context/MarmaladeContext";
import { fetchItemsByIds, sellItem } from "../firebase";
import PaymentSuccess from "./PaymentSuccess";
import styles from "./StripeCheckout.module.scss";


// Replace with your Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function ({ onPaymentSuccess }) {
  const { basketIds, clearBasket } = useMarmaladeContext();
  const [items, setItems] = useState([]);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    fetchItemsByIds(basketIds, setItems);
  }, [basketIds]);

  useEffect(() => {
    // Check if we're returning from a successful payment
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId && !paymentSuccess) {
      let isMounted = true;
      
      const checkPaymentStatus = async () => {
        try {
          const response = await fetch(`/api/checkout-status?session_id=${sessionId}`);
          if (!response.ok) throw new Error('Failed to fetch payment status');
          
          const data = await response.json();
          if (isMounted && (data.status === "complete" || data.payment_status === "paid")) {
            setPaymentSuccess(true);
            onPaymentSuccess?.();
            // Clear the basket after successful payment
            clearBasket();
            
            const timeString = new Date().toTimeString().split(' ')[0].split(':').slice(0, 2).join('');
            const basketId = `${new Date().toISOString().split('T')[0]}-${timeString}-${Math.floor(Math.random() * 1000000)}`;
            for (const item of items) {
              try {
                console.log("selling item " + item.id + " with basket id " + basketId);
                await sellItem(item, data, basketId);
              } catch (error) {
                console.error("Error recording sale for item:", item.id, error);
              }
            }
          }
        } catch (err) {
          if (isMounted) {
            console.error("Error checking payment status:", err);
          }
        }
      };

      checkPaymentStatus();
      
      // Cleanup function
      return () => {
        isMounted = false;
      };
    }
  }, [clearBasket, onPaymentSuccess, items, paymentSuccess]);

  useEffect(() => {
    if (items.length > 0 && !paymentSuccess) {
      // Calculate the total amount
      const amount = items.reduce((sum, item) => sum + item.price, 0);
      
      // Create a checkout session on your server
      fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price
          }))
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to create checkout session');
          }
          return res.json();
        })
        .then((data) => {
          setClientSecret(data.clientSecret);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else if (items.length === 0) {
      setLoading(false);
    }
  }, [items, paymentSuccess]);

  if (paymentSuccess) {
    return (
      <div className={styles.fullWidthContainer}>
        <PaymentSuccess />
      </div>
    );
  }

  if (loading) {
    return <div className={styles.loading}>Loading payment form...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (items.length === 0) {
    return <div className={styles.empty}>Your basket is empty</div>;
  }

  return (
    <div className={styles.checkoutForm}>
      {clientSecret && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
}