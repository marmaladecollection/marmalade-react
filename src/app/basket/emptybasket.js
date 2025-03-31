"use client";

import { useRouter } from 'next/navigation';
import styles from "./emptybasket.module.scss";

export default function EmptyBasket() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <div className={styles.emptyMessage}>
        Your bag is currently empty
      </div>
      <button className={styles.continue} onClick={() => router.push('/')}>
        Continue Shopping
      </button>
    </div>
  );
} 