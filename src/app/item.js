"use client";

import Link from 'next/link';
import styles from './item.module.scss';
import Thumbnail from './thumbnail';
import UnderThumbnail from './underthumbnail';

export default function Item({ item, priority = false }) {
  return (
    <div key={item.id} className={styles.page}>
      <main>
        <Link href={`/item/${item.id}`} className={styles.main}>
          <Thumbnail item={item} priority={priority} />
        </Link>
        <UnderThumbnail item={item} />
      </main>
    </div>
  );
}

