import Image from 'next/image';
import styles from './page.module.scss';

export default function AboutPage() {
  return (
    <div className={styles.main}>
      
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <h1>About Marmalade</h1>
          <p className={styles.text}>
          Marmalade is a curated collection of antique furniture for sale that offers a range of small pieces to fit any home. Each piece is hand-selected for its beauty and craftsmanship as well as its practicality as a working item of furniture.
          <br /><br />
          At Marmalade, we provide an accessible way to buy an antique desk, dining table or sofa at the same cost as purchasing new. As a small, carefully assembled collection, we offer a distinctive and more personal alternative to online warehouses and overwhelming auctions.
          <br /><br />
          Our guiding belief at Marmalade is that buying antique furniture is a both practical and sustainable choice, and one that should not be daunting. When you buy a good piece of furniture that has already endured for a century or more, you know not only that it will last but also that you are preserving the past.
          </p>
        </div>
      </div>

    </div>
  );
} 