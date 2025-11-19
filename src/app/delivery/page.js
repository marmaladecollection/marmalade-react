import styles from './page.module.scss';

export default function DeliveryPage() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1>Delivery Options</h1>
        
        <p>
          We aim to deliver your order within 5 working days.
        </p>
        
        <div className={styles.deliveryOption}>
          <h2>Local & Regional Delivery – £80</h2>
          <p>Covering Kent, East Sussex, and Central & South London.</p>
        </div>

        <div className={styles.deliveryOption}>
          <h2>Further Afield</h2>
          <p>
            If you are outside these areas, please get in touch and we will be happy to provide a delivery quote. Email us at{' '}
            <a href="mailto:team@marmaladecollection.com" className={styles.email}>
              team@marmaladecollection.com
            </a>.
          </p>
        </div>
      </div>
    </main>
  );
} 