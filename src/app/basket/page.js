"use client";

import { useRouter } from "next/navigation";
import { useMarmaladeContext } from "../context/MarmaladeContext";
import styles from "./page.module.css";

export default function BasketPage({params}) {
  const router = useRouter();
  const { message } = useMarmaladeContext();

  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <button onClick={() => router.back()} className={styles.closeButton}>
          Close
        </button>
        <button onClick={() => router.push("/checkout")} className={styles.checkoutButton}> 
          checkout
        </button>
    
        <h1>BASKET</h1>
        <h2>{message}</h2>
      </main>
    </div>
  );
}
