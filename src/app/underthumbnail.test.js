import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import UnderThumbnail from './underthumbnail';
import { MarmaladeProvider } from './context/MarmaladeContext';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the MarmaladeContext
jest.mock('./context/MarmaladeContext', () => ({
  ...jest.requireActual('./context/MarmaladeContext'),
  useMarmaladeContext: () => ({
    basketIds: [],
    addToBasket: jest.fn(),
    removeFromBasket: jest.fn(),
  }),
}));

describe('UnderThumbnail', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockItem = {
    id: 'test-item-1',
    name: 'Test Item',
    price: 10,
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    // Reset the MarmaladeContext mock before each test
    jest.spyOn(require('./context/MarmaladeContext'), 'useMarmaladeContext').mockImplementation(() => ({
      basketIds: [],
      addToBasket: jest.fn(),
      removeFromBasket: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add item to basket when ADD button is clicked', () => {
    const mockAddToBasket = jest.fn();
    jest.spyOn(require('./context/MarmaladeContext'), 'useMarmaladeContext').mockImplementation(() => ({
      basketIds: [],
      addToBasket: mockAddToBasket,
      removeFromBasket: jest.fn(),
    }));

    render(
      <MarmaladeProvider>
        <UnderThumbnail item={mockItem} />
      </MarmaladeProvider>
    );

    const addButton = screen.getByText('ADD');
    fireEvent.click(addButton);

    expect(mockAddToBasket).toHaveBeenCalledWith(mockItem.id);
    expect(mockRouter.push).toHaveBeenCalledWith('/basket');
  });

  it('should disable ADD button when item is already in basket', () => {
    jest.spyOn(require('./context/MarmaladeContext'), 'useMarmaladeContext').mockImplementation(() => ({
      basketIds: [mockItem.id],
      addToBasket: jest.fn(),
      removeFromBasket: jest.fn(),
    }));

    render(
      <MarmaladeProvider>
        <UnderThumbnail item={mockItem} />
      </MarmaladeProvider>
    );

    const addButton = screen.getByText('ADD');
    expect(addButton).toHaveClass('disabled');
  });

  it('should not add item to basket when ADD button is clicked and item is already in basket', () => {
    const mockAddToBasket = jest.fn();
    jest.spyOn(require('./context/MarmaladeContext'), 'useMarmaladeContext').mockImplementation(() => ({
      basketIds: [mockItem.id],
      addToBasket: mockAddToBasket,
      removeFromBasket: jest.fn(),
    }));

    render(
      <MarmaladeProvider>
        <UnderThumbnail item={mockItem} />
      </MarmaladeProvider>
    );

    const addButton = screen.getByText('ADD');
    fireEvent.click(addButton);

    expect(mockAddToBasket).not.toHaveBeenCalled();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('displays item name and price correctly', () => {
    render(
      <MarmaladeProvider>
        <UnderThumbnail item={mockItem} />
      </MarmaladeProvider>
    );

    expect(screen.getByText(mockItem.name)).toBeInTheDocument();
    expect(screen.getByText(`£${mockItem.price}`)).toBeInTheDocument();
  });
}); 