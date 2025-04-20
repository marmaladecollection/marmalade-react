import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import { useRouter } from 'next/navigation';
import UnderThumbnail from './underthumbnail';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the MarmaladeContext
jest.mock('./context/MarmaladeContext', () => ({
  useMarmaladeContext: jest.fn()
}));

describe('UnderThumbnail', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockItem = {
    id: '1',
    name: 'Test Item',
    price: 10
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render item details', () => {
    jest.requireMock('./context/MarmaladeContext').useMarmaladeContext.mockReturnValue({
      basketIds: [],
      addToBasket: jest.fn(),
      removeFromBasket: jest.fn()
    });

    const { getByText } = render(<UnderThumbnail item={mockItem} />);
    expect(getByText('Test Item')).toBeInTheDocument();
    expect(getByText('£10')).toBeInTheDocument();
  });

  it('should add item to basket when ADD is clicked', async () => {
    const mockAddToBasket = jest.fn();
    jest.requireMock('./context/MarmaladeContext').useMarmaladeContext.mockReturnValue({
      basketIds: [],
      addToBasket: mockAddToBasket,
      removeFromBasket: jest.fn()
    });

    const { getByText } = render(<UnderThumbnail item={mockItem} />);

    await act(async () => {
      fireEvent.click(getByText('ADD'));
    });

    expect(mockAddToBasket).toHaveBeenCalledWith(mockItem.id);
  });

  it('should show disabled ADD button when item is in basket', () => {
    jest.requireMock('./context/MarmaladeContext').useMarmaladeContext.mockReturnValue({
      basketIds: [mockItem.id],
      addToBasket: jest.fn(),
      removeFromBasket: jest.fn()
    });

    const { getByText } = render(<UnderThumbnail item={mockItem} />);
    const button = getByText('ADD');
    expect(button.className).toContain('disabled');
  });
}); 