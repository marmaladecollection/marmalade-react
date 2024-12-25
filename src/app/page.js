import Item from "./item";
import styles from "./page.module.css";

const items = [{ name: "Chair" }, { name: "Table" }, { name: "Lamp" }];

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
       <h1>MARAMALADE GALLERY PAGE</h1>
        <ul>
          {items.map((item) => (
            <li key={item.name}>
              <Item name={item.name} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
