import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Thumbnail from './thumbnail';
import { act } from 'react';

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, style, priority, loading, onLoad }) {
    // Simulate onLoad immediately for testing
    if (onLoad) setTimeout(onLoad, 0);
    return <img src={src} alt={alt} style={style} data-priority={priority} data-loading={loading} />;
  };
});

describe('Thumbnail', () => {
  const mockItem = {
    id: 'test-item',
    name: 'Test Item'
  };

  const originalImage = window.Image;

  beforeAll(() => {
    // Mock window.Image to simulate image probing
    window.Image = class {
      constructor() {
        this.onload = null;
        this.onerror = null;
        this.src = '';
      }
      set src(val) {
        // Simulate success for item-1 and item-2, fail for others
        // Use regex or exact match to avoid "test-item-1" matching "test-item-10"
        if (val.includes('test-item-1.webp') || val.includes('test-item-2.webp')) {
          setTimeout(() => this.onload && this.onload(), 10);
        } else if (val.includes('test-item-')) {
          setTimeout(() => this.onerror && this.onerror(), 10);
        }
      }
    };
  });

  afterAll(() => {
    window.Image = originalImage;
  });

  it('renders the main image immediately', () => {
    render(<Thumbnail item={mockItem} />);
    const img = screen.getByAltText('Test Item');
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('test-item.webp');
  });

  it('discovers and renders secondary images hidden in the DOM', async () => {
    render(<Thumbnail item={mockItem} allowCycling={true} />);

    // Wait for discovery
    await waitFor(() => {
      const images = screen.getAllByAltText('Test Item');
      // Should have main + 2 discovered images = 3 total
      expect(images).toHaveLength(3);
    });

    const images = screen.getAllByAltText('Test Item');
    
    // First image should be visible
    expect(images[0]).toBeVisible();
    expect(images[0].parentElement).toHaveStyle({ display: 'block' });

    // Others should be hidden but present
    expect(images[1].parentElement).toHaveStyle({ display: 'none' });
    expect(images[2].parentElement).toHaveStyle({ display: 'none' });
  });

  it('switches visibility instantly on next click', async () => {
    render(<Thumbnail item={mockItem} allowCycling={true} />);

    // Wait for images to load
    await waitFor(() => {
      expect(screen.getAllByAltText('Test Item')).toHaveLength(3);
    });

    const nextBtn = screen.getByLabelText('Next image');
    
    // Click next
    fireEvent.click(nextBtn);

    const images = screen.getAllByAltText('Test Item');
    
    // Index 0 should now be hidden
    expect(images[0].parentElement).toHaveStyle({ display: 'none' });
    
    // Index 1 (test-item-1) should be visible
    expect(images[1].parentElement).toHaveStyle({ display: 'block' });
    expect(images[1].src).toContain('test-item-1.webp');
  });
});

