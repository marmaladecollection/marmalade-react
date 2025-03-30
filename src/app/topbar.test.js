import { fireEvent, render, screen, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { MarmaladeProvider } from './context/MarmaladeContext';
import TopBar from './topbar';

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

describe('TopBar', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('redirects to the root when clicking the MARMALADE logo', () => {
    render(<TopBar />, { wrapper: TestWrapper });

    const logo = screen.getByTestId('marmalade-logo');
    fireEvent.click(logo);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('displays the correct number of items in the bag', () => {
    // Render with initial basket items
    render(<TopBar />, { 
      wrapper: ({ children }) => (
        <TestWrapper initialBasketIds={['item1', 'item2', 'item3']}>
          {children}
        </TestWrapper>
      )
    });

    // The bag should show 3 items
    expect(screen.getByTestId('bag-count')).toHaveTextContent('BAG (3)');
  });
});
