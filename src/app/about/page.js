import Image from 'next/image';
import styles from './page.module.scss';

export default function AboutPage() {
  return (
    <div className={styles.main}>
      
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <h1>About Us</h1>
          <p className={styles.text}>
          Marmalade is a curated collection of antique furniture for sale. We offer a range of small pieces to fit any home. Each piece is hand-selected for its beauty and craftsmanship, as well as its practicality as a working item of furniture.
          <br /><br />
          Marmalade provides an accessible way to buy an antique desk, dining table or sofa at the same cost as purchasing new. We offer a personal alternative to vast online warehouses and overwhelming auctions.
          <br /><br />
          Buying antique furniture is a great, sustainable choice! When you buy a piece of furniture that has already endured for a century or more, you know not only that it will last but also that you are preserving the past.
          </p>
        </div>
      </div>

    </div>
  );
} 