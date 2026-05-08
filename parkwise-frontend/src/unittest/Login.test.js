import { render, screen } from '@testing-library/react';
import Login from '../pages/Login';

test('renders login form', () => {
  render(<Login />);
  expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
}); 