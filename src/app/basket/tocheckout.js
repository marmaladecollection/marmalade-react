"use client";

import styles from "./tocheckout.module.scss";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ToCheckout() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <div className={styles.buttons}>
        <button className={styles.checkout} onClick={() => router.push('/checkout')}>Go To Checkout</button>
      </div>
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
          width={60} 
          height={30}
          className={styles.paymentIcon}
        />
        <Image 
          src="/images/payment/link.svg" 
          alt="Pay with Link" 
          width={60} 
          height={30}
          className={styles.paymentIcon}
        />
      </div>
    </div>
  );
}
