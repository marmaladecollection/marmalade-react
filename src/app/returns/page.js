import styles from './page.module.scss';

export default function ReturnsPage() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1>Returns & Refunds</h1>
        <p>
          At Marmalade, we want you to be completely satisfied with your purchase. 
          We understand that sometimes items may need to be returned or exchanged. 
        </p>
        <p>
        Returns are accepted within 30 days of purchase.
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