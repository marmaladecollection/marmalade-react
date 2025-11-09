"use client";

import { formatPrice } from '../../../utils/formatPrice';
import styles from './itemheadline.module.scss';

export default function ItemHeadline({ item }) {

  return (
    <div className={styles.summary}>
      <span className={styles.name}>{item.name}</span>
      <span className={styles.price}>{formatPrice(item.price)}</span>
    </div>
  );
}
