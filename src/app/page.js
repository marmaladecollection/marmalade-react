"use client";

import { useEffect, useState } from "react";
import { fetchAllItems } from "./firebase";
import Item from "./item";
import styles from "./page.module.css";

export default function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchAllItems(setItems);
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <ul>
          {items.map((item) => (
            <li key={item.name}>
              <Item item={item} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

