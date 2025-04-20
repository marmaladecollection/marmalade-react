"use client";

import { useRouter } from 'next/navigation'; // Import Next.js router for client components
import { useMarmaladeContext } from './context/MarmaladeContext';
import styles from './topbar.module.scss';

export default function TopBar() {
  const router = useRouter(); // Initialize the router
  const { basketIds } = useMarmaladeContext();

  const handleLogoClick = () => {
    console.log('Logo clicked, navigating to home');
    router.push('/'); // Redirect to the root of the website
  };

  const handleBagClick = (e) => {
    e.stopPropagation(); // Prevent the event from bubbling up
    console.log('Bag clicked, current basketIds:', basketIds);
    console.log('Attempting to navigate to /basket');
    try {
      router.push('/basket');
    } catch (error) {
      console.error('Error navigating to basket:', error);
      console.error('Error stack:', error.stack);
    }
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
