import { render, screen } from '@testing-library/react';
import ParkingList from '../pages/ParkingList';

test('renders all parking spots heading', () => {
  render(<ParkingList />);
  expect(screen.getByText(/ALL PARKING SPOTS/i)).toBeInTheDocument();
}); 