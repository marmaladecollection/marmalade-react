'use client';
import { useEffect, useState } from 'react';
import { fetchSoldItems } from '../firebase';
import SalesTable from '../components/SalesTable';
import styles from '../admin/page.module.scss';

export default function SalesPage() {
  const [soldItems, setSoldItems] = useState([]);

  useEffect(() => {
    fetchSoldItems().then(setSoldItems);
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <div className={styles.tableContainer + ' ' + styles['tableContainer--large-gap']}>
            <SalesTable soldItems={soldItems} heading="Sold Items" styles={styles} />
          </div>
        </div>
      </div>
    </div>
  );
} 