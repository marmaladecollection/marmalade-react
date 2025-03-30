"use client";

import Link from "next/link";
import { useMarmaladeContext } from "../context/MarmaladeContext";
import Thumbnail from "../thumbnail";
import styles from "./basketitem.module.scss";
export default function BasketItem({ item }) {
  const { removeFromBasket } = useMarmaladeContext();

  return (
    <div key={item.id} className={styles.page}>
        <Link href={`/item/${item.id}`} className={styles.thumbnail}>
          <Thumbnail item={item} />
        </Link>
        <div>
          <span>{item.name}</span>
          <button onClick={() => removeFromBasket(item.id)}>Remove</button>
        </div>
        <div>£{item.price}</div>        
    </div>
  );
}
