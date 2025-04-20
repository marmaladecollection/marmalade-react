import styles from './page.module.scss';

export default function DeliveryPage() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1>Delivery Information</h1>
        <p>
          We currently deliver to the following areas:
        </p>
        <p>
          <strong>East Sussex:</strong> Hastings, St Leonards, Bexhill, Battle, Rye, and surrounding areas<br />
          <strong>Kent:</strong> Ashford, Tenterden, and surrounding areas
        </p>

        <h2>Delivery Charges</h2>
        <p>
          Standard Delivery: £10.00<br />
          Free delivery on orders over £50
        </p>

        <h2>Need Help?</h2>
        <p>
          If you have any questions about your delivery, please don't hesitate to contact us at{' '}
          <a href="mailto:team@marmaladecollection.com" className={styles.email}>
            team@marmaladecollection.com
          </a>
        </p>
      </div>
    </main>
  );
} 