"use client";

import { useEffect, useState } from "react";
import { useMarmaladeContext } from "../context/MarmaladeContext";
import { fetchItemsByIds } from "../firebase";
import BasketItem from "./basketitem";
import BasketHeader from "./basketheader";
import styles from "./basketitems.module.scss";

export default function BasketItems() {
  const { basketIds, removeFromBasket } = useMarmaladeContext();
  const [items, setItems] = useState([]);

  useEffect(() => {
      fetchItemsByIds(basketIds, setItems);
  }, [basketIds]);

  return (
    <div className={styles.page}>
        {items.length === 0 ? (
          <div>Your bag is currently empty</div>
        ) : (
          <>
            <BasketHeader />
            {items.map((item) => (
              <BasketItem key={item.id + Math.random()} item={item} />
            ))}
          </>
        )}
    </div>
  );
}
