"use client";
import styles from "./item.module.css";

export default function Item({item}) {
  const goToItem = () => {
      console.log("Go to item " + item.id);
      // window.location.href = `/item/${item.id}`;
  };
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h2 key={item.id}>{item.name}
          <button onClick={goToItem}>View</button>
        </h2>
      </main>
    </div>
  );
}
