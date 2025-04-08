"use client";

import styles from "./page.module.scss";
import { useRouter } from "next/navigation";
import Bill from "./Bill";

export default function CheckoutPage() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <div className={styles.checkout}>
        TBD
      </div>
      <div className={styles.list}>
        <Bill />
      </div>
    </div>
  );
}
