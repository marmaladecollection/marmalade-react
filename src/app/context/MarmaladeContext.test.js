import { render, act } from '@testing-library/react';
import { MarmaladeProvider, useMarmaladeContext } from './MarmaladeContext';

// Mock console.error to prevent errors from being logged during tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Test component to access context
const TestComponent = ({ testFunction }) => {
  const context = useMarmaladeContext();
  testFunction(context);
  return null;
};

describe('MarmaladeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('should initialize with empty basket', () => {
    let contextValue;
    render(
      <MarmaladeProvider>
        <TestComponent testFunction={(context) => { contextValue = context; }} />
      </MarmaladeProvider>
    );

    expect(contextValue.basketIds).toEqual([]);
  });

  it('should load basket IDs from localStorage on mount', () => {
    const savedIds = ['item1', 'item2'];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedIds));

    let contextValue;
    render(
      <MarmaladeProvider>
        <TestComponent testFunction={(context) => { contextValue = context; }} />
      </MarmaladeProvider>
    );

    expect(contextValue.basketIds).toEqual(savedIds);
  });

  it('should add item to basket', () => {
    let contextValue;
    render(
      <MarmaladeProvider>
        <TestComponent testFunction={(context) => { contextValue = context; }} />
      </MarmaladeProvider>
    );

    act(() => {
      contextValue.addToBasket('newItem');
    });

    expect(contextValue.basketIds).toEqual(['newItem']);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('BasketIds', JSON.stringify(['newItem']));
  });

  it('should remove item from basket', () => {
    const initialIds = ['item1', 'item2', 'item3'];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialIds));

    let contextValue;
    render(
      <MarmaladeProvider>
        <TestComponent testFunction={(context) => { contextValue = context; }} />
      </MarmaladeProvider>
    );

    act(() => {
      contextValue.removeFromBasket('item2');
    });

    expect(contextValue.basketIds).toEqual(['item1', 'item3']);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('BasketIds', JSON.stringify(['item1', 'item3']));
  });

  it('should clear basket', () => {
    const initialIds = ['item1', 'item2', 'item3'];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialIds));

    let contextValue;
    render(
      <MarmaladeProvider>
        <TestComponent testFunction={(context) => { contextValue = context; }} />
      </MarmaladeProvider>
    );

    act(() => {
      contextValue.clearBasket();
    });

    expect(contextValue.basketIds).toEqual([]);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('BasketIds', JSON.stringify([]));
  });

  it('should handle localStorage errors gracefully', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('Storage error');
    });

    let contextValue;
    render(
      <MarmaladeProvider>
        <TestComponent testFunction={(context) => { contextValue = context; }} />
      </MarmaladeProvider>
    );

    expect(contextValue.basketIds).toEqual([]);
  });
}); 