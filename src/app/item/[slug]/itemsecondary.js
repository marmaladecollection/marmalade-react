"use client";

import Blurb from "./blurb";
import Delivery from "./delivery";
import styles from "./itemsecondary.module.scss";

export default function ItemSecondary({ item }) {

  return (
    <div className={styles.secondaryBit}>
      <Delivery item={item} />
    </div>

  );
}
