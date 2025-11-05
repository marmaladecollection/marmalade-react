import Image from 'next/image';
import styles from './page.module.scss';

export default function AboutPage() {
  return (
    <div className={styles.main}>
      
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <h1>About Us</h1>
          <p className={styles.text}>
          Marmalade is a curated collection of antique furniture for sale.  We offer a range of small pieces that will transform any home with the beauty and solidity that only enduring pieces of beautifully made furniture can. 
          <br /><br />
          At Marmalade, we provide an accessible way to buy an antique desk, dining table or sofa at the same cost as purchasing new.  We offer a fuss-free alternative to modern (and probably flat pack) furniture that will likely neither endure nor bring beauty and history to a home.  
          <br /><br />
          Buying antique furniture is a sustainable choice as well as an aesthetic one.  When you buy a piece of furniture that has already endured for a century or more, you know not only that it will last but also that you are preserving the past rather than adding to a cycle of production and waste.    
          <br /><br />
          As a small, carefully curated collection, Marmalade offers a personal alternative to vast online warehouses and overwhelming auctions. Each piece is hand-selected for its beauty, craftsmanship, and history, as well as its practicality as a working item of furniture.
          </p>
        </div>
      </div>

    </div>
  );
} 