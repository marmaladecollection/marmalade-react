import styles from './LoadingSpinner.module.scss';

export default function LoadingSpinner() {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.message}>Processing your payment...</p>
    </div>
  );
} 