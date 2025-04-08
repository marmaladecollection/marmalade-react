"use client";

import styles from "./tocheckout.module.scss";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ToCheckout() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <button className={styles.checkout} onClick={() => router.push('/checkout')}>Go To Checkout</button>
      <div className={styles.paymentMethods}>We accept the payment methods</div>
      <div className={styles.paymentSymbols}>
        <Image 
          src="/images/payment/visa.svg" 
          alt="Visa" 
          width={60} 
          height={30}
          className={styles.paymentIcon}
        />
        <Image 
          src="/images/payment/mastercard.svg" 
          alt="Mastercard" 
          width={48} 
          height={30}
          className={styles.paymentIcon}
        />
        <Image 
          src="/images/payment/paypal.svg" 
          alt="PayPal" 
          width={72} 
          height={29}
          className={styles.paymentIcon}
        />
        <Image 
          src="/images/payment/applepay.svg" 
          alt="Apple Pay" 
          width={60} 
          height={29}
          className={styles.paymentIcon}
        />
      </div>
    </div>
  );
}
