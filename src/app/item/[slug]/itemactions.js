"use client";

import { useRouter } from "next/navigation";
import { useMarmaladeContext } from "../../context/MarmaladeContext";
import styles from "./itemactions.module.scss";

import { sendEmailViaAPI } from "../../mailer";

export default function ItemActions({ item }) {
  const router = useRouter();
  const { basketIds, addToBasket } = useMarmaladeContext();

  const isInBasket = basketIds.includes(item.id);

  const add = () => {
    if (!isInBasket) {
      sendEmailViaAPI(
        "madeleine.spencer.marmalade@gmail.com",
        "Hello World",
        "This is a test email from your application!"
      );
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
