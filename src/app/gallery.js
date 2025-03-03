"use client";

import styles from './gallery.module.scss';
import Item from "./item";

export default function Gallery({ items }) {
  return (
    <main>
      <div className={styles.bar}>
        <div>32 products</div>
        <div>Sort By</div>
      </div>
      <div className={styles.main}>
        {items.map((item) => (
          <Item key={item.name} item={item} />
        ))}
      </div>
    </main>
  );
}

