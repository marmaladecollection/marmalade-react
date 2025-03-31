"use client";

import styles from './thumbnail.module.scss';

export default function Thumbnail({ item }) {
  return (
    <div>
      <img className={styles.image} src={`/images/${item.id}.webp`} />

    </div>

  );
}

