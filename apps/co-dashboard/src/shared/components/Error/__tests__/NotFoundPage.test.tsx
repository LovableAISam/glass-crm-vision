import React from 'react';
import { render, screen } from '@testing-library/react';

import NotFoundPage from '../NotFoundPage';

describe('Account rule management', () => {
  it('renders a text title text', () => {
    render(
      <NotFoundPage />
    );

    const text = screen.getByText('404. Not Found!');
    expect(text).toBeInTheDocument();
    expect(text).toMatchSnapshot();
  });

  it('renders a text description text', () => {
    render(
      <NotFoundPage />
    );

    const text = screen.getByText('Hi, This page not found. please contact our CS!');
    expect(text).toBeInTheDocument();
    expect(text).toMatchSnapshot();
  });
});