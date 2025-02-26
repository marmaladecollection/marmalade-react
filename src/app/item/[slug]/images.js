"use client";

import Thumbnail from "@/app/thumbnail";
import styles from "./images.module.scss";

export default function Images({ item }) {

  return (
      <div className={styles.images}>
        <Thumbnail item={item} />
      </div>

  );
}
