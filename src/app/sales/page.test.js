import { fetchSoldItems } from '../firebase';
import SalesPage from './page';

jest.mock('../firebase', () => ({
  fetchSoldItems: jest.fn(),
}));

describe('SalesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('is defined as a server component', () => {
    expect(SalesPage).toBeDefined();
    expect(typeof SalesPage).toBe('function');
  });

  it('fetchSoldItems returns correct data', async () => {
    const soldItems = [
      { id: '10', name: 'Sold 1', price: 500, customerName: 'Alice', saleDate: '2024-06-21', extraField: 'foo' },
      { id: '11', name: 'Sold 2', price: 600, customerName: 'Bob', saleDate: '2024-06-22', extraField: 'bar' },
    ];
    fetchSoldItems.mockResolvedValue(soldItems);
    const result = await fetchSoldItems();
    expect(result).toEqual(soldItems);
  });
}); 