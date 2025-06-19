"use client";

import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.contact}>
        <Link href="/contact">Contact Us</Link>
        <Link href="/about">About Us</Link>
      </div>
    </div>
  );
}
