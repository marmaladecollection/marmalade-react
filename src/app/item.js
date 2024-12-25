import styles from "./item.module.css";

export default function Item(item) {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h2>{item.name}</h2>
      </main>
    </div>
  );
}
