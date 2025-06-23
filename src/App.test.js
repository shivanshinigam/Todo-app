import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header', () => {
  render(<App />);
  const headerElement = screen.getByText(/personal to-do app/i);
  expect(headerElement).toBeInTheDocument();
});
