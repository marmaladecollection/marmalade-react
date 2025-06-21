'use client';
import { useEffect, useState } from 'react';
import { fetchAllItems, fetchSoldItems } from '../firebase';
import styles from './page.module.scss';

export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);

  useEffect(() => {
    fetchAllItems(setItems);
    fetchSoldItems().then(setSoldItems);
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <div className={styles.tablesRow}>
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
            <div className={styles.tableContainer}>
              {soldItems.length > 0 && (
                <>
                  <div className={styles.itemListHeading}>Sold Items</div>
                  <table className={styles.itemTable}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {soldItems.map(item => (
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
    </div>
  );
} 