"use client";

import styles from "./underthumbnail.module.scss";

export default function Item({ item }) {
  return (
      <div className={styles.main}>
          <div>{item.name}</div>
          <div>£{item.price}</div>
      </div>
  );
}

