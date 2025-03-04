"use client";

import styles from "./itemheadline.module.scss";

export default function ItemHeadline({ item }) {

  return (
    <div className={styles.summary}>
      <span className={styles.name}>{item.name}</span>
      <span className={styles.price}>£{item.price}</span>
    </div>
  );
}
