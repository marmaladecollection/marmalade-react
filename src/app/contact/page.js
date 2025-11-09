import styles from './page.module.scss';

export default function ContactPage() {
  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <h1>Contact Us</h1>
        <p>
          We'd love to hear from you! Whether you want to discuss a specific piece, or just learn more about our collection, 
          we're here to help.
        </p>
        <p>
          You can reach us directly at{' '}
          <a href="mailto:team@marmaladecollection.com" className={styles.email}>
            team@marmaladecollection.com
          </a>
        </p>
 
      </div>
    </div>
  );
} 