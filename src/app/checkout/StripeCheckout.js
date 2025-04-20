"use client";

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useMarmaladeContext } from '../context/MarmaladeContext';
import { sellItem } from '../firebase';
import PaymentSuccess from './PaymentSuccess';
import DeliveryAddressForm from './DeliveryAddressForm';
import styles from './StripeCheckout.module.scss';

// Replace with your Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function ({ onPaymentSuccess }) {
  const { basketIds, basketItems, clearBasket } = useMarmaladeContext();
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [itemsToSell, setItemsToSell] = useState([]);

  // Initialize itemsToSell when basketItems changes
  useEffect(() => {
    if (basketItems.length > 0) {
      setItemsToSell([...basketItems]);
    }
  }, [basketItems]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const newSessionId = urlParams.get('session_id');
    if (newSessionId) {
      setSessionId(newSessionId);
    }
  }, []);

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
      setShowAddressForm(false);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError(error.message);
    }
  };

  // Add event listener for Stripe checkout completion
  useEffect(() => {
    const handleCheckoutComplete = (event) => {
      if (event.data.type === 'checkout.session.completed') {
        setShowAddressForm(false);
      }
    };

    window.addEventListener('message', handleCheckoutComplete);
    return () => window.removeEventListener('message', handleCheckoutComplete);
  }, []);

  useEffect(() => {
    if (sessionId && !paymentSuccess) {
      let isMounted = true;
      
      const checkPaymentStatus = async () => {
        try {
          console.log("Checking payment status for session:", sessionId);
          const response = await fetch(`/api/checkout-status?session_id=${sessionId}`);
          if (!response.ok) throw new Error('Failed to fetch payment status');
          
          const data = await response.json();
          console.log("Received payment status data:", data);
          
          if (isMounted && (data.status === "complete" || data.payment_status === "paid")) {
            console.log("Payment successful, proceeding with sale recording");
            console.log("Items to sell:", itemsToSell);
            
            if (!itemsToSell || itemsToSell.length === 0) {
              console.error("No items to record sales for");
              setError("No items found to record sales for");
              return;
            }

            setPaymentSuccess(true);
            onPaymentSuccess?.();
            
            // Record sales using the stored items
            try {
              for (const item of itemsToSell) {
                try {
                  console.log("Starting sale recording for item:", item.id);
                  console.log("Item data:", item);
                  console.log("Stripe data being passed:", data);
                  await sellItem(item, data);
                  console.log("Successfully recorded sale for item:", item.id);
                } catch (error) {
                  console.error("Failed to record sale for item:", item.id, error);
                  throw error;
                }
              }
              
              console.log("All sales recorded successfully");
              
              // Only clear basket after all operations are complete
              clearBasket();
              console.log("Basket cleared after successful sale recording");

              const totalAmount = itemsToSell.reduce((sum, item) => sum + item.price, 0);
              const itemsList = itemsToSell.map(item => `- ${item.name} (£${item.price})`).join('\n');
            
              try {
                console.log('Sending seller notification email');
                const sellerResponse = await fetch('/api/send-sale-email', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    itemName: itemsToSell.length === 1 ? itemsToSell[0].name : `${itemsToSell.length} items`,
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
                    itemName: itemsToSell.length === 1 ? itemsToSell[0].name : `${itemsToSell.length} items`,
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
            } catch (error) {
              console.error("Error recording sales:", error);
              setError("Failed to record sales. Please contact support.");
              return;
            }
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
          setError(error.message);
        }
      };
      
      checkPaymentStatus();
      return () => { isMounted = false; };
    }
  }, [sessionId, paymentSuccess, itemsToSell]);

  if (paymentSuccess) {
    return <PaymentSuccess />;
  }

  if (showAddressForm) {
    return <DeliveryAddressForm onSubmit={handleAddressSubmit} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.checkoutContainer}>
        {error && <div className={styles.error}>{error}</div>}
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