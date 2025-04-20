import Image from 'next/image';
import styles from './page.module.scss';

export default function AboutPage() {
  return (
    <div className={styles.main}>
      
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <Image
            src="/images/peter.jpg"
            alt="Peter"
            width={500}
            height={500}
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div className={styles.textContainer}>
          <h1>About Us</h1>
          <p className={styles.text}>
            At our workshop, we breathe new life into cherished furniture pieces with a deep respect for their history and craftsmanship. Our team of skilled artisans combines traditional restoration techniques with modern expertise to preserve the unique character of each piece while ensuring it meets contemporary standards of quality and durability. We believe in sustainable restoration practices that honor the original materials and craftsmanship, ensuring that beautiful furniture can be enjoyed for generations to come. Every piece that comes through our doors tells a story, and we're committed to preserving that story while giving it a new chapter of life.
          </p>
        </div>
      </div>

    </div>
  );
} 