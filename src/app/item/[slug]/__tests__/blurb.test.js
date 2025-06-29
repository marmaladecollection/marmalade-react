import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Blurb from '../blurb';

describe('Blurb Component', () => {
  it('renders tooltip for a long George III tooltip blurb', () => {
    const mockItem = {
      blurb: 'A [George III=George III furniture (1760–1820) is known for its elegant, balanced design with straight lines and classical details. Made mostly from fine woods like mahogany, these pieces often feature delicate carvings, inlays, and refined shapes. It blends beauty and function, influenced by ancient Greek and Roman styles, and is often linked to famous designers like Chippendale and Hepplewhite] mahogany three-seat camel-back sofa. The swept show-wood frame is carved and channelled, with a bow-shaped front seat. Raised on four front legs with brass box castors.',
      dimensions: 'H 100cm x 70cm'
    };
    render(<Blurb item={mockItem} />);
    // The highlighted text should be present
    const highlighted = screen.getByText('George III');
    expect(highlighted).toBeInTheDocument();
    // The tooltip span should be present as a child
    const tooltip = highlighted.querySelector('span');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent('George III furniture (1760–1820) is known for its elegant, balanced design with straight lines and classical details. Made mostly from fine woods like mahogany, these pieces often feature delicate carvings, inlays, and refined shapes. It blends beauty and function, influenced by ancient Greek and Roman styles, and is often linked to famous designers like Chippendale and Hepplewhite');
    // The parent <p> should contain the correct text, but allow for element splits
    const paragraph = highlighted.closest('p');
    expect(paragraph).toBeInTheDocument();
    // Check that the paragraph contains all the expected text fragments
    expect(paragraph).toHaveTextContent('A');
    expect(paragraph).toHaveTextContent('George III');
    expect(paragraph).toHaveTextContent('mahogany three-seat camel-back sofa. The swept show-wood frame is carved and channelled, with a bow-shaped front seat. Raised on four front legs with brass box castors.');
  });
  it('renders blurb text when provided', () => {
    const mockItem = {
      blurb: 'Test blurb text',
      dimensions: 'H 100cm x 70cm'
    };
    render(<Blurb item={mockItem} />);
    expect(screen.getByText('Test blurb text')).toBeInTheDocument();
  });

  it('renders tooltip when blurb contains [text=tooltip]', () => {
    const mockItem = {
      blurb: 'This is a [highlighted=Tooltip description] example.',
      dimensions: 'H 100cm x 70cm'
    };
    render(<Blurb item={mockItem} />);
    // The highlighted text should be present
    const highlighted = screen.getByText('highlighted');
    expect(highlighted).toBeInTheDocument();
    // The tooltip span should be present as a child
    const tooltip = highlighted.querySelector('span');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent('Tooltip description');
    // The parent <p> should contain the correct text, but allow for element splits
    const paragraph = highlighted.closest('p');
    expect(paragraph).toBeInTheDocument();
    // Check that the paragraph contains all the expected text fragments
    expect(paragraph).toHaveTextContent('This is a');
    expect(paragraph).toHaveTextContent('highlighted');
    expect(paragraph).toHaveTextContent('example.');
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