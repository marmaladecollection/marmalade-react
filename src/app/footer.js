"use client";

import styles from "./footer.module.scss";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div>Help</div>
      <div>Delivery</div>
      <div>Returns</div>
      <div>Contact Us</div>
      <div>About Us</div>
    </div>
  );
}

