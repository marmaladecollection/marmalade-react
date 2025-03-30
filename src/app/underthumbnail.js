"use client";

import styles from "./underthumbnail.module.scss";

export default function Item({ item }) {
  return (
      <div className={styles.main}>
          <span>{item.name}</span>
          <span>£{item.price}</span>
          <a className={styles.save}>ADD</a>
      </div>
  );
}

