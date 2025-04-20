import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import BasketPage from './page';
import { MarmaladeProvider } from '../context/MarmaladeContext';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the MarmaladeContext
jest.mock('../context/MarmaladeContext', () => ({
  ...jest.requireActual('../context/MarmaladeContext'),
  useMarmaladeContext: () => ({
    basketIds: [],
    basketItems: [],
    addToBasket: jest.fn(),
    removeFromBasket: jest.fn(),
  }),
}));

describe('BasketPage', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    // Reset the MarmaladeContext mock before each test
    jest.spyOn(require('../context/MarmaladeContext'), 'useMarmaladeContext').mockImplementation(() => ({
      basketIds: [],
      basketItems: [],
      addToBasket: jest.fn(),
      removeFromBasket: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to home page when Continue Shopping button is clicked in empty state', () => {
    render(
      <MarmaladeProvider>
        <BasketPage />
      </MarmaladeProvider>
    );
    
    const continueButton = screen.getByText('Continue Shopping');
    fireEvent.click(continueButton);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('should navigate to home page when Continue Shopping button is clicked in populated state', () => {
    // Override the mock to include items
    jest.spyOn(require('../context/MarmaladeContext'), 'useMarmaladeContext').mockImplementation(() => ({
      basketIds: ['item1'],
      basketItems: [{ id: 'item1', name: 'Test Item 1', price: 100 }],
      addToBasket: jest.fn(),
      removeFromBasket: jest.fn(),
    }));

    render(
      <MarmaladeProvider>
        <BasketPage />
      </MarmaladeProvider>
    );
    
    const continueButton = screen.getByText('Continue Shopping');
    fireEvent.click(continueButton);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('should display empty basket message when there are no items', () => {
    // Ensure the mock is set to empty basket
    jest.spyOn(require('../context/MarmaladeContext'), 'useMarmaladeContext').mockImplementation(() => ({
      basketIds: [],
      basketItems: [],
      addToBasket: jest.fn(),
      removeFromBasket: jest.fn(),
    }));

    render(
      <MarmaladeProvider>
        <BasketPage />
      </MarmaladeProvider>
    );
    
    expect(screen.getByText('Your bag is currently empty')).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });

  it('should display basket items when there are items in the basket', () => {
    // Override the mock to include items
    jest.spyOn(require('../context/MarmaladeContext'), 'useMarmaladeContext').mockImplementation(() => ({
      basketIds: ['item1', 'item2'],
      basketItems: [
        { id: 'item1', name: 'Test Item 1', price: 100 },
        { id: 'item2', name: 'Test Item 2', price: 200 }
      ],
      addToBasket: jest.fn(),
      removeFromBasket: jest.fn(),
    }));

    render(
      <MarmaladeProvider>
        <BasketPage />
      </MarmaladeProvider>
    );
    
    expect(screen.queryByText('Your bag is currently empty')).not.toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
  });
}); 