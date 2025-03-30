"use client";

import styles from "./page.module.scss";
import BasketItems from "./basketitems";
import Total from "./total";
import ToCheckout from "./tocheckout";
import BasketHeader from "./basketheader";

export default function BasketPage() {
  return (
    <div className={styles.page}>
      <div className={styles.list}>
        <button className={styles.continue}>Continue Shopping</button>
         <BasketHeader />
         <BasketItems />
      </div>
      <div className={styles.summary}>
        <Total />
        <ToCheckout />
      </div>
    </div>
  );
}
