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
      <div className={styles.bottomRow}>
        <div className={styles.col}>
          <div className={styles.contactItem}>
            <div className={styles.contactLabel}>✉️ Email:</div>
            <div className={styles.contactValue}>
              <a href="mailto:team@marmaladecollection.com" className={styles.email}>
                team@marmaladecollection.com
              </a>
            </div>
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.contactItem}>
            <div className={styles.contactLabel}>🕒 Working Days/Hours:</div>
            <div className={styles.contactValue}>Mon – Sat / 9:00AM – 5:00PM</div>
          </div>
        </div>
        <div className={styles.col}>
          <a href="/about">About Us</a>
        </div>
      </div>
    </footer>
  );
}

