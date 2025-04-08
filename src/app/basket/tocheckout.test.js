import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ToCheckout from './tocheckout';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ToCheckout', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to checkout page when Go To Checkout button is clicked', () => {
    render(<ToCheckout />);
    
    const checkoutButton = screen.getByText('Go To Checkout');
    fireEvent.click(checkoutButton);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/checkout');
  });

  it('should render payment method text and icons', () => {
    render(<ToCheckout />);
    
    expect(screen.getByText('We accept the payment methods')).toBeInTheDocument();
    expect(screen.getByAltText('Visa')).toBeInTheDocument();
    expect(screen.getByAltText('Mastercard')).toBeInTheDocument();
    expect(screen.getByAltText('PayPal')).toBeInTheDocument();
    expect(screen.getByAltText('Apple Pay')).toBeInTheDocument();
  });
}); 