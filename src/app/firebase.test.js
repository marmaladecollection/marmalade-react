// Shared Firestore mocks
const firestoreMocks = {
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn((db, collectionName, id) => ({ path: `${collectionName}/${id}` })),
  getDoc: jest.fn(),
  getFirestore: jest.fn(),
  addDoc: jest.fn(),
  setDoc: jest.fn(),
};

jest.mock('firebase/firestore', () => ({
  ...firestoreMocks,
  __esModule: true,
}));
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));
// Mock user for authentication
const mockUser = {
  uid: 'test-user-uid',
  isAnonymous: true,
};

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signInAnonymously: jest.fn(() => Promise.resolve({ user: mockUser })),
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
    Object.values(firestoreMocks).forEach(fn => fn.mockClear());
  });

  it('should not return items that exist in the sale collection', async () => {
    jest.resetModules();
    // Re-initialize all firestoreMocks after resetModules
    firestoreMocks.collection = jest.fn((db, name) => ({ id: name }));
    firestoreMocks.getDocs = jest.fn();
    firestoreMocks.doc = jest.fn((db, collectionName, id) => ({ path: `${collectionName}/${id}` }));
    firestoreMocks.getDoc = jest.fn();
    firestoreMocks.getFirestore = jest.fn();
    firestoreMocks.addDoc = jest.fn();
    firestoreMocks.setDoc = jest.fn();
    const { fetchAllItems } = require('./firebase');
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
    firestoreMocks.getDocs.mockResolvedValueOnce({
      docs: mockItems.map(item => ({
        id: item.id,
        data: () => ({ name: item.name, price: item.price })
      }))
    });
    // Mock getDoc for sale collection
    firestoreMocks.getDoc.mockImplementation((docRef) => {
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
    jest.resetModules();
    firestoreMocks.collection = jest.fn((db, name) => ({ id: name }));
    firestoreMocks.getDocs = jest.fn();
    firestoreMocks.doc = jest.fn((db, collectionName, id) => ({ path: `${collectionName}/${id}` }));
    firestoreMocks.getDoc = jest.fn();
    firestoreMocks.getFirestore = jest.fn();
    firestoreMocks.addDoc = jest.fn();
    firestoreMocks.setDoc = jest.fn();
    const { fetchAllItems } = require('./firebase');
    // Mock empty items collection
    firestoreMocks.getDocs.mockResolvedValueOnce({
      docs: []
    });
    const setItems = jest.fn();
    await fetchAllItems(setItems);
    expect(setItems).toHaveBeenCalledWith([]);
  });
});

describe('fetchItemsByIds', () => {
  beforeEach(() => {
    Object.values(firestoreMocks).forEach(fn => fn.mockClear());
  });

  it('should not return items that exist in the sale collection', async () => {
    jest.resetModules();
    firestoreMocks.collection = jest.fn((db, name) => ({ id: name }));
    firestoreMocks.getDocs = jest.fn();
    firestoreMocks.doc = jest.fn((db, collectionName, id) => ({ path: `${collectionName}/${id}` }));
    firestoreMocks.getDoc = jest.fn();
    firestoreMocks.getFirestore = jest.fn();
    firestoreMocks.addDoc = jest.fn();
    firestoreMocks.setDoc = jest.fn();
    const { fetchItemsByIds } = require('./firebase');
    // Mock getDoc responses
    firestoreMocks.getDoc.mockImplementation((docRef) => {
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
    jest.resetModules();
    firestoreMocks.collection = jest.fn((db, name) => ({ id: name }));
    firestoreMocks.getDocs = jest.fn();
    firestoreMocks.doc = jest.fn((db, collectionName, id) => ({ path: `${collectionName}/${id}` }));
    firestoreMocks.getDoc = jest.fn();
    firestoreMocks.getFirestore = jest.fn();
    firestoreMocks.addDoc = jest.fn();
    firestoreMocks.setDoc = jest.fn();
    const { fetchItemsByIds } = require('./firebase');
    const items = await fetchItemsByIds([]);
    expect(items).toEqual([]);
  });

  it('should handle non-existent items', async () => {
    jest.resetModules();
    firestoreMocks.collection = jest.fn((db, name) => ({ id: name }));
    firestoreMocks.getDocs = jest.fn();
    firestoreMocks.doc = jest.fn((db, collectionName, id) => ({ path: `${collectionName}/${id}` }));
    firestoreMocks.getDoc = jest.fn();
    firestoreMocks.getFirestore = jest.fn();
    firestoreMocks.addDoc = jest.fn();
    firestoreMocks.setDoc = jest.fn();
    const { fetchItemsByIds } = require('./firebase');
    firestoreMocks.getDoc.mockImplementation(() => ({
      exists: () => false,
    }));
    const items = await fetchItemsByIds(['non-existent-id']);
    expect(items).toEqual([]);
  });
});

describe('fetchItemById', () => {
  beforeEach(() => {
    Object.values(firestoreMocks).forEach(fn => fn.mockClear());
  });

  it('should call itemSold callback when item exists in sale collection', async () => {
    jest.resetModules();
    firestoreMocks.collection = jest.fn((db, name) => ({ id: name }));
    firestoreMocks.getDocs = jest.fn();
    firestoreMocks.doc = jest.fn((db, collectionName, id) => ({ path: `${collectionName}/${id}` }));
    firestoreMocks.getDoc = jest.fn();
    firestoreMocks.getFirestore = jest.fn();
    firestoreMocks.addDoc = jest.fn();
    firestoreMocks.setDoc = jest.fn();
    const { fetchItemById } = require('./firebase');
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
    firestoreMocks.getDoc.mockImplementation((docRef) => {
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
    jest.resetModules();
    firestoreMocks.collection = jest.fn((db, name) => ({ id: name }));
    firestoreMocks.getDocs = jest.fn();
    firestoreMocks.doc = jest.fn((db, collectionName, id) => ({ path: `${collectionName}/${id}` }));
    firestoreMocks.getDoc = jest.fn();
    firestoreMocks.getFirestore = jest.fn();
    firestoreMocks.addDoc = jest.fn();
    firestoreMocks.setDoc = jest.fn();
    const { fetchItemById } = require('./firebase');
    // Mock item
    const mockItem = {
      id: 'item1',
      name: 'Test Item',
      price: 100
    };
    // Mock getDoc to handle item check
    firestoreMocks.getDoc.mockImplementation((docRef) => {
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
    jest.resetModules();
    firestoreMocks.collection = jest.fn((db, name) => ({ id: name }));
    firestoreMocks.getDocs = jest.fn();
    firestoreMocks.doc = jest.fn((db, collectionName, id) => ({ path: `${collectionName}/${id}` }));
    firestoreMocks.getDoc = jest.fn();
    firestoreMocks.getFirestore = jest.fn();
    firestoreMocks.addDoc = jest.fn();
    firestoreMocks.setDoc = jest.fn();
    const { fetchItemById } = require('./firebase');
    // Mock getDoc to return non-existent
    firestoreMocks.getDoc.mockImplementation(() => Promise.resolve({
      exists: () => false
    }));
    const setItem = jest.fn();
    const itemSold = jest.fn();
    await fetchItemById('non-existent-id', setItem, itemSold);
    expect(setItem).not.toHaveBeenCalled();
    expect(itemSold).not.toHaveBeenCalled();
  });
});

describe('fetchSoldItems', () => {
  beforeEach(() => {
    Object.values(firestoreMocks).forEach(fn => fn.mockClear());
  });

  it('returns only item fields plus saleDate for sold items', async () => {
    jest.resetModules();
    firestoreMocks.collection = jest.fn((db, name) => ({ id: name }));
    firestoreMocks.getDocs = jest.fn();
    firestoreMocks.doc = jest.fn((db, collectionName, id) => ({ path: `${collectionName}/${id}` }));
    firestoreMocks.getDoc = jest.fn();
    firestoreMocks.getFirestore = jest.fn();
    firestoreMocks.addDoc = jest.fn();
    firestoreMocks.setDoc = jest.fn();
    const { fetchSoldItems } = require('./firebase');
    const mockSales = [
      { id: 'item1', itemId: 'item1', saleDate: '2024-06-21' },
      { id: 'item2', itemId: 'item2', saleDate: '2024-06-22' },
    ];
    const mockItems = [
      { id: 'item1', name: 'Item 1', price: 100, foo: 'bar' },
      { id: 'item2', name: 'Item 2', price: 200, foo: 'baz' },
      { id: 'item3', name: 'Item 3', price: 300, foo: 'qux' },
    ];
    firestoreMocks.getDocs.mockImplementation((col) => {
      const colId = (typeof col === 'string') ? col : (col && (col._queryOptions?.collectionId || col.id));
      if (colId === 'sale') {
        return Promise.resolve({ docs: mockSales.map(sale => ({ id: sale.id, data: () => sale })) });
      }
      if (colId === 'item') {
        return Promise.resolve({ docs: mockItems.map(item => ({ id: item.id, data: () => item })) });
      }
      return Promise.resolve({ docs: [] });
    });
    const result = await fetchSoldItems();
    expect(result).toEqual([
      { id: 'item1', name: 'Item 1', price: 100, foo: 'bar', saleDate: '2024-06-21' },
      { id: 'item2', name: 'Item 2', price: 200, foo: 'baz', saleDate: '2024-06-22' },
    ]);
  });

  it('returns empty array if no sales', async () => {
    jest.resetModules();
    firestoreMocks.collection = jest.fn((db, name) => ({ id: name }));
    firestoreMocks.getDocs = jest.fn();
    firestoreMocks.doc = jest.fn((db, collectionName, id) => ({ path: `${collectionName}/${id}` }));
    firestoreMocks.getDoc = jest.fn();
    firestoreMocks.getFirestore = jest.fn();
    firestoreMocks.addDoc = jest.fn();
    firestoreMocks.setDoc = jest.fn();
    const { fetchSoldItems } = require('./firebase');
    firestoreMocks.getDocs.mockImplementation((col) => {
      const colId = (typeof col === 'string') ? col : (col && (col._queryOptions?.collectionId || col.id));
      if (colId === 'sale') {
        return Promise.resolve({ docs: [] });
      }
      if (colId === 'item') {
        return Promise.resolve({ docs: [] });
      }
      return Promise.resolve({ docs: [] });
    });
    const result = await fetchSoldItems();
    expect(result).toEqual([]);
  });

  it('ignores sales with missing items', async () => {
    jest.resetModules();
    firestoreMocks.collection = jest.fn((db, name) => ({ id: name }));
    firestoreMocks.getDocs = jest.fn();
    firestoreMocks.doc = jest.fn((db, collectionName, id) => ({ path: `${collectionName}/${id}` }));
    firestoreMocks.getDoc = jest.fn();
    firestoreMocks.getFirestore = jest.fn();
    firestoreMocks.addDoc = jest.fn();
    firestoreMocks.setDoc = jest.fn();
    const { fetchSoldItems } = require('./firebase');
    const mockSales = [
      { id: 'item1', itemId: 'item1', saleDate: '2024-06-21' },
      { id: 'item2', itemId: 'item2', saleDate: '2024-06-22' },
    ];
    const mockItems = [
      { id: 'item1', name: 'Item 1', price: 100 },
      // item2 missing
    ];
    firestoreMocks.getDocs.mockImplementation((col) => {
      const colId = (typeof col === 'string') ? col : (col && (col._queryOptions?.collectionId || col.id));
      if (colId === 'sale') {
        return Promise.resolve({ docs: mockSales.map(sale => ({ id: sale.id, data: () => sale })) });
      }
      if (colId === 'item') {
        return Promise.resolve({ docs: mockItems.map(item => ({ id: item.id, data: () => item })) });
      }
      return Promise.resolve({ docs: [] });
    });
    const result = await fetchSoldItems();
    expect(result).toEqual([
      { id: 'item1', name: 'Item 1', price: 100, saleDate: '2024-06-21' },
    ]);
  });

  it('throws and logs error on failure', async () => {
    jest.resetModules();
    firestoreMocks.collection = jest.fn((db, name) => ({ id: name }));
    firestoreMocks.getDocs = jest.fn();
    firestoreMocks.doc = jest.fn((db, collectionName, id) => ({ path: `${collectionName}/${id}` }));
    firestoreMocks.getDoc = jest.fn();
    firestoreMocks.getFirestore = jest.fn();
    firestoreMocks.addDoc = jest.fn();
    firestoreMocks.setDoc = jest.fn();
    const { fetchSoldItems } = require('./firebase');
    firestoreMocks.getDocs.mockImplementation(() => { throw new Error('Firestore error'); });
    const originalError = console.error;
    console.error = jest.fn();
    await expect(fetchSoldItems()).rejects.toThrow('Firestore error');
    console.error = originalError;
  });
});

describe('fetchSoldItemDetails', () => {
  beforeEach(() => {
    Object.values(firestoreMocks).forEach(fn => fn.mockClear());
  });

  it('returns merged sale and item fields for each sale', async () => {
    jest.resetModules();
    firestoreMocks.collection = jest.fn((db, name) => ({ id: name }));
    firestoreMocks.getDocs = jest.fn();
    firestoreMocks.doc = jest.fn((db, collectionName, id) => ({ path: `${collectionName}/${id}` }));
    firestoreMocks.getDoc = jest.fn();
    firestoreMocks.getFirestore = jest.fn();
    firestoreMocks.addDoc = jest.fn();
    firestoreMocks.setDoc = jest.fn();
    const { fetchSoldItemDetails } = require('./firebase');
    const mockSales = [
      { id: 'item1', itemId: 'item1', saleDate: '2024-06-21', paymentStatus: 'paid', foo: 'bar' },
      { id: 'item2', itemId: 'item2', saleDate: '2024-06-22', paymentStatus: 'pending', foo: 'baz' },
    ];
    const mockItems = [
      { id: 'item1', name: 'Item 1', price: 100, extra: 'x' },
      { id: 'item2', name: 'Item 2', price: 200, extra: 'y' },
      { id: 'item3', name: 'Item 3', price: 300, extra: 'z' },
    ];
    firestoreMocks.getDocs.mockImplementation((col) => {
      const colId = (typeof col === 'string') ? col : (col && (col._queryOptions?.collectionId || col.id));
      if (colId === 'sale') {
        return Promise.resolve({ docs: mockSales.map(sale => ({ id: sale.id, data: () => sale })) });
      }
      if (colId === 'item') {
        return Promise.resolve({ docs: mockItems.map(item => ({ id: item.id, data: () => item })) });
      }
      return Promise.resolve({ docs: [] });
    });
    const result = await fetchSoldItemDetails();
    expect(result).toEqual([
      { ...mockSales[0], ...mockItems[0] },
      { ...mockSales[1], ...mockItems[1] },
    ]);
  });

  it('returns empty array if no sales', async () => {
    jest.resetModules();
    firestoreMocks.collection = jest.fn((db, name) => ({ id: name }));
    firestoreMocks.getDocs = jest.fn();
    firestoreMocks.doc = jest.fn((db, collectionName, id) => ({ path: `${collectionName}/${id}` }));
    firestoreMocks.getDoc = jest.fn();
    firestoreMocks.getFirestore = jest.fn();
    firestoreMocks.addDoc = jest.fn();
    firestoreMocks.setDoc = jest.fn();
    const { fetchSoldItemDetails } = require('./firebase');
    firestoreMocks.getDocs.mockImplementation((col) => {
      const colId = (typeof col === 'string') ? col : (col && (col._queryOptions?.collectionId || col.id));
      if (colId === 'sale') {
        return Promise.resolve({ docs: [] });
      }
      if (colId === 'item') {
        return Promise.resolve({ docs: [] });
      }
      return Promise.resolve({ docs: [] });
    });
    const result = await fetchSoldItemDetails();
    expect(result).toEqual([]);
  });

  it('ignores sales with missing items', async () => {
    jest.resetModules();
    firestoreMocks.collection = jest.fn((db, name) => ({ id: name }));
    firestoreMocks.getDocs = jest.fn();
    firestoreMocks.doc = jest.fn((db, collectionName, id) => ({ path: `${collectionName}/${id}` }));
    firestoreMocks.getDoc = jest.fn();
    firestoreMocks.getFirestore = jest.fn();
    firestoreMocks.addDoc = jest.fn();
    firestoreMocks.setDoc = jest.fn();
    const { fetchSoldItemDetails } = require('./firebase');
    const mockSales = [
      { id: 'item1', itemId: 'item1', saleDate: '2024-06-21' },
      { id: 'item2', itemId: 'item2', saleDate: '2024-06-22' },
    ];
    const mockItems = [
      { id: 'item1', name: 'Item 1', price: 100 },
      // item2 missing
    ];
    firestoreMocks.getDocs.mockImplementation((col) => {
      const colId = (typeof col === 'string') ? col : (col && (col._queryOptions?.collectionId || col.id));
      if (colId === 'sale') {
        return Promise.resolve({ docs: mockSales.map(sale => ({ id: sale.id, data: () => sale })) });
      }
      if (colId === 'item') {
        return Promise.resolve({ docs: mockItems.map(item => ({ id: item.id, data: () => item })) });
      }
      return Promise.resolve({ docs: [] });
    });
    const result = await fetchSoldItemDetails();
    expect(result).toEqual([
      { ...mockSales[0], ...mockItems[0] },
    ]);
  });

  it('throws and logs error on failure', async () => {
    jest.resetModules();
    firestoreMocks.collection = jest.fn((db, name) => ({ id: name }));
    firestoreMocks.getDocs = jest.fn();
    firestoreMocks.doc = jest.fn((db, collectionName, id) => ({ path: `${collectionName}/${id}` }));
    firestoreMocks.getDoc = jest.fn();
    firestoreMocks.getFirestore = jest.fn();
    firestoreMocks.addDoc = jest.fn();
    firestoreMocks.setDoc = jest.fn();
    const { fetchSoldItemDetails } = require('./firebase');
    firestoreMocks.getDocs.mockImplementation(() => { throw new Error('Firestore error'); });
    const originalError = console.error;
    console.error = jest.fn();
    await expect(fetchSoldItemDetails()).rejects.toThrow('Firestore error');
    console.error = originalError;
  });
}); 