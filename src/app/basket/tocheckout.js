"use client";

import styles from "./tocheckout.module.scss";

export default function ToCheckout() {
  return (
    <div className={styles.page}>
      <button>Go To Checkout</button>
      <div>We accept the payment methods</div>
      <div>
        VISA  PAYPAL  MASTERCARD  APPLE PAY
      </div>
    </div>
  );
}
