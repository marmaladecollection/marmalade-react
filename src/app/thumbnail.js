"use client";

import styles from './thumbnail.module.scss';

export default function UnderThumbnail({ item }) {
  return (
    <div>
      <img src={`/images/${item.name}.jpg`} />
      <div className={styles.addToBasket}>+</div>
    </div>

  );
}

