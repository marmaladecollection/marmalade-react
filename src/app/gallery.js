"use client";

import { useEffect, useState } from 'react';
import styles from './gallery.module.scss';
import Item from './item';

function SkeletonItem() {
  return (
    <div className={styles.item}>
      <div className={styles.skeleton} />
      <div className={styles.skeletonInfo}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonPrice} />
        <div className={styles.skeletonButton} />
      </div>
    </div>
  );
}

export default function Gallery({ items }) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (items && items.length > 0) {
      setIsLoading(false);
    }
  }, [items]);

  if (isLoading) {
    return (
      <main>
        <div className={styles.gallery}>
          {[...Array(8)].map((_, index) => (
            <SkeletonItem key={`skeleton-${index}`} />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main>
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

