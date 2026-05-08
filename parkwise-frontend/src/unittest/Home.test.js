import { render, screen } from '@testing-library/react';
import Home from '../pages/Home';

test('renders main heading', () => {
  render(<Home />);
  expect(screen.getByText(/Smart Event Aware Parking Prediction System/i)).toBeInTheDocument();
}); 