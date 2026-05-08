import { render, screen } from '@testing-library/react';
import ParkingDetail from '../pages/ParkingDetail';
import { MemoryRouter } from 'react-router-dom';

test('renders parking spot details', () => {
  const spot = {
    name: 'Test Parking',
    free_places: 10,
    distance_km: 1.2,
    latitude: 48.85,
    longitude: 2.35,
    image_url: '',
  };
  render(
    <MemoryRouter initialEntries={[{ state: { spot } }]}> 
      <ParkingDetail />
    </MemoryRouter>
  );
  expect(screen.getByText(/Test Parking/i)).toBeInTheDocument();
  expect(screen.getByText(/Free Spaces/i)).toBeInTheDocument();
}); 