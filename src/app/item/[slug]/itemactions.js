"use client";

import { useRouter } from "next/navigation";
import { useMarmaladeContext } from "../../context/MarmaladeContext";
import styles from "./itemactions.module.scss";

export default function ItemActions({ item }) {

  const router = useRouter();
  const { addToBasket } = useMarmaladeContext();

  const add = () => {
    addToBasket(item.id);
    router.push("/basket");
  }

  return (
    <div className={styles.buttons}>
      <a className={styles.addToBag} onClick={add}>Add to bag</a>
      <a className={styles.saveForLater}>Save for later</a>
    </div>
  );
}
