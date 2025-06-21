import { render, screen } from '@testing-library/react';
import SalesPage from './page';
import { fetchSoldItems } from '../firebase';
import { toTitleCase } from '../components/SalesTable';

jest.mock('../firebase', () => ({
  fetchSoldItems: jest.fn(),
}));

describe('SalesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    fetchSoldItems.mockResolvedValue([]);
    render(<SalesPage />);
    // No heading expected if no items
  });

  it('shows the correct sold items in the table', async () => {
    const soldItems = [
      { id: '10', name: 'Sold 1', price: 500, customerName: 'Alice', saleDate: '2024-06-21', extraField: 'foo' },
      { id: '11', name: 'Sold 2', price: 600, customerName: 'Bob', saleDate: '2024-06-22', extraField: 'bar' },
    ];
    fetchSoldItems.mockResolvedValue(soldItems);
    render(<SalesPage />);
    expect(await screen.findByText('Sold Items')).toBeInTheDocument();
    // Check all table headers
    for (const key of Object.keys(soldItems[0]).filter(k => k !== 'id')) {
      const title = toTitleCase(key);
      expect(await screen.findByText(title)).toBeInTheDocument();
    }
    // Check all cell values
    for (const item of soldItems) {
      for (const key of Object.keys(item).filter(k => k !== 'id')) {
        let expectedValue;
        if (key === 'price') {
          expectedValue = `£${item[key]}`;
        } else if (key === 'saleDate') {
          // Match the 'since' time (e.g., 'years ago', 'days ago', etc.)
          expectedValue = (content, node) =>
            /ago$/.test(content.trim()) || /RECENT SALE/.test(content);
          // Use findAllByText and check count
          const matches = await screen.findAllByText(expectedValue);
          expect(matches.length).toBeGreaterThanOrEqual(1);
          continue;
        } else {
          expectedValue = String(item[key]);
        }
        expect(await screen.findByText(expectedValue)).toBeInTheDocument();
      }
    }
  });
}); 