import { render, screen } from '@testing-library/react';
import AdminPage from './page';
import { fetchAllItems } from '../firebase';

jest.mock('../firebase', () => ({
  fetchAllItems: jest.fn(),
}));

describe('AdminPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    fetchAllItems.mockImplementation((setItems) => setItems([]));
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
    render(<AdminPage />);
    expect(await screen.findByText('Items for Sale')).toBeInTheDocument();
    // Check table rows
    for (const item of mockItems) {
      expect(await screen.findByText(item.name)).toBeInTheDocument();
      expect(await screen.findByText(`£${item.price}`)).toBeInTheDocument();
    }
  });
}); 