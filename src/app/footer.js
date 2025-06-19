"use client";

import styles from "./footer.module.scss";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topRow}>
        <div className={styles.feature}>
          <Image
            src="/images/footer/van.png"
            alt="Free Delivery"
            width={60}
            height={30} // Adjusted for a more natural 2:1 aspect ratio
            style={{
              width: "60px",
              height: "auto", // This ensures the image maintains its natural aspect ratio
            }}
          />
          <div className={styles.featureTitle}>Free Delivery</div>
          <div className={styles.featureDesc}>
            Free shipping on all orders over £99+.
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
          <div className={styles.colTitle}>About Us</div>
          <div>
            <b>📞 Phone:</b>
            <br />
            020 3322 9194
          </div>
          <div>
            <b>✉️ Email:</b>
            <br />
            <span className={styles.email}>hello@ottena.co.uk</span>
          </div>
          <div>
            <b>🕒 Working Days/Hours:</b>
            <br />
            Mon – Fri / 9:00AM – 5:00PM
          </div>
          <div>
            <b>📍 Address:</b>
            <br />
            Ottenna Teak Garden Furniture,
            <br />
            86-90 Paul Street,
            <br />
            London, EC2A 4NE
            <br />
            Company Registration: 09619561
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.colTitle}>Support</div>
          <a href="#">About us</a>
          <a href="#">Trade + Purchase Orders</a>
          <a href="#">Delivery</a>
          <a href="#">Returns</a>
          <a href="#">Care and Maintenance</a>
          <a href="#">Garden Furniture Assembly Guide</a>
          <a href="#">Eco & Sustainable Promises</a>
          <a href="#">Warranty</a>
          <a href="#">Frequently Asked Questions</a>
          <a href="#">Contact us</a>
          <a href="#">Sitemap</a>
        </div>
        <div className={styles.col}>
          <div className={styles.colTitle}>Shop Our Furniture</div>
          <a href="#">Garden Benches</a>
          <a href="#">Garden Furniture London</a>
          <a href="#">Garden Furniture South West</a>
          <a href="#">Garden Furniture South East</a>
          <a href="#">Garden Furniture North East</a>
          <a href="#">Garden Furniture North West</a>
          <a href="#">Garden Furniture Wales</a>
          <a href="#">Garden Furniture Essex</a>
          <a href="#">Teak Adirondack Chair</a>
          <a href="#">Teak Memorial Benches</a>
          <a href="#">Teak Patio Furniture</a>
        </div>
        <div className={styles.col}>
          <div className={styles.colTitle}>Shop Our Ranges</div>
          <a href="#">Teak Garden Benches</a>
          <a href="#">Patio Furniture Sets</a>
          <a href="#">Garden Table and Chairs</a>
          <a href="#">Garden Chairs</a>
          <a href="#">Garden Tables</a>
          <a href="#">Folding Garden Table and Chairs</a>
          <a href="#">Memorial Benches</a>
          <a href="#">Pub Garden Furniture</a>
          <a href="#">Garden Seats</a>
          <a href="#">Lutyens Bench</a>
          <a href="#">Gift Vouchers</a>
        </div>
      </div>
    </footer>
  );
}

