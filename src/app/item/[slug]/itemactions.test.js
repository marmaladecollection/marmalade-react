import { render, fireEvent, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ItemActions from './itemactions';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the MarmaladeContext
jest.mock('../../context/MarmaladeContext', () => ({
  useMarmaladeContext: jest.fn()
}));

describe('ItemActions', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render Add to bag button by default', () => {
    const mockAddToBasket = jest.fn();
    jest.requireMock('../../context/MarmaladeContext').useMarmaladeContext.mockReturnValue({
      basketIds: [],
      addToBasket: mockAddToBasket,
      removeFromBasket: jest.fn()
    });

    const { getByText } = render(<ItemActions item={{ id: '1', sold: false }} />);
    expect(getByText('Add to bag')).toBeInTheDocument();
  });

  it('should add item to basket when Add to bag is clicked', async () => {
    const mockAddToBasket = jest.fn();
    const mockPush = jest.fn();

    useRouter.mockReturnValue({
      push: mockPush
    });

    jest.requireMock('../../context/MarmaladeContext').useMarmaladeContext.mockReturnValue({
      basketIds: [],
      addToBasket: mockAddToBasket,
      removeFromBasket: jest.fn()
    });

    const { getByText } = render(<ItemActions item={{ id: '1', sold: false }} />);

    await act(async () => {
      fireEvent.click(getByText('Add to bag'));
    });

    expect(mockAddToBasket).toHaveBeenCalledWith('1');
    expect(mockPush).toHaveBeenCalledWith('/basket');
  });

  it('should show disabled Add to bag button when item is in basket', () => {
    jest.requireMock('../../context/MarmaladeContext').useMarmaladeContext.mockReturnValue({
      basketIds: ['1'],
      addToBasket: jest.fn(),
      removeFromBasket: jest.fn()
    });

    const { getByText } = render(<ItemActions item={{ id: '1', sold: false }} />);
    const button = getByText('Add to bag');
    expect(button.className).toContain('disabled');
  });

  it('should show disabled Add to bag button when item is sold', () => {
    jest.requireMock('../../context/MarmaladeContext').useMarmaladeContext.mockReturnValue({
      basketIds: [],
      addToBasket: jest.fn(),
      removeFromBasket: jest.fn()
    });

    const { getByText } = render(<ItemActions item={{ id: '1', sold: true }} />);
    const button = getByText('Add to bag');
    expect(button.className).toContain('disabled');
  });

  it('should show Add to bag if item is not in basket', () => {
    jest.requireMock('../../context/MarmaladeContext').useMarmaladeContext.mockReturnValue({
      basketIds: [],
      addToBasket: jest.fn(),
      removeFromBasket: jest.fn()
    });

    const { getByText } = render(<ItemActions item={{ id: '1', sold: false }} />);
    expect(getByText('Add to bag')).toBeInTheDocument();
  });
}); 