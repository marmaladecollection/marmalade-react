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
            Battle, Bexhill, Brightling, Burwash, Crowborough, Eastbourne, Etchingham, Hailsham, 
            Hastings, Heathfield, Lewes, Mayfield, Newhaven, Peacehaven, St Leonards, Ticehurst, Wadhurst
            (see postcodes below)
          </p>

          <h2>Kent</h2>
          <p>
            Cranbrook, Hawkhurst, Tunbridge Wells
            (see postcodes below)
          </p>
        </div>

        <p>
          Live outside these areas? Email us at{' '}
          <a href="mailto:team@marmaladecollection.com" className={styles.email}>
            team@marmaladecollection.com
          </a> and we may be able to arrange something for you.
        </p>

        <div className={styles.postcodesSection}>
          <h3>Free delivery postcodes</h3>
          <p className={styles.postcodes}>
            BN7, BN8, BN9, BN10, BN20, BN21, BN22, BN23, BN24, BN25, BN26, BN27, TN1, TN2, TN3, TN4, TN5, TN6, TN17, TN18, TN19, TN20, TN21, TN31 6, TN32, TN33, TN34, TN35, TN37, TN38, TN39, TN40
          </p>
        </div>
      </div>
    </main>
  );
} 