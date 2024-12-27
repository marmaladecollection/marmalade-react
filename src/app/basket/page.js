"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMarmaladeContext } from "../context/MarmaladeContext";
import { fetchItemById } from "../firebase";
import Thumbnail from "../thumbnail";
import styles from "./page.module.css";

export default function BasketPage() {
  const router = useRouter();
  const { basketItemId } = useMarmaladeContext();
  const [item, setItem] = useState([]);

  useEffect(() => {
      fetchItemById(basketItemId, setItem);
  }, [basketItemId]);

  console.log('Rendering basket page with item id ' + basketItemId);
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
        <h2>{item.name}</h2>
        <Thumbnail item={item} />
      </main>

    </div>
  );
}
