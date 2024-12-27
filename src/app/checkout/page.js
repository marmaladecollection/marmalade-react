"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage({params}) {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <button onClick={() => router.back()} className={styles.closeButton}>
          Back
        </button>
        <h1>MARAMALADE CHECKOUT PAGE</h1>
        <h2>Chair</h2>
      </main>
    </div>
  );
}
