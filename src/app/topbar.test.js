import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import TopBar from './topbar';


// Mock Next.js's useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

test('clicking the MARMALADE logo redirects to the root of the website', () => {
  const pushMock = jest.fn(); // Mock the push function
  useRouter.mockReturnValue({ push: pushMock }); // Mock useRouter's return value

  // Render the TopBar component
  render(<TopBar />);

  // Find the MARMALADE logo by its test ID
  const logo = screen.getByTestId('marmalade-logo');

  // Simulate a click event on the logo
  fireEvent.click(logo);

  // Assert that router.push was called with '/'
  expect(pushMock).toHaveBeenCalledWith('/');
});
