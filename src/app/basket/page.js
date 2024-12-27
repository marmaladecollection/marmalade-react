"use client";

import { useEffect, useState } from "react";
import { useMarmaladeContext } from "../context/MarmaladeContext";
import { fetchItemsByIds } from "../firebase";
import Item from "../item";
import styles from "./page.module.css";

export default function BasketPage() {
  const { basketIds } = useMarmaladeContext();
  const [items, setItems] = useState([]);

  useEffect(() => {
      fetchItemsByIds(basketIds, setItems);
  }, [basketIds]);

  console.log("Rendering " + items.map(item => item.name));
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>BASKET</h1>
        {items.map((item) => (
          <div key={item.id}>
            <Item item={item} />
          </div>
        ))}
      </main>
    </div>
  );
}
