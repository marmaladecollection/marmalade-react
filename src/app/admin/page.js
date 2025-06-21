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
          <p className={styles.text}>
            This is a hidden page for administrators. Add admin tools and information here.
          </p>
          <p className={styles.text}>
            Number of items for sale: <b>{items.length}</b>
          </p>
        </div>
      </div>
    </div>
  );
} 