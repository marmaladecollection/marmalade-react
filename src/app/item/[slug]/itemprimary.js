"use client";

import Images from './images';
import ItemActions from './itemactions';
import ItemHeadline from './itemheadline';
import styles from './itemprimary.module.scss';
import Blurb from './blurb';

export default function ItemPrimary({ item }) {
  return (
    <main className={styles.mainBit}>
      <div className={styles.left}>
        <Images item={item} />
      </div>
      
      <div className={styles.actions}>
        <ItemHeadline item={item} />
        <Blurb item={item} />
        <ItemActions item={item} />
      </div>
    </main>
  );
}
