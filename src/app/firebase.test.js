import { collection, getDocs, doc, getDoc, getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { fetchAllItems, fetchItemsByIds, fetchItemById } from './firebase';

jest.mock('firebase/firestore');
const mockCollection = jest.fn();
collection.mockImplementation(mockCollection);

// Mock Firebase
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn((db, collectionName, id) => ({ path: `${collectionName}/${id}` })),
  getDoc: jest.fn(),
  getFirestore: jest.fn(),
  addDoc: jest.fn(),
  setDoc: jest.fn(),
}));

// Mock Firebase app initialization
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({
    // Return a mock app object
  })),
}));

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInAnonymously: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

// Mock process.env
const originalEnv = process.env;
beforeAll(() => {
  process.env = {
    ...originalEnv,
    NODE_ENV: 'test'
  };
});

afterAll(() => {
  process.env = originalEnv;
});

describe('fetchAllItems', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not return items that exist in the sale collection', async () => {
    // Mock items collection
    const mockItems = [
      { id: 'item1', name: 'Item 1', price: 100 },
      { id: 'item2', name: 'Item 2', price: 200 },
      { id: 'item3', name: 'Item 3', price: 300 },
    ];

    // Mock sale collection - item2 is sold
    const mockSales = [
      { id: 'item2', itemId: 'item2', saleDate: new Date() },
    ];

    // Mock getDocs for items collection
    getDocs.mockResolvedValueOnce({
      docs: mockItems.map(item => ({
        id: item.id,
        data: () => ({ name: item.name, price: item.price })
      }))
    });

    // Mock getDoc for sale collection
    getDoc.mockImplementation((docRef) => {
      const id = docRef.path.split('/')[1];
      const sale = mockSales.find(s => s.id === id);
      return Promise.resolve({
        exists: () => !!sale,
        data: () => sale
      });
    });

    // Mock setItems function
    const setItems = jest.fn();

    // Call fetchAllItems
    await fetchAllItems(setItems);

    // Verify that setItems was called with only unsold items
    expect(setItems).toHaveBeenCalledWith([
      { id: 'item1', name: 'Item 1', price: 100 },
      { id: 'item3', name: 'Item 3', price: 300 },
    ]);
  });

  it('should handle empty collections', async () => {
    // Mock empty items collection
    getDocs.mockResolvedValueOnce({
      docs: []
    });

    const setItems = jest.fn();
    await fetchAllItems(setItems);

    expect(setItems).toHaveBeenCalledWith([]);
  });
});

describe('fetchItemsByIds', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not return items that exist in the sale collection', async () => {
    // Mock getDoc responses
    getDoc.mockImplementation((docRef) => {
      const path = docRef.path.split('/');
      const collection = path[0];
      const id = path[1];

      if (collection === 'item') {
        const items = {
          'item1': { name: 'Item 1', price: 100 },
          'item2': { name: 'Item 2', price: 200 },
          'item3': { name: 'Item 3', price: 300 },
        };
        return {
          exists: () => items[id] !== undefined,
          id: id,
          data: () => items[id],
        };
      }
      if (collection === 'sale') {
        return {
          exists: () => id === 'item2',
        };
      }
    });

    const items = await fetchItemsByIds(['item1', 'item2', 'item3']);
    expect(items).toEqual([
      { id: 'item1', name: 'Item 1', price: 100 },
      { id: 'item3', name: 'Item 3', price: 300 },
    ]);
  });

  it('should handle empty array of IDs', async () => {
    const items = await fetchItemsByIds([]);
    expect(items).toEqual([]);
  });

  it('should handle non-existent items', async () => {
    getDoc.mockImplementation(() => ({
      exists: () => false,
    }));

    const items = await fetchItemsByIds(['non-existent-id']);
    expect(items).toEqual([]);
  });
});

describe('fetchItemById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call itemSold callback when item exists in sale collection', async () => {
    // Mock item
    const mockItem = {
      id: 'item1',
      name: 'Test Item',
      price: 100
    };

    // Mock sale for the item
    const mockSale = {
      id: 'item1',
      itemId: 'item1',
      saleDate: new Date()
    };

    // Mock getDoc to handle both item and sale collection checks
    getDoc.mockImplementation((docRef) => {
      const [collection, id] = docRef.path.split('/');
      
      if (collection === 'item') {
        if (id === mockItem.id) {
          return Promise.resolve({
            exists: () => true,
            id: mockItem.id,
            data: () => ({ name: mockItem.name, price: mockItem.price })
          });
        }
      } else if (collection === 'sale') {
        if (id === mockSale.id) {
          return Promise.resolve({
            exists: () => true,
            data: () => mockSale
          });
        }
      }
      
      return Promise.resolve({
        exists: () => false
      });
    });

    // Mock setItem function
    const setItem = jest.fn();
    // Mock itemSold callback
    const itemSold = jest.fn();

    // Call fetchItemById
    await fetchItemById('item1', setItem, itemSold);

    // Verify that itemSold was called
    expect(itemSold).toHaveBeenCalled();
    // Verify that setItem was not called
    expect(setItem).not.toHaveBeenCalled();
  });

  it('should set item when it exists and is not in sale collection', async () => {
    // Mock item
    const mockItem = {
      id: 'item1',
      name: 'Test Item',
      price: 100
    };

    // Mock getDoc to handle item check
    getDoc.mockImplementation((docRef) => {
      const [collection, id] = docRef.path.split('/');
      
      if (collection === 'item' && id === mockItem.id) {
        return Promise.resolve({
          exists: () => true,
          id: mockItem.id,
          data: () => ({ name: mockItem.name, price: mockItem.price })
        });
      }
      
      return Promise.resolve({
        exists: () => false
      });
    });

    // Mock setItem function
    const setItem = jest.fn();
    // Mock itemSold callback
    const itemSold = jest.fn();

    // Call fetchItemById
    await fetchItemById('item1', setItem, itemSold);

    // Verify that setItem was called with the item data
    expect(setItem).toHaveBeenCalledWith({
      id: 'item1',
      name: 'Test Item',
      price: 100
    });
    // Verify that itemSold was not called
    expect(itemSold).not.toHaveBeenCalled();
  });

  it('should handle non-existent items', async () => {
    // Mock getDoc to return non-existent
    getDoc.mockImplementation(() => Promise.resolve({
      exists: () => false
    }));

    const setItem = jest.fn();
    const itemSold = jest.fn();

    await fetchItemById('non-existent-id', setItem, itemSold);

    expect(setItem).not.toHaveBeenCalled();
    expect(itemSold).not.toHaveBeenCalled();
  });
}); 