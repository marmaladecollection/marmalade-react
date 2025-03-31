"use client";

import { useRouter } from "next/navigation";
import { useMarmaladeContext } from "./context/MarmaladeContext";
import styles from "./underthumbnail.module.scss";

export default function UnderThumbnail({ item }) {
  const router = useRouter();
  const { basketIds, addToBasket } = useMarmaladeContext();

  const isInBasket = basketIds.includes(item.id);

  const add = () => {
    if (!isInBasket) {
      addToBasket(item.id);
      router.push("/basket");
    }
  };

  return (
    <div className={styles.main}>
      <span>{item.name}</span>
      <span>£{item.price}</span>
      <a 
        className={`${styles.save} ${isInBasket ? styles.disabled : ''}`} 
        onClick={add}
      >
        ADD
      </a>
    </div>
  );
}

