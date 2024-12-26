"use client";

import { fetchAllItems } from "./firebase";
import { useState, useEffect } from "react";
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
       <h1>MARAMALADE GALLERY PAGE</h1>
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

