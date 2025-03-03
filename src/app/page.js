"use client";

import { useEffect, useState } from "react";
import Category from "./category";
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
        <Category />
        <Gallery items={items} />
      </main>
    </div>
  );
}

