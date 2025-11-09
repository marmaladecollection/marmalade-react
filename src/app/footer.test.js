import { render, screen } from '@testing-library/react';
import Footer from './footer';

describe('Footer', () => {
  it('renders all footer links with correct attributes', () => {
    render(<Footer />);
    
    // Check for the Free Delivery feature section
    const freeDeliveryLink = screen.getByRole('link', { name: /Free Local Delivery/i });
    expect(freeDeliveryLink).toHaveAttribute('href', '/delivery');
    
    // Check for the Returns feature section
    const returnsLink = screen.getByRole('link', { name: /Simple Returns/i });
    expect(returnsLink).toHaveAttribute('href', '/returns');
  });
});