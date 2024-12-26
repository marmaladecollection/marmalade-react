"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BasketPage({params}) {


  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>MARAMALADE BASKET PAGE</h1>
        <h2>Chair</h2>
      </main>
    </div>
  );
}
