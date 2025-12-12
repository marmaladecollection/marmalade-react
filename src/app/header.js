"use client";

import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.leftSection}>
        <Link href="/">Our Collection</Link>
      </div>
      <div className={styles.rightSection}>
        <Link href="/contact">Contact Us</Link>
        <Link href="/about">About</Link>
      </div>
    </div>
  );
}
