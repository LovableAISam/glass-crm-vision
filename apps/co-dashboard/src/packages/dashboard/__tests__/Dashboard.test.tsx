import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import Dashboard from '../Dashboard';

const queryCache = new QueryCache();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  },
  queryCache,
});

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {},
    };
  },
}));

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>,
  );
};

describe('Dashboard', () => {
  test('should render successfully', () => {
    renderPage();

    expect(screen.getByText('Quick Widgets')).toBeInTheDocument();
    expect(screen.getByText('Users Statistic')).toBeInTheDocument();
    expect(screen.getByText('Registered Merchant')).toBeInTheDocument();
    expect(screen.getByText('Total Transaction')).toBeInTheDocument();
    expect(screen.getByText('Recent Notification')).toBeInTheDocument();
  });
});
