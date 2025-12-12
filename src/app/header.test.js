import { render, screen } from '@testing-library/react';
import Header from './header';

describe('Header', () => {
  it('renders all header links with correct attributes', () => {
    render(<Header />);
    
    // Check for the Our Collection link
    const collectionLink = screen.getByRole('link', { name: /Our Collection/i });
    expect(collectionLink).toHaveAttribute('href', '/');
    
    // Check for the Contact Us link
    const contactLink = screen.getByRole('link', { name: /Contact Us/i });
    expect(contactLink).toHaveAttribute('href', '/contact');
    
    // Check for the About link
    const aboutLink = screen.getByRole('link', { name: /About/i });
    expect(aboutLink).toHaveAttribute('href', '/about');
  });
});
