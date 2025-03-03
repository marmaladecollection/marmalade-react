"use client";

import styles from './gallery.module.scss';
import Item from "./item";

export default function Gallery({items}) {
  return (
      <div className={styles.main}>
        {items.map((item) => (
            <Item key={item.name} item={item} />
        ))}
      </div>
  );
}

