"use client";
import Link from "next/link";
import styles from "./item.module.css";
import Thumbnail from "./thumbnail";

export default function Item({ item }) {
  return (
    <div key={item.id} className={styles.page}>
      <main>
        <Link href={`/item/${item.id}`} className={styles.main}>
          <Thumbnail item={item} />
         {item.name}
        </Link>
      </main>
    </div>
  );
}

