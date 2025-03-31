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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to home page when Continue Shopping button is clicked', () => {
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
    render(
      <MarmaladeProvider>
        <BasketPage />
      </MarmaladeProvider>
    );
    
    expect(screen.getByText('Your bag is currently empty')).toBeInTheDocument();
  });
}); 