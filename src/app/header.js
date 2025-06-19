"use client";

import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.contact}>
        <Link href="mailto:team@marmaladecollection.com" className={styles.contactItem}>
          <span>✉️</span>
          <span>team@marmaladecollection.com</span>
        </Link>
        <Link href="tel:00000000000" className={styles.contactItem}>
          <span>📞</span>
          <span>000 0000 0000</span>
        </Link>
      </div>

      <div className={styles.links}>
        <Link href="/contact">Contact Us</Link>
      </div>
    </div>
  );
}
