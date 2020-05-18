import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('the click', async () => {
  const { getByText } = render(<App />);
  fireEvent.click(screen.getByText('Learn React'));
});