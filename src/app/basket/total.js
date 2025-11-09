"use client";

import { useMarmaladeContext } from "../context/MarmaladeContext";
import styles from "./total.module.scss";

export default function Total() {
  const { basketItems } = useMarmaladeContext();
  const totalPrice = basketItems.reduce((total, item) => total + Number(item.price), 0);

  return (
    <div className={styles.page}>
      <h3>Subtotal</h3>
      <span className={styles.totalPrice}>£{totalPrice}</span>
    </div>
  );
}
