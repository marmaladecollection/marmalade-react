"use client";

import styles from "./page.module.scss";
import BasketItems from "./basketitems";
import Total from "./total";
import ToCheckout from "./tocheckout";
import EmptyBasket from "./emptybasket";
import { useRouter } from 'next/navigation';
import { useMarmaladeContext } from "../context/MarmaladeContext";
import { useState, useEffect } from 'react';

export default function BasketPage() {
  const router = useRouter();
  const { basketIds, basketItems } = useMarmaladeContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only consider loading complete when we have either items or confirmed empty basket
    if (basketItems.length > 0 || basketIds.length === 0) {
      setIsLoading(false);
    }
  }, [basketItems, basketIds]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (basketIds.length === 0) {
    return <EmptyBasket />;
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
