"use client";

import { useRouter } from 'next/navigation'; // Import Next.js router for client components
import styles from './topbar.module.scss';

export default function TopBar() {
  const router = useRouter(); // Initialize the router

  const handleLogoClick = () => {
    router.push('/'); // Redirect to the root of the website
  };

  return (
    <div id={styles.topBar}>
      <div>MENU</div>
      <div
        id={styles.logo}
        onClick={handleLogoClick} // Attach click handler to the logo
        data-testid="marmalade-logo" // Add a test ID for testing
      >
        MARMALADE
      </div>
      <div>BAG (0)</div>
    </div>
  );
}
