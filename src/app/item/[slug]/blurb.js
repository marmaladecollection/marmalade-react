"use client";

import styles from "./blurb.module.scss";

export default function Blurb({ item }) {
  return (
    <div className={styles.productBlurb}>
      <p>
        {item.blurb}
      </p>
      <div className={styles.details}>
        <h4>Details</h4>
        H 100cm x 70cm
      </div>
    </div>

  );
}
