"use client";

import { useRouter } from "next/navigation";
import styles from "./PaymentSuccess.module.scss";

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <div className={styles.successContainer}>
      <div className={styles.successContent}>
        <div className={styles.successIcon}>✓</div>
        <h2>Payment Successful!</h2>
        <p>Thank you for your purchase. Your order has been confirmed.</p>
        <p className={styles.orderInfo}>
          We'll send you an email with your order details shortly.
        </p>
        <button 
          onClick={() => router.push("/")} 
          className={styles.continueButton}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
} 