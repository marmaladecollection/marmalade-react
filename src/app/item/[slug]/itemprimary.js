"use client";

import Images from "./images";
import ItemActions from "./itemactions";
import ItemHeadline from "./itemheadline";
import styles from "./itemprimary.module.scss";

export default function ItemPrimary({ item }) {

  return (
    <main className={styles.mainBit}>
      <Images item={item} />
      
      <div className={styles.actions}>
        <ItemHeadline item={item} />
        <span className={styles.returns}>Free UK Returns on all orders</span>
        <ItemActions item={item} />
        <span className={styles.productInfo}>Product Information</span>
      </div>
    </main>

  );
}
