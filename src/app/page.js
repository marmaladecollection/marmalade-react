"use client";
import Item from "./item";
import styles from "./page.module.css";

const items = [
  { id: 1, name: "Chair" },
  { id: 2, name: "Table" },
  { id: 3, name: "Lamp" }
];

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
       <h1>MARAMALADE GALLERY PAGE</h1>
        <ul>
          {items.map((item) => (
            <li key={item.name}>
              <Item item={item} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
