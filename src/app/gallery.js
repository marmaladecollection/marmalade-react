"use client";

import styles from './gallery.module.scss';
import Item from "./item";

export default function Gallery({ items }) {
  return (
    <main>
      <div className={styles.galleryHeader}>
        <div>32 products</div>
        <div>Sort By</div>
      </div>
      <div className={styles.gallery}>
        {items.map((item) => (
          <div key={item.name} className={styles.item}>
            <Item item={item} />
          </div>
        ))}
      </div>
    </main>
  );
}

