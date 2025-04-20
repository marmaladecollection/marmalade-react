import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import BasketPage from './page';
import { useRouter } from 'next/navigation';
import { useMarmaladeContext } from '../context/MarmaladeContext';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock the MarmaladeContext
jest.mock('../context/MarmaladeContext', () => ({
  useMarmaladeContext: jest.fn()
}));

describe('BasketPage', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty basket message when no items', () => {
    jest.requireMock('../context/MarmaladeContext').useMarmaladeContext.mockReturnValue({
      basketIds: [],
      basketItems: [],
      removeFromBasket: jest.fn()
    });

    const { getByText } = render(<BasketPage />);
    expect(getByText('Your bag is currently empty')).toBeInTheDocument();
  });

  it('should render items in basket', () => {
    const mockItems = [
      { id: '1', name: 'Item 1', price: 10 },
      { id: '2', name: 'Item 2', price: 20 }
    ];

    jest.requireMock('../context/MarmaladeContext').useMarmaladeContext.mockReturnValue({
      basketIds: ['1', '2'],
      basketItems: mockItems,
      removeFromBasket: jest.fn()
    });

    const { getByText } = render(<BasketPage />);
    mockItems.forEach(item => {
      expect(getByText(item.name)).toBeInTheDocument();
      expect(getByText(`£${item.price}`)).toBeInTheDocument();
    });
  });

  it('should navigate to checkout when Go To Checkout is clicked', () => {
    const mockPush = jest.fn();
    useRouter.mockReturnValue({
      push: mockPush
    });

    jest.requireMock('../context/MarmaladeContext').useMarmaladeContext.mockReturnValue({
      basketIds: ['1'],
      basketItems: [{ id: '1', name: 'Item 1', price: 10 }],
      removeFromBasket: jest.fn()
    });

    const { getByText } = render(<BasketPage />);
    fireEvent.click(getByText('Go To Checkout'));
    expect(mockPush).toHaveBeenCalledWith('/checkout');
  });

  it('should remove item when remove button is clicked', () => {
    const mockRemoveFromBasket = jest.fn();
    jest.requireMock('../context/MarmaladeContext').useMarmaladeContext.mockReturnValue({
      basketIds: ['1'],
      basketItems: [{ id: '1', name: 'Item 1', price: 10 }],
      removeFromBasket: mockRemoveFromBasket
    });

    const { getByText } = render(<BasketPage />);
    fireEvent.click(getByText('Remove'));
    expect(mockRemoveFromBasket).toHaveBeenCalledWith('1');
  });
}); 