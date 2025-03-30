"use client";

import styles from "./page.module.scss";
import BasketItems from "./basketitems";
import Total from "./total";
import ToCheckout from "./tocheckout";

export default function BasketPage() {
  return (
    <div className={styles.page}>
      <BasketItems />
      <div className={styles.summary}>
        <Total />
        <ToCheckout />
      </div>
    </div>
  );
}
