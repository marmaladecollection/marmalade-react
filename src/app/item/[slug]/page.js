"use client";

import Thumbnail from "@/app/thumbnail";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMarmaladeContext } from "../../context/MarmaladeContext";
import { fetchItemById } from "../../firebase";
import styles from "./page.module.css";

export default function ItemPage() {
  const [item, setItem] = useState([]);
  const router = useRouter();
  const { addToBasket } = useMarmaladeContext();

  useEffect(() => {
    const pathname = window.location.pathname;
    const itemIdFromPath = pathname.split("/").pop();
    fetchItemById(itemIdFromPath, setItem);
  }, []);

  const add = () => {
    addToBasket(item.id);
    router.push("/basket");
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>ITEM</h1>
        <h2>{item.name}</h2>
        <Thumbnail item={item} />
        <p>£{item.price}</p>
        <button onClick={add}>Add to basket</button>
      </main>
    </div>
  );
}
