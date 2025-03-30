"use client";

import styles from "./total.module.scss";
import { useEffect, useState } from "react";
import { useMarmaladeContext } from "../context/MarmaladeContext";
import { fetchItemsByIds } from "../firebase";

export default function BasketPage() {
  const { basketIds, removeFromBasket } = useMarmaladeContext();
  const [items, setItems] = useState([]);

  useEffect(() => {
      fetchItemsByIds(basketIds, setItems);
  }, [basketIds]);

  const totalPrice = items.reduce((total, item) => total + item.price, 0);

  return (
    <div className={styles.page}>
      <h3>Subtotal</h3>
      <span>excluding delivery</span>
      <span>£{totalPrice}</span>
    </div>
  );
}
