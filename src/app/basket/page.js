"use client";

import styles from "./page.module.scss";
import BasketItems from "./basketitems";
import Total from "./total";
import ToCheckout from "./tocheckout";
import { useRouter } from 'next/navigation';
import { useMarmaladeContext } from "../context/MarmaladeContext";

export default function BasketPage() {
  const router = useRouter();
  const { basketIds } = useMarmaladeContext();

  if (basketIds.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyMessage}>
          Your bag is currently empty
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.list}>
        <button className={styles.continue} onClick={() => router.push('/')}>Continue Shopping</button>
        <BasketItems />
      </div>
      <div className={styles.summary}>
        <Total />
        <ToCheckout />
      </div>
    </div>
  );
}
