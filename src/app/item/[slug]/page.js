"use client";

import { useEffect, useState } from "react";
import { fetchItemById } from "../../firebase";
import ItemPrimary from "./itemprimary";
import ItemSecondary from "./itemsecondary";
import styles from "./page.module.scss";

export default function ItemPage() {
  const [item, setItem] = useState([]);


  useEffect(() => {
    const pathname = window.location.pathname;
    const itemIdFromPath = pathname.split("/").pop();
    fetchItemById(itemIdFromPath, setItem);
  }, []);


  return (
    <div className={styles.page}>
      <ItemPrimary item={item} />
      <ItemSecondary item={item} />
    </div>
  );
}
