import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import UnderThumbnail from './underthumbnail';
import { MarmaladeProvider } from './context/MarmaladeContext';

// Mock Next.js's useRouter
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Create a wrapper component that provides the context with initial state
const TestWrapper = ({ children, initialBasketIds = [] }) => {
  // Set initial state in localStorage
  if (initialBasketIds.length > 0) {
    localStorage.setItem('BasketIds', JSON.stringify(initialBasketIds));
  }
  return (
    <MarmaladeProvider>
      {children}
    </MarmaladeProvider>
  );
};

describe('UnderThumbnail', () => {
  const mockItem = {
    id: 'test-item-1',
    name: 'Test Item',
    price: 100
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('adds item to basket and redirects to basket page when ADD button is clicked', () => {
    render(<UnderThumbnail item={mockItem} />, { wrapper: TestWrapper });

    const addButton = screen.getByText('ADD');
    fireEvent.click(addButton);

    // Check that the item was added to localStorage
    const basketIds = JSON.parse(localStorage.getItem('BasketIds') || '[]');
    expect(basketIds).toContain(mockItem.id);

    // Check that we were redirected to the basket page
    expect(mockPush).toHaveBeenCalledWith('/basket');
  });

  it('displays item name and price correctly', () => {
    render(<UnderThumbnail item={mockItem} />, { wrapper: TestWrapper });

    expect(screen.getByText(mockItem.name)).toBeInTheDocument();
    expect(screen.getByText(`£${mockItem.price}`)).toBeInTheDocument();
  });
}); 