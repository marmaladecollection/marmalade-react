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
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [saleData, setSaleData] = useState(() => {
    // Try to load sale data from localStorage on initial render
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('pendingSaleData');
      if (savedData) {
        try {
          return JSON.parse(savedData);
        } catch (e) {
          console.error('Error parsing saved sale data:', e);
          return null;
        }
      }
    }
    return null;
  });

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
      console.log("New session ID found:", newSessionId);
      setPaymentSuccess(true);
      setSessionId(newSessionId);
    }
  }, []);

  const handleAddressSubmit = async (address) => {
    try {
      console.log("Address form submitted with address:", address);
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
      console.log("Setting delivery address:", address);
      setDeliveryAddress(address);
      setClientSecret(data.clientSecret);
      setShowAddressForm(false);
      
      // Store the sale data in localStorage
      const newSaleData = {
        items: [...basketItems],
        address: address
      };
      setSaleData(newSaleData);
      localStorage.setItem('pendingSaleData', JSON.stringify(newSaleData));
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError(error.message);
    }
  };

  // Add effect to log delivery address changes
  useEffect(() => {
    console.log("Delivery address state changed:", deliveryAddress);
  }, [deliveryAddress]);

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
            console.log("Sale data:", saleData);
            
            if (!saleData?.items || saleData.items.length === 0) {
              console.error("No items to record sales for");
              setError("No items found to record sales for");
              return;
            }
            
            // Record sales using the stored items
            try {
              for (const item of saleData.items) {
                try {
                  console.log("Starting sale recording for item:", item.id);
                  console.log("Item data:", item);
                  console.log("Stripe data being passed:", data);
                  console.log("Delivery address:", saleData.address);
                  await sellItem(item, data, saleData.address);
                  console.log("Successfully recorded sale for item:", item.id);
                } catch (error) {
                  console.error("Failed to record sale for item:", item.id, error);
                  throw error;
                }
              }
              
              console.log("All sales recorded successfully");
              
              // Clear localStorage after successful sale recording
              localStorage.removeItem('pendingSaleData');
              
              // Only clear basket and set payment success after all operations are complete
              clearBasket();
              console.log("Basket cleared after successful sale recording");
              setPaymentSuccess(true);
              onPaymentSuccess?.();

              const totalAmount = saleData.items.reduce((sum, item) => sum + item.price, 0);
              const itemsList = saleData.items.map(item => `- ${item.name} (£${item.price})`).join('\n');
            
              try {
                console.log('Sending seller notification email');
                const sellerResponse = await fetch('/api/send-sale-email', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    itemName: saleData.items.length === 1 ? saleData.items[0].name : `${saleData.items.length} items`,
                    customerName: data.customer_details?.name || 'Unknown Customer',
                    customerEmail: data.customer_details?.email || 'No email provided',
                    customerAddress: saleData.address ? 
                      `${saleData.address.line1}${saleData.address.line2 ? ', ' + saleData.address.line2 : ''}, ${saleData.address.city}, ${saleData.address.postcode}, ${saleData.address.country}` : 
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
                    itemName: saleData.items.length === 1 ? saleData.items[0].name : `${saleData.items.length} items`,
                    customerName: data.customer_details?.name || 'Unknown Customer',
                    customerEmail: data.customer_details?.email || 'No email provided',
                    customerAddress: saleData.address ? 
                      `${saleData.address.line1}${saleData.address.line2 ? ', ' + saleData.address.line2 : ''}, ${saleData.address.city}, ${saleData.address.postcode}, ${saleData.address.country}` : 
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
  }, [sessionId, paymentSuccess, saleData]);

  if (paymentSuccess) {
    console.log("Showing payment success page");
    return <PaymentSuccess />;
  }

  if (showAddressForm) {
    console.log("Showing address form");
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