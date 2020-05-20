import React from 'react';
import { act } from 'react-dom/test-utils';

import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
const fetchMock = require('fetch-mock-jest');
import App from './App';


fetchMock.config.overwriteRoutes = true;
fetchMock.config.sendAsJson = true;

test("does nothing", async () => {
  fetchMock.get("/booking/", {
    rows: [[]],
  });
  render(<App />);

  await waitFor(() => {
    expect(screen.getByTestId('button-grid-div')).toHaveStyle('filter: none');
  });
});

test("render rows", async () => {
  fetchMock.get("/booking/", {
    rows: [
      [{number: 1, available: true, selected: false},
        {number: 2, available: true, selected: true}],
      [{number: 3, available: false, selected: false},
        {number: 4, available: true, selected: false}],
    ],
  });
  render(<App />);

  await waitFor(() => screen.getByText(/1/i, {selector: 'button'}));
  expect(screen.getByText(/1/, {selector: 'button'})).toHaveClass('btn-light');
  expect(screen.getByText(/x/, {selector: 'button'})).toHaveClass('btn-secondary');
  expect(screen.getByText(/2/, {selector: 'button'})).toHaveClass('btn-light');
  expect(screen.getByText(/2/, {selector: 'button'})).toHaveClass('active');
});

test("click to select", async () => {
  fetchMock.get("/booking/", {
    rows: [
      [{number: 1, available: true, selected: false},
        {number: 2, available: true, selected: false}],
      [{number: 3, available: false, selected: false},
        {number: 4, available: true, selected: false}],
    ],
  });
  render(<App/>);

  await waitFor(() => screen.getByText(/1/i, {selector: 'button'}));
  expect(screen.getByText(/1/, {selector: 'button'})).not.toHaveClass('active');
  fireEvent.click(screen.getByText(/1/, {selector: 'button'}));
  expect(screen.getByText(/1/, {selector: 'button'})).toHaveClass('active');
  fireEvent.click(screen.getByText(/1/, {selector: 'button'}));
  expect(screen.getByText(/1/, {selector: 'button'})).not.toHaveClass('active');
});

test("book", async () => {
  fetchMock.get("/booking/", {
    rows: [
      [{number: 1, available: true, selected: false},
        {number: 2, available: true, selected: false}],
      [{number: 3, available: false, selected: false},
        {number: 4, available: true, selected: false}],
    ],
  }).post('/booking/', {});
  render(<App/>);

  await waitFor(() => screen.getByText(/1/i, {selector: 'button'}));
  expect(screen.getByText(/1/, {selector: 'button'})).not.toHaveClass('active');
  fireEvent.click(screen.getByText(/1/, {selector: 'button'}));
  expect(screen.getByText(/1/, {selector: 'button'})).toHaveClass('active');

  fireEvent.change(screen.getByPlaceholderText(/First name/, {selector: 'input'}), { target: { value: 'abc'}});
  fireEvent.click(screen.getByText(/Book/, {selector: 'button'}));
  await waitFor(() => {
    expect(screen.getByTestId('button-grid-div')).toHaveStyle('filter: none');
  });

  expect(fetchMock.lastOptions('/booking/', {method: 'POST'}).body).toBe(JSON.stringify({
    book_seats: [1],
    booking: {
      first_name: 'abc',
      last_name: '',
      phone: '',
      email: ''
    }
  }));
});
