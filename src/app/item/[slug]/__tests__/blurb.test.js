import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Blurb from '../blurb';

describe('Blurb Component', () => {
  it('renders blurb text when provided', () => {
    const mockItem = {
      blurb: 'Test blurb text',
      dimensions: 'H 100cm x 70cm'
    };
    
    render(<Blurb item={mockItem} />);
    
    expect(screen.getByText('Test blurb text')).toBeInTheDocument();
  });

  it('renders dimensions when provided', () => {
    const mockItem = {
      blurb: 'Test blurb text',
      dimensions: 'H 100cm x 70cm'
    };
    
    render(<Blurb item={mockItem} />);
    
    expect(screen.getByText('H 100cm x 70cm')).toBeInTheDocument();
  });

  it('renders without dimensions when not provided', () => {
    const mockItem = {
      blurb: 'Test blurb text'
    };
    
    render(<Blurb item={mockItem} />);
    
    expect(screen.getByText('Test blurb text')).toBeInTheDocument();
    expect(screen.queryByText('H 100cm x 70cm')).not.toBeInTheDocument();
  });

  it('renders Dimensions heading', () => {
    const mockItem = {
      blurb: 'Test blurb text',
      dimensions: 'H 100cm x 70cm'
    };
    
    render(<Blurb item={mockItem} />);
    
    const dimensionsHeading = screen.getByRole('heading', { name: 'Dimensions' });
    expect(dimensionsHeading).toBeInTheDocument();
  });
}); 