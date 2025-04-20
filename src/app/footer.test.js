import { render, screen } from '@testing-library/react';
import Footer from './footer';

describe('Footer', () => {
  it('renders all footer links with correct attributes', () => {
    render(<Footer />);
    
    // Check that all links are present and have correct attributes
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(5);
    
    // Verify each link has the correct text and href
    const expectedLinks = [
      { text: 'Help', href: '/help' },
      { text: 'Delivery', href: '/delivery' },
      { text: 'Returns', href: '/returns' },
      { text: 'Contact Us', href: '/contact' },
      { text: 'About Us', href: '/about' }
    ];
    
    expectedLinks.forEach(({ text, href }) => {
      const link = screen.getByText(text);
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', href);
    });
  });
}); 