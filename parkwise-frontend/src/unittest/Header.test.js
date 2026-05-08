import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

test('renders ParkWise logo', () => {
  render(<Header />);
  expect(screen.getByAltText(/ParkWise Logo/i)).toBeInTheDocument();
}); 