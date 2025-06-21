import { render, screen } from '@testing-library/react';
import AdminPage from './page';
import { fetchAllItems, fetchSoldItemDetails } from '../firebase';

jest.mock('../firebase', () => ({
  fetchAllItems: jest.fn(),
  fetchSoldItemDetails: jest.fn(),
}));

// Helper to convert snake_case or camelCase/PascalCase to Title Case with spaces
function toTitleCase(str) {
  return str
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1));
}

// Helper to format date as 'Fri, 10th May 25, 15:45'
function formatSaleDate(ts) {
  if (!ts) return '';
  // If already formatted as string, return as is
  if (typeof ts === 'string' && ts.match(/\d{4}-\d{2}-\d{2}/)) return ts;
  if (typeof ts === 'object' && typeof ts.seconds === 'number') {
    const date = new Date(ts.seconds * 1000);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const daySuffix = (d) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    const dayStr = `${day}${daySuffix(day)}`;
    const weekday = days[date.getDay()];
    const month = months[date.getMonth()];
    const year = String(date.getFullYear()).slice(-2);
    const hour = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${weekday}, ${dayStr} ${month} ${year}, ${hour}:${min}`;
  }
  return String(ts);
}

describe('AdminPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    // Provide at least one item so the heading is rendered
    const mockItems = [
      { id: '1', name: 'Item 1', price: 100 }
    ];
    fetchAllItems.mockImplementation((setItems) => setItems(mockItems));
    fetchSoldItemDetails.mockResolvedValue([]);
    render(<AdminPage />);
    // Wait for effects to flush (e.g., by waiting for a known element)
    await screen.findByText('Items for Sale');
  });

  it('shows the correct items in the table', async () => {
    const mockItems = [
      { id: '1', name: 'Item 1', price: 100 },
      { id: '2', name: 'Item 2', price: 200 },
      { id: '3', name: 'Item 3', price: 300 },
    ];
    fetchAllItems.mockImplementation((setItems) => setItems(mockItems));
    fetchSoldItemDetails.mockResolvedValue([]);
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
    fetchSoldItemDetails.mockResolvedValue(soldItems);
    render(<AdminPage />);
    expect(await screen.findByText('Sold Items')).toBeInTheDocument();
    // Check all table headers
    for (const key of Object.keys(soldItems[0]).filter(k => k !== 'id')) {
      expect(await screen.findByText(toTitleCase(key))).toBeInTheDocument();
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