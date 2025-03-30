"use client";

import styles from './basketheader.module.scss';

export default function BasketHeader() {
  return (
    <div className={styles.header}>
      <div className={styles.product}>Product</div>
      <div className={styles.price}>Price</div>
    </div>
  );
} 