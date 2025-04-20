"use client";

import styles from "./footer.module.scss";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <a href="/delivery">Delivery</a>
      <a href="/returns">Returns</a>
      <a href="/contact">Contact Us</a>
      <a href="/about">About Us</a>
    </div>
  );
}

