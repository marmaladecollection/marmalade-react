"use client";

import styles from './topbar.module.scss';

export default function TopBar() {
  return (
    <div id={styles.topBar}>
      <div id={styles.menu}>MENU</div>
      <div id={styles.logo}>MARMALADE</div>
      <div id={styles.basket}>BAG (0)</div>
   </div>
  );
}

