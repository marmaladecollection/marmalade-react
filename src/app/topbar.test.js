// External dependencies
import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { act } from 'react-dom/test-utils';

// Internal dependencies
import { MarmaladeProvider } from './context/MarmaladeContext';
import TopBar from './topbar';
import { renderWithMarmalade } from './test-utils';
import { useMarmaladeContext } from './context/MarmaladeContext';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock the MarmaladeContext
jest.mock('./context/MarmaladeContext', () => ({
  useMarmaladeContext: jest.fn()
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
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the logo', () => {
    jest.requireMock('./context/MarmaladeContext').useMarmaladeContext.mockReturnValue({
      basketIds: []
    });

    const { getByTestId } = render(<TopBar />);
    expect(getByTestId('marmalade-logo')).toBeInTheDocument();
  });

  it('navigates to home when logo is clicked', () => {
    const mockPush = jest.fn();
    useRouter.mockReturnValue({
      push: mockPush
    });

    jest.requireMock('./context/MarmaladeContext').useMarmaladeContext.mockReturnValue({
      basketIds: []
    });

    const { getByTestId } = render(<TopBar />);
    fireEvent.click(getByTestId('marmalade-logo'));
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('navigates to basket when bag count is clicked', () => {
    const mockPush = jest.fn();
    useRouter.mockReturnValue({
      push: mockPush
    });

    jest.requireMock('./context/MarmaladeContext').useMarmaladeContext.mockReturnValue({
      basketIds: []
    });

    const { getByTestId } = render(<TopBar />);
    fireEvent.click(getByTestId('bag-count'));
    expect(mockPush).toHaveBeenCalledWith('/basket');
  });

  it('displays the correct number of items in the bag', () => {
    jest.requireMock('./context/MarmaladeContext').useMarmaladeContext.mockReturnValue({
      basketIds: ['item1', 'item2', 'item3']
    });

    const { getByTestId } = render(<TopBar />);
    expect(getByTestId('bag-count')).toHaveTextContent('BAG (3)');
  });

  it('redirects to the basket page when clicking the BAG label', () => {
    const mockPush = jest.fn();
    useRouter.mockReturnValue({
      push: mockPush
    });

    jest.requireMock('./context/MarmaladeContext').useMarmaladeContext.mockReturnValue({
      basketIds: []
    });

    const { getByTestId } = render(<TopBar />);
    fireEvent.click(getByTestId('bag-count'));
    expect(mockPush).toHaveBeenCalledWith('/basket');
  });
});
