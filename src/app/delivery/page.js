import styles from './page.module.scss';

export default function DeliveryPage() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1>Delivery Information</h1>
        <p>
          We aim to deliver your order within 5 working days.
        </p>
        <p>
          We deliver free to the following areas:
        </p>
        
        <div className={styles.deliveryAreas}>
          <h2>East Sussex</h2>
          <p>
            Brightling, Battle, Hastings, St Leonards, Bexhill, Rye, Heathfield, Mayfield, 
            Etchingham, Wadhurst, Crowborough, Uckfield, Lewes, Hailsham, Eastbourne
            (see postcodes below)
          </p>

          <h2>Kent</h2>
          <p>
            Ashford, Tenterden, Cranbrook, Hawkhurst, Tonbridge, Tunbridge Wells
            (see postcodes below)
          </p>
        </div>

        <p>
          Live outside these areas? Email us at{' '}
          <a href="mailto:team@marmaladecollection.com" className={styles.email}>
            team@marmaladecollection.com
          </a> and we may be able to arrange something for you.
        </p>

        <p class="small">
          TN21, TN20, BN7, BN10, BN9, BN25, BN26, BN20, BN22, BN21, BN24, BN23, BN27, TN35, TN38, TN40, TN37, TN34, TN35, TN31 6, TN32, TN18, TN15, TN5, TN17, TN3, TN6, TN1, TN2, TN4
        </p>
      </div>
    </main>
  );
} 