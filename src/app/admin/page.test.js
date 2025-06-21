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

  it('renders the admin title and info', () => {
    fetchAllItems.mockImplementation((setItems) => setItems([]));
    render(<AdminPage />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('This is a hidden page for administrators. Add admin tools and information here.')).toBeInTheDocument();
  });

  it('shows the correct number of items for sale', async () => {
    const mockItems = [
      { id: '1', name: 'Item 1', price: 100 },
      { id: '2', name: 'Item 2', price: 200 },
      { id: '3', name: 'Item 3', price: 300 },
    ];
    fetchAllItems.mockImplementation((setItems) => setItems(mockItems));
    render(<AdminPage />);
    expect(
      await screen.findByText(
        (content, element) =>
          element.tagName.toLowerCase() === 'p' &&
          content.includes('Number of items for sale:') &&
          element.textContent.includes('3')
      )
    ).toBeInTheDocument();
  });
}); 