"use client";
import Link from "next/link";
import styles from "./item.module.scss";
import { default as Thumbnail, default as UnderThumbnail } from "./thumbnail";

export default function Item({ item }) {
  return (
    <div key={item.id} className={styles.page}>
      <main>
        <Link href={`/item/${item.id}`} className={styles.main}>
          <Thumbnail item={item} />
          <UnderThumbnail item={item} />
        </Link>
      </main>
    </div>
  );
}

