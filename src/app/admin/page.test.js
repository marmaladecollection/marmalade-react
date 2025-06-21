import { render, screen } from '@testing-library/react';
import AdminPage from './page';
import { fetchAllItems, fetchSoldItems } from '../firebase';

jest.mock('../firebase', () => ({
  fetchAllItems: jest.fn(),
  fetchSoldItems: jest.fn(),
}));

describe('AdminPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    fetchAllItems.mockImplementation((setItems) => setItems([]));
    fetchSoldItems.mockResolvedValue([]);
    render(<AdminPage />);
    // No heading expected
  });

  it('shows the correct items in the table', async () => {
    const mockItems = [
      { id: '1', name: 'Item 1', price: 100 },
      { id: '2', name: 'Item 2', price: 200 },
      { id: '3', name: 'Item 3', price: 300 },
    ];
    fetchAllItems.mockImplementation((setItems) => setItems(mockItems));
    fetchSoldItems.mockResolvedValue([]);
    render(<AdminPage />);
    expect(await screen.findByText('Items for Sale')).toBeInTheDocument();
    // Check table rows
    for (const item of mockItems) {
      expect(await screen.findByText(item.name)).toBeInTheDocument();
      expect(await screen.findByText(`£${item.price}`)).toBeInTheDocument();
    }
  });

  it('shows all fields in the sold items table', async () => {
    fetchAllItems.mockImplementation((setItems) => setItems([]));
    const soldItems = [
      { id: '10', name: 'Sold 1', price: 500, customerName: 'Alice', saleDate: '2024-06-21', extraField: 'foo' },
      { id: '11', name: 'Sold 2', price: 600, customerName: 'Bob', saleDate: '2024-06-22', extraField: 'bar' },
    ];
    fetchSoldItems.mockResolvedValue(soldItems);
    render(<AdminPage />);
    expect(await screen.findByText('Sold Items')).toBeInTheDocument();
    // Check all table headers
    for (const key of Object.keys(soldItems[0]).filter(k => k !== 'id')) {
      expect(await screen.findByText(key)).toBeInTheDocument();
    }
    // Check all cell values
    for (const item of soldItems) {
      for (const key of Object.keys(item).filter(k => k !== 'id')) {
        expect(await screen.findByText(String(item[key]))).toBeInTheDocument();
      }
    }
  });
}); 