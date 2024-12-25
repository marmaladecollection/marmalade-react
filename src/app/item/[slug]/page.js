import styles from "./page.module.css";

export default function ItemPage({params}) {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>MARAMALADE ITEM PAGE</h1>
        <h2>Chair {params.slug}</h2>
      </main>
    </div>
  );
}
