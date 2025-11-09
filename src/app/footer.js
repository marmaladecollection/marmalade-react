"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./footer.module.scss";
import { getCacheBustedSrc } from "../utils/imageCacheBuster";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topRow}>
        <Link href="/delivery" className={styles.feature}>
          <Image
            src={getCacheBustedSrc("/images/footer/van.png")}
            alt="Free Local Delivery"
            width={60}
            height={30}
            style={{
              width: "60px",
              height: "auto",
            }}
          />
          <div className={styles.featureTitle}>Free Local Delivery</div>

        </Link>
        <Link href="/returns" className={styles.feature}>
          <Image
            src={getCacheBustedSrc("/images/footer/returns2.png")}
            alt="Simple Returns"
            width={60}
            height={30}
            style={{
              width: "60px",
              height: "auto",
            }}
          />
          <div className={styles.featureTitle}>Simple Returns</div>

        </Link>
      </div>
    </footer>
  );
}

