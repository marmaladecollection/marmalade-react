"use client";

import Thumbnail from "@/app/thumbnail";
import { useRouter } from "next/navigation";
import { useMarmaladeContext } from "../../context/MarmaladeContext";
import styles from "./itemprimary.module.scss";

export default function ItemPrimary({ item }) {

  const router = useRouter();
  const { addToBasket } = useMarmaladeContext();

  const add = () => {
    addToBasket(item.id);
    router.push("/basket");
  }

  return (
    <main className={styles.mainBit}>
      <div className={styles.images}>
        <Thumbnail item={item} />
      </div>
      <div className={styles.actions}>
        <div className={styles.summary}>
          <span className={styles.description}>Rose and Geranium Scented Candle</span>
          <span className={styles.price}>£{item.price}</span>
        </div>
        <span className={styles.returns}>Free UK Returns on all orders</span>
        <div className={styles.buttons}>
          <a className={styles.addToBag} onClick={add}>Add to bag</a>
          <a className={styles.saveForLater}>Save for later</a>
        </div>
        <span className={styles.productInfo}>Product Information</span>
      </div>
    </main>

  );
}
