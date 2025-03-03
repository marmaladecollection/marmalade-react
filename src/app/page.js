"use client";

import { useEffect, useState } from "react";
import { fetchAllItems } from "./firebase";
import Gallery from "./gallery";
import styles from './page.module.scss';

export default function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchAllItems(setItems);
  }, []);

  return (
    <div className={styles.page}>
      <main>
        <Gallery items={items} />
      </main>
    </div>
  );
}

