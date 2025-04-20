"use client";

import { useMarmaladeContext } from "../context/MarmaladeContext";
import BasketItem from "./basketitem";
import BasketHeader from "./basketheader";
import styles from "./basketitems.module.scss";

export default function BasketItems() {
  const { basketItems } = useMarmaladeContext();

  return (
    <div className={styles.page}>
      <BasketHeader />
      {basketItems.map((item) => (
        <BasketItem key={item.id + Math.random()} item={item} />
      ))}
    </div>
  );
}
