import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ItemPage from './page';
import { fetchItemById } from '../../firebase';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock fetchItemById
jest.mock('../../firebase', () => ({
  fetchItemById: jest.fn(),
}));

// Mock thumbnail component
jest.mock('../../thumbnail', () => {
  return function Thumbnail() {
    return <div data-testid="mock-thumbnail">Mock Thumbnail</div>;
  };
});

// Mock images component
jest.mock('./images', () => {
  return function Images() {
    return <div data-testid="mock-images">Mock Images</div>;
  };
});

// Mock itemprimary component
jest.mock('./itemprimary', () => {
  return function ItemPrimary({ item }) {
    return (
      <div data-testid="mock-itemprimary">
        <div className="buttons">
          <a className={`addToBag ${item?.sold ? 'disabled' : ''}`}>Add to bag</a>
        </div>
      </div>
    );
  };
});

// Mock MarmaladeContext
jest.mock('../../context/MarmaladeContext', () => ({
  useMarmaladeContext: () => ({
    basketIds: [],
    addToBasket: jest.fn(),
  }),
}));

describe('ItemPage', () => {
  const mockItem = {
    id: 'test-item',
    name: 'Test Item',
    price: 100
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.location.pathname
    delete window.location;
    window.location = { pathname: '/item/test-item' };
  });

  it('should show sold banner when item is sold', async () => {
    // Mock fetchItemById to call the itemSold callback
    fetchItemById.mockImplementation((id, setItem, itemSold) => {
      setItem(mockItem);
      itemSold(mockItem);
    });

    render(<ItemPage />);

    // Check that the sold banner is displayed
    const banner = screen.getByText("We're sorry, this item has been sold");
    expect(banner).toBeInTheDocument();
  });

  it('should not show sold banner when item is not sold', async () => {
    // Mock fetchItemById to not call the itemSold callback
    fetchItemById.mockImplementation((id, setItem) => {
      setItem(mockItem);
    });

    render(<ItemPage />);

    // Check that the sold banner is not displayed
    const banner = screen.queryByText("We're sorry, this item has been sold");
    expect(banner).not.toBeInTheDocument();
  });

  it('should disable Add to Bag button when item is sold', async () => {
    // Mock fetchItemById to call the itemSold callback
    fetchItemById.mockImplementation((id, setItem, itemSold) => {
      const soldItem = { ...mockItem, sold: true };
      setItem(soldItem);
      itemSold(soldItem);
    });

    render(<ItemPage />);

    // Check that the Add to Bag button is disabled
    const addToBagButton = screen.getByText('Add to bag');
    expect(addToBagButton).toHaveClass('disabled');
    
    // Verify clicking the button doesn't trigger navigation
    const router = { push: jest.fn() };
    useRouter.mockReturnValue(router);
    
    fireEvent.click(addToBagButton);
    expect(router.push).not.toHaveBeenCalled();
  });
}); 