"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topRow}>
        <Link href="/delivery" className={styles.feature}>
          <Image
            src="/images/footer/van.png"
            alt="Free Delivery"
            width={60}
            height={30}
            style={{
              width: "60px",
              height: "auto",
            }}
          />
          <div className={styles.featureTitle}>Free Delivery</div>
          <div className={styles.featureDesc}>
            Free local delivery on all orders over £150.
          </div>
        </Link>
        <Link href="/returns" className={styles.feature}>
          <Image
            src="/images/footer/returns.png"
            alt="Simple Returns"
            width={60}
            height={30}
            style={{
              width: "60px",
              height: "auto",
            }}
          />
          <div className={styles.featureTitle}>Simple Returns</div>
          <div className={styles.featureDesc}>
            Not happy? Our team is always on hand!
          </div>
        </Link>
      </div>
    </footer>
  );
}

