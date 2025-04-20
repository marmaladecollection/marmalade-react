import { collection, getDocs, doc, getDoc, getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { fetchAllItems } from './firebase';

// Mock Firebase
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn((db, collection, id) => ({
    path: `${collection}/${id}`
  })),
  getDoc: jest.fn(),
  getFirestore: jest.fn(() => ({
    // Return a mock database object
  })),
}));

// Mock Firebase app initialization
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({
    // Return a mock app object
  })),
}));

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    // Return a mock auth object
  })),
  signInAnonymously: jest.fn(() => Promise.resolve({})),
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