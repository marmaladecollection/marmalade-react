"use client";

import { useRouter } from "next/navigation";
import { useMarmaladeContext } from "../../context/MarmaladeContext";
import styles from "./itemactions.module.scss";
import { sellItem } from "../../firebase";
export default function ItemActions({ item }) {
  const router = useRouter();
  const { basketIds, addToBasket } = useMarmaladeContext();

  const isInBasket = basketIds.includes(item.id);

  const add = () => {
    if (!isInBasket) {

      addToBasket(item.id);
      router.push("/basket");
    }
  }

  return (
    <div className={styles.buttons}>
      <a 
        className={`${styles.addToBag} ${isInBasket ? styles.disabled : ''}`} 
        onClick={add}
      >
        Add to bag
      </a>
    </div>
  );
}
