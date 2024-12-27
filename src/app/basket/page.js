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

  const totalPrice = items.reduce((total, item) => total + item.price, 0);

  console.log("Rendering " + items.map(item => item.name));
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>BASKET</h1>
        <div className="gallery">
        {items.map((item) => (
          <div key={item.id}>
            <Item item={item} />
          </div>
        ))}
        </div>
        <div>TOTAL £{totalPrice}</div>
        <button>Checkout</button>
      </main>
    </div>
  );
}
