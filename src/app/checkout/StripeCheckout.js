"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useMarmaladeContext } from "../context/MarmaladeContext";
import { fetchItemsByIds } from "../firebase";
import styles from "./StripeCheckout.module.scss";

// Replace with your Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function StripeCheckout() {
  const { basketIds } = useMarmaladeContext();
  const [items, setItems] = useState([]);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItemsByIds(basketIds, setItems);
  }, [basketIds]);

  useEffect(() => {
    if (items.length > 0) {
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
    } else {
      setLoading(false);
    }
  }, [items]);

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