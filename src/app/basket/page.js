"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMyContext } from "../context/MyContext";

export default function BasketPage({params}) {
  const router = useRouter();
  const { message } = useMyContext();

  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <button onClick={() => router.back()} className={styles.closeButton}>
          Close
        </button>
        <button onClick={() => router.push("/checkout")} className={styles.checkoutButton}> 
          checkout
        </button>
    
        <h1>MARAMALADE BASKET PAGE</h1>
        <h2>{message}</h2>
      </main>
    </div>
  );
}
