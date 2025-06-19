"use client";

import Image from "next/image";
import styles from "./footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topRow}>
        <div className={styles.feature}>
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
            Free shipping on all orders over £150.
          </div>
        </div>
        <div className={styles.feature}>
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
        </div>
        <div className={styles.feature}>
          <Image
            src="/images/footer/environment.png"
            alt="Environmentally friendly"
            width={60}
            height={30}
            style={{
              width: "60px",
              height: "auto",
            }}
          />
          <div className={styles.featureTitle}>Environmentally friendly</div>
          <div className={styles.featureDesc}>
            Being Eco-friendly is at the heart of what we do!
          </div>
        </div>
      </div>
      <div className={styles.bottomRow}>
        <div className={styles.col}>
          <div className={styles.contactItem}>
            <div className={styles.contactLabel}>📞 Phone:</div>
            <div className={styles.contactValue}>000 0000 0000</div>
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.contactItem}>
            <div className={styles.contactLabel}>✉️ Email:</div>
            <div className={styles.contactValue}>
              <span className={styles.email}>team@marmaladecollection.com</span>
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
          <a href="#">About us</a>
        </div>
      </div>
    </footer>
  );
}

