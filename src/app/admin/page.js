'use client';
import { useEffect, useState } from 'react';
import { fetchAllItems } from '../firebase';
import styles from './page.module.scss';

export default function AdminPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchAllItems(setItems);
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <h1>Admin</h1>
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
  );
} 