"use client";


import { useEffect, useState } from 'react';
import { fetchItemById } from '../../firebase';
import ItemPrimary from './itemprimary';
import styles from './page.module.scss';

export default function ItemPage() {
  const [item, setItem] = useState(null);
  const [isSold, setIsSold] = useState(false);

  useEffect(() => {
    const pathname = window.location.pathname;
    const itemIdFromPath = pathname.split("/").pop();
    fetchItemById(itemIdFromPath, setItem, (itemData) => {
      setItem(itemData);
      setIsSold(true);
    });
  }, []);

  if (!item) return null;

  return (
    <>
      {isSold && (
        <div className={styles.soldBanner}>
          We're sorry, this item has been sold
        </div>
      )}
      <div className={styles.container}>
        <div className={`${styles.content} ${isSold ? styles.sold : ''}`}>
          {isSold && <div className={styles.soldOverlay}></div>}
          <ItemPrimary item={item} />
        </div>
      </div>
    </>
  );
}
