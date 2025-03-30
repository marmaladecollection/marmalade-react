"use client";

import styles from "./page.module.scss";
import BasketItems from "./basketitems";
import Total from "./total";
import ToCheckout from "./tocheckout";
import BasketHeader from "./basketheader";
import { useRouter } from 'next/navigation';

export default function BasketPage() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <div className={styles.list}>
        <button className={styles.continue} onClick={() => router.push('/')}>Continue Shopping</button>
         <BasketHeader />
         <BasketItems />
      </div>
      <div className={styles.summary}>
        <Total />
        <ToCheckout />
      </div>
    </div>
  );
}
