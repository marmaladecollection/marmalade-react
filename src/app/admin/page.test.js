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

  it('shows the correct sold items in the sold table', async () => {
    fetchAllItems.mockImplementation((setItems) => setItems([]));
    const soldItems = [
      { id: '10', name: 'Sold 1', price: 500 },
      { id: '11', name: 'Sold 2', price: 600 },
    ];
    fetchSoldItems.mockResolvedValue(soldItems);
    render(<AdminPage />);
    expect(await screen.findByText('Sold Items')).toBeInTheDocument();
    for (const item of soldItems) {
      expect(await screen.findByText(item.name)).toBeInTheDocument();
      expect(await screen.findByText(`£${item.price}`)).toBeInTheDocument();
    }
  });
}); 