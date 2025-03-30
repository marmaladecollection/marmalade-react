"use client";

import styles from "./tocheckout.module.scss";

export default function ToCheckout() {
  return (
    <div className={styles.page}>
      <button className={styles.checkout}>Go To Checkout</button>
      <div className={styles.paymentMethods}>We accept the payment methods</div>
      <div className={styles.paymentMethods}>
        VISA  PAYPAL  MASTERCARD  APPLE PAY
      </div>
    </div>
  );
}
