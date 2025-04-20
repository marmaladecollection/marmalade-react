"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';
import Bill from './Bill';
import StripeCheckout from './StripeCheckout';

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  return (
    <div className={styles.page}>
      {paymentSuccess ? (
        <div className={styles.fullWidth}>
          <StripeCheckout onPaymentSuccess={() => setPaymentSuccess(true)} />
        </div>
      ) : (
        <>
          <div className={styles.checkout}>
            <StripeCheckout onPaymentSuccess={() => setPaymentSuccess(true)} />
          </div>
          <div className={styles.list}>
            <Bill />
          </div>
        </>
      )}
    </div>
  );
}
