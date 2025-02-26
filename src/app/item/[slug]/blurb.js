"use client";

import styles from "./blurb.module.scss";

export default function Blurb({ item }) {
  return (
    <div className={styles.productBlurb}>
      <p>
        Incredibly soft sheepskin hot water bottle cover. The sheepskins are specially sorted and selected,
        then cut by hand in Somerset. Each piece is unique, with variation in texture and colour.
      </p>
      <p>
        The open top design allows for easy filling. To fit a standard sized hot water bottle, which is
        approximately 33cm x 20cm and often 1.7L capacity.
      </p>
      <div className={styles.details}>
        <h4>Details</h4>
        H 100cm x 70cm
      </div>
    </div>

  );
}
