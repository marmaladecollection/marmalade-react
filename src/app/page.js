"use client";

import { useEffect, useState } from "react";
import { fetchAllItems } from "./firebase";
import Item from "./item";
import styles from './page.module.scss';

export default function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchAllItems(setItems);
  }, []);

  return (
    <div className={styles.page}>
      <main>
        <div className={styles.main}>
          {items.map((item) => (
              <Item key={item.name} item={item} />
          ))}
        </div>
      </main>
    </div>
  );
}

