import { render, screen } from '@testing-library/react';
import Header from './header';

describe('Header', () => {
  it('renders all header links with correct attributes', () => {
    render(<Header />);
    
    // Check for the Contact Us link
    const contactLink = screen.getByRole('link', { name: /Contact Us/i });
    expect(contactLink).toHaveAttribute('href', '/contact');
    
    // Check for the About Us link
    const aboutLink = screen.getByRole('link', { name: /About Us/i });
    expect(aboutLink).toHaveAttribute('href', '/about');
  });
});
