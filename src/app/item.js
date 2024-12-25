"use client";
import styles from "./item.module.css";
import Link from "next/link";

export default function Item({item}) {

  return (
    <div className={styles.page}>
      <main className={styles.main}>

        <Link href={`/item/${item.id}`}>{item.name}</Link>

      </main>
    </div>
  );
}
