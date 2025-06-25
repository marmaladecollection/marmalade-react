import styles from './page.module.scss';

export default function ReturnsPage() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1>Returns & Refunds</h1>
        <p>
          At Marmalade, we want you to be completely happy with your item. 
          We understand that sometimes items may need to be returned. 
        </p>
        <p>
          We can arrange collection of your item for you.
        </p>
        <p>
          Returns are accepted within 20 days of delivery.
        </p>

          <h2>Questions?</h2>
          <p>
            If you have any questions about returns, please contact us at{' '}
            <a href="mailto:team@marmaladecollection.com" className={styles.email}>
              team@marmaladecollection.com
            </a>
          </p>
      </div>
    </main>
  );
} 