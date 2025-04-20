import { render } from '@testing-library/react';
import { MarmaladeProvider } from './context/MarmaladeContext';

export const renderWithMarmalade = (ui, { initialBasketIds = [] } = {}) => {
  // Set initial state in localStorage if provided
  if (initialBasketIds.length > 0) {
    localStorage.setItem('BasketIds', JSON.stringify(initialBasketIds));
  }

  const result = render(
    <MarmaladeProvider>
      {ui}
    </MarmaladeProvider>
  );

  return result;
}; 