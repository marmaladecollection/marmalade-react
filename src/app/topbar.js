"use client";

import styles from './topbar.module.scss';

export default function TopBar() {
  return (
    <div id={styles.topBar}>
      <div>MENU</div>
      <div id={styles.logo}>MARMALADE</div>
      <div>BAG (0)</div>
   </div>
  );
}

