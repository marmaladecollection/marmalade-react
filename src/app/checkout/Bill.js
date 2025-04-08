"use client";

import { useState, useEffect } from "react";
import { useMarmaladeContext } from "../context/MarmaladeContext";
import { fetchItemsByIds } from "../firebase";
import styles from "./Bill.module.css";

export default function Bill() {
  const { basketIds } = useMarmaladeContext();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItemsByIds(basketIds, setItems);
  }, [basketIds]);

  return (
    <div className={styles.bill}>
      <div className={styles.items}>
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            <span className={styles.itemName}>{item.name}</span>
            <span className={styles.itemPrice}>£{item.price}</span>
          </div>
        ))}
      </div>
      <div className={styles.total}>
        <h3>Total: £{items.reduce((sum, item) => sum + item.price, 0)}</h3>
      </div>
    </div>
  );
} 