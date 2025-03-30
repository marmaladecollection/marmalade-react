"use client";

import { useRouter } from "next/navigation";
import { useMarmaladeContext } from "./context/MarmaladeContext";
import styles from "./underthumbnail.module.scss";

export default function UnderThumbnail({ item }) {
  const router = useRouter();
  const { addToBasket } = useMarmaladeContext();

  const add = () => {
    addToBasket(item.id);
    router.push("/basket");
  };

  return (
    <div className={styles.main}>
      <span>{item.name}</span>
      <span>£{item.price}</span>
      <a className={styles.save} onClick={add}>ADD</a>
    </div>
  );
}

