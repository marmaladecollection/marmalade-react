import styles from './page.module.scss';

export default function DeliveryPage() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1>Delivery Information</h1>
        <p>
          We deliver to the following areas:
        </p>
        
        <div className={styles.deliveryAreas}>
          <h2>East Sussex</h2>
          <p>
            Brightling, Battle, Hastings, St Leonards, Bexhill, Rye, Heathfield, Mayfield, 
            Etchingham, Wadhurst, Crowborough, Uckfield, Lewes, Hailsham, Eastbourne
          </p>

          <h2>Kent</h2>
          <p>
            Ashford, Tenterden, Cranbrook, Hawkhurst, Tonbridge, Tunbridge Wells
          </p>
        </div>

        <p>
          Live outside these areas? Email us at{' '}
          <a href="mailto:team@marmaladecollection.com" className={styles.email}>
            team@marmaladecollection.com
          </a> and we may be able to arrange something for you.
        </p>

        <h2>Delivery Charges</h2>
        <p>
          Standard Delivery: £20<br />
          Free delivery on orders over £150
        </p>
      </div>
    </main>
  );
} 