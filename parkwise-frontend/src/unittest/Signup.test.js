import { render, screen } from '@testing-library/react';
import Signup from '../pages/Signup';

test('renders signup form', () => {
  render(<Signup />);
  expect(screen.getByText(/Get Started with ParkWise/i)).toBeInTheDocument();
}); 