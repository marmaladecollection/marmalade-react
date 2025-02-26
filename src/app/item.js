"use client";
import Link from "next/link";
import styles from "./item.module.scss";
import Thumbnail from "./thumbnail";
import UnderThumbnail from "./underthumbnail";

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

