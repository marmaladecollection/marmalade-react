'use client';
import { useEffect, useState } from 'react';
import { fetchAllItems, fetchSoldItemDetails } from '../firebase';
import styles from './page.module.scss';
import SalesTable from '../components/SalesTable';

export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);

  useEffect(() => {
    fetchAllItems(setItems);
    fetchSoldItemDetails().then(setSoldItems);
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          {/* Sold Items table on top */}
          <div className={styles.tableContainer + ' ' + styles['tableContainer--large-gap']}>
            <SalesTable soldItems={soldItems} heading="Sold Items" styles={styles} />
          </div>
          {/* Items for Sale table below */}
          <div className={styles.tableContainer}>
            {items.length > 0 && (
              <>
                <div className={styles.itemListHeading}>Items for Sale</div>
                <table className={styles.itemTable}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id} className={styles.itemRow}>
                        <td>{item.name}</td>
                        <td>£{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 