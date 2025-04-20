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

    // Mock fetchItemsByIds to return the item
    fetchItemsByIds.mockResolvedValue([{ id: 'item1', name: 'Item 1' }]);

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

    // Mock fetchItemsByIds to return the item initially
    fetchItemsByIds.mockResolvedValue([{ id: 'item1', name: 'Item 1' }]);

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

    // Mock fetchItemsByIds to return the items initially
    fetchItemsByIds.mockResolvedValue([
      { id: 'item1', name: 'Item 1' },
      { id: 'item2', name: 'Item 2' }
    ]);

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

  it('should remove items from basket that cannot be found', async () => {
    let contextValue;
    const TestComponent = () => {
      contextValue = useMarmaladeContext();
      return null;
    };

    // Initial mock for the first render
    fetchItemsByIds.mockResolvedValue([
      { id: 'item1', name: 'Item 1' },
      { id: 'item2', name: 'Item 2' },
      { id: 'item3', name: 'Item 3' }
    ]);

    // Initial render
    await act(async () => {
      render(
        <MarmaladeProvider>
          <TestComponent />
        </MarmaladeProvider>
      );
    });

    // Add items to basket
    await act(async () => {
      contextValue.addToBasket('item1');
      contextValue.addToBasket('item2');
      contextValue.addToBasket('item3');
    });

    // Update mock to return only item1 and item3 (item2 is missing)
    fetchItemsByIds.mockResolvedValue([
      { id: 'item1', name: 'Item 1' },
      { id: 'item3', name: 'Item 3' }
    ]);

    // Wait for the effect to complete
    await act(async () => {
      // Force a re-render by adding a new item
      contextValue.addToBasket('item4');
      // Wait for the effect to complete
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify that item2 was automatically removed from basketIds and item4 remains
    expect(contextValue.basketIds).toEqual(['item1', 'item3']);
    expect(contextValue.basketItems).toEqual([
      { id: 'item1', name: 'Item 1' },
      { id: 'item3', name: 'Item 3' }
    ]);
  });
}); 