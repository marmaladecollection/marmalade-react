"use client";

import styles from "./total.module.scss";
import { useMarmaladeContext } from "../context/MarmaladeContext";

export default function Total() {
  const { basketItems } = useMarmaladeContext();
  const totalPrice = basketItems.reduce((total, item) => total + item.price, 0);

  return (
    <div className={styles.page}>
      <h3>Subtotal
        <span className={styles.excludingDelivery}>excluding delivery</span>
      </h3>
      <span className={styles.totalPrice}>£{totalPrice}</span>
    </div>
  );
}
