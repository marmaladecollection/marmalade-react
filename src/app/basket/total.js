"use client";

import { useMarmaladeContext } from "../context/MarmaladeContext";
import { formatPrice } from "../../utils/formatPrice";
import styles from "./total.module.scss";

export default function Total() {
  const { basketItems } = useMarmaladeContext();
  const subtotal = basketItems.reduce((total, item) => total + Number(item.price), 0);
  const deliveryFee = 80;
  const totalPrice = subtotal + deliveryFee;

  return (
    <div className={styles.page}>
      <div className={styles.row}>
        <span>Subtotal</span>
        <span className={styles.price}>{formatPrice(subtotal)}</span>
      </div>
      <div className={styles.row}>
        <span>Delivery</span>
        <span className={styles.price}>{formatPrice(deliveryFee)}</span>
      </div>
      <div className={styles.totalRow}>
        <h3>Total</h3>
        <span className={styles.totalPrice}>{formatPrice(totalPrice)}</span>
      </div>
    </div>
  );
}
