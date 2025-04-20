import { render, act } from '@testing-library/react';
import { MarmaladeProvider, useMarmaladeContext } from './MarmaladeContext';
import { fetchItemsByIds } from '../firebase';

// Mock the fetchItemsByIds function
jest.mock('../firebase', () => ({
  fetchItemsByIds: jest.fn()
}));

describe('MarmaladeContext', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    // Reset mocks
    jest.clearAllMocks();
    // Mock fetchItemsByIds to return empty array by default
    fetchItemsByIds.mockResolvedValue([]);
  });

  it('should provide initial empty basket state', async () => {
    let contextValue;
    const TestComponent = () => {
      contextValue = useMarmaladeContext();
      return null;
    };

    await act(async () => {
      render(
        <MarmaladeProvider>
          <TestComponent />
        </MarmaladeProvider>
      );
    });

    expect(contextValue.basketIds).toEqual([]);
    expect(contextValue.basketItems).toEqual([]);
  });

  it('should add item to basket', async () => {
    let contextValue;
    const TestComponent = () => {
      contextValue = useMarmaladeContext();
      return null;
    };

    await act(async () => {
      render(
        <MarmaladeProvider>
          <TestComponent />
        </MarmaladeProvider>
      );
    });

    await act(async () => {
      contextValue.addToBasket('item1');
    });

    expect(contextValue.basketIds).toEqual(['item1']);
  });

  it('should remove item from basket', async () => {
    let contextValue;
    const TestComponent = () => {
      contextValue = useMarmaladeContext();
      return null;
    };

    await act(async () => {
      render(
        <MarmaladeProvider>
          <TestComponent />
        </MarmaladeProvider>
      );
    });

    // First add an item
    await act(async () => {
      contextValue.addToBasket('item1');
    });

    // Then remove it
    await act(async () => {
      contextValue.removeFromBasket('item1');
    });

    expect(contextValue.basketIds).toEqual([]);
  });

  it('should clear basket', async () => {
    let contextValue;
    const TestComponent = () => {
      contextValue = useMarmaladeContext();
      return null;
    };

    await act(async () => {
      render(
        <MarmaladeProvider>
          <TestComponent />
        </MarmaladeProvider>
      );
    });

    // First add some items
    await act(async () => {
      contextValue.addToBasket('item1');
      contextValue.addToBasket('item2');
    });

    // Then clear the basket
    await act(async () => {
      contextValue.clearBasket();
    });

    expect(contextValue.basketIds).toEqual([]);
  });

  it('should fetch basket items when basketIds change', async () => {
    const mockItems = [
      { id: 'item1', name: 'Item 1' },
      { id: 'item2', name: 'Item 2' }
    ];

    fetchItemsByIds.mockResolvedValue(mockItems);

    let contextValue;
    const TestComponent = () => {
      contextValue = useMarmaladeContext();
      return null;
    };

    render(
      <MarmaladeProvider>
        <TestComponent />
      </MarmaladeProvider>
    );

    await act(async () => {
      contextValue.addToBasket('item1');
      contextValue.addToBasket('item2');
    });

    expect(fetchItemsByIds).toHaveBeenCalledWith(['item1', 'item2']);
    expect(contextValue.basketItems).toEqual(mockItems);
  });
}); 