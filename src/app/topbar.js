"use client";

import { useRouter } from 'next/navigation'; // Import Next.js router for client components
import { useMarmaladeContext } from './context/MarmaladeContext';
import styles from './topbar.module.scss';

export default function TopBar() {
  const router = useRouter(); // Initialize the router
  const { basketIds } = useMarmaladeContext();

  const handleLogoClick = () => {
    router.push('/'); // Redirect to the root of the website
  };

  const handleBagClick = () => {
    router.push('/basket');
  };

  return (
    <div id={styles.topBar}>
      
      <div
        id={styles.logo}
        onClick={handleLogoClick} // Attach click handler to the logo
        data-testid="marmalade-logo" // Add a test ID for testing
      >
        MARMALADE
      </div>
 
      <div 
        id={styles.bagCount}
        onClick={handleBagClick}
        data-testid="bag-count"
      >
        BAG ({basketIds.length})
      </div>
    </div>
  );
}
