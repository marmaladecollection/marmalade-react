import Image from 'next/image';
import styles from './page.module.scss';

export default function AboutPage() {
  return (
    <div className={styles.main}>
      
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <h1>About Us</h1>
          <p className={styles.text}>
            At Marmalade, we deal in character, craftsmanship, and quality. Specialising in modern and classic antiques, we source distinctive pieces that stand the test of time—both in design and durability.
            <br /><br />
            We value considered buying over throwaway trends. By restoring and rehoming well-made items, we offer an alternative to mass-produced furniture while reducing unnecessary waste. Our focus is on timeless style, practical sustainability, and pieces built to last.

          </p>
        </div>
      </div>

    </div>
  );
} 