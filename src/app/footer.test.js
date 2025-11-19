import { render, screen } from '@testing-library/react';
import Footer from './footer';

describe('Footer', () => {
  it('renders all footer links with correct attributes', () => {
    render(<Footer />);
    
    // Check for the Delivery feature section
    const deliveryLink = screen.getByRole('link', { name: /Fast Delivery/i });
    expect(deliveryLink).toHaveAttribute('href', '/delivery');
    
    // Check for the Returns feature section
    const returnsLink = screen.getByRole('link', { name: /Simple Returns/i });
    expect(returnsLink).toHaveAttribute('href', '/returns');
  });
});