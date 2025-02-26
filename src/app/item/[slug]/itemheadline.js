"use client";

import styles from "./itemheadline.module.scss";

export default function ItemHeadline({ item }) {

  return (
    <div className={styles.summary}>
      <span className={styles.description}>Rose and Geranium Scented Candle</span>
      <span className={styles.price}>£{item.price}</span>
    </div>
  );
}
