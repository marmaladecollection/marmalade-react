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

  it('renders multiple paragraphs when blurb contains double newlines', () => {
    const mockItem = {
      blurb: 'First paragraph with some text.\n\nSecond paragraph with more information.\n\nThird paragraph with final details.',
      dimensions: 'H 100cm x 70cm'
    };
    
    render(<Blurb item={mockItem} />);
    
    // Should create three separate paragraphs
    const paragraphs = screen.getAllByText((content, element) => {
      return element?.tagName === 'P' && content.length > 0;
    });
    
    expect(paragraphs).toHaveLength(3);
    expect(paragraphs[0]).toHaveTextContent('First paragraph with some text.');
    expect(paragraphs[1]).toHaveTextContent('Second paragraph with more information.');
    expect(paragraphs[2]).toHaveTextContent('Third paragraph with final details.');
  });

  it('renders multiple paragraphs with tooltips preserved', () => {
    const mockItem = {
      blurb: 'First paragraph with [George III=Historical info] reference.\n\nSecond paragraph with [mahogany=Wood description] details.',
      dimensions: 'H 100cm x 70cm'
    };
    
    render(<Blurb item={mockItem} />);
    
    // Should have two paragraphs
    const paragraphs = screen.getAllByText((content, element) => {
      return element?.tagName === 'P' && content.length > 0;
    });
    expect(paragraphs).toHaveLength(2);
    
    // Tooltips should still work in each paragraph
    const georgeTooltip = screen.getByText('George III');
    expect(georgeTooltip).toBeInTheDocument();
    expect(georgeTooltip.querySelector('span')).toHaveTextContent('Historical info');
    
    const mahoganyTooltip = screen.getByText('mahogany');
    expect(mahoganyTooltip).toBeInTheDocument();
    expect(mahoganyTooltip.querySelector('span')).toHaveTextContent('Wood description');
  });

  it('handles single newlines as regular text without creating paragraph breaks', () => {
    const mockItem = {
      blurb: 'Single line break\nshould not create new paragraph.',
      dimensions: 'H 100cm x 70cm'
    };
    
    render(<Blurb item={mockItem} />);
    
    // Should only have one paragraph since we only use single newline
    const paragraphs = screen.getAllByText((content, element) => {
      return element?.tagName === 'P' && content.length > 0;
    });
    
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0]).toHaveTextContent('Single line break should not create new paragraph.');
  });

  it('trims whitespace from paragraphs', () => {
    const mockItem = {
      blurb: '  First paragraph with leading/trailing spaces  \n\n  Second paragraph also with spaces  ',
      dimensions: 'H 100cm x 70cm'
    };
    
    render(<Blurb item={mockItem} />);
    
    const paragraphs = screen.getAllByText((content, element) => {
      return element?.tagName === 'P' && content.length > 0;
    });
    
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]).toHaveTextContent('First paragraph with leading/trailing spaces');
    expect(paragraphs[1]).toHaveTextContent('Second paragraph also with spaces');
  });
}); 