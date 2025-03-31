"use client";

import Link from "next/link";
import { useMarmaladeContext } from "../context/MarmaladeContext";
import Thumbnail from "../thumbnail";
import styles from "./basketitem.module.scss";

export default function BasketItem({ item }) {
  const { removeFromBasket } = useMarmaladeContext();

  return (
    <div key={item.id} className={styles.page}>
      <div className={styles.leftSection}>
        <Link href={`/item/${item.id}`} className={styles.thumbnail}>
          <Thumbnail item={item} />
        </Link>
        <div className={styles.details}>
          <span className={styles.name}>{item.name}</span>
          <button className={styles.remove} onClick={() => removeFromBasket(item.id)}>Remove</button>
        </div>
      </div>
      <div className={styles.price}>£{item.price}</div>        
    </div>
  );
}
