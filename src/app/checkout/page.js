"use client";

import styles from "./page.module.scss";
import { useRouter } from "next/navigation";
import Bill from "./Bill";
import StripeCheckout from "./StripeCheckout";

export default function CheckoutPage() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <div className={styles.checkout}>
        <StripeCheckout />
      </div>
      <div className={styles.list}>
        <Bill />
      </div>
    </div>
  );
}
