import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import AccountRuleManagementList from '@src/packages/account-rule-management/AccountRuleManagementList';

// Query Client Config
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

describe('Account rule management', () => {
  it('renders a loading state', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AccountRuleManagementList />
      </QueryClientProvider>,
    );

    const loadingNode = screen.getByTestId('loading-state');
    expect(loadingNode).toBeInTheDocument();
    expect(loadingNode).toMatchSnapshot();

    // Memeriksa apakah judul halaman ada
    const pageTitle = screen.getByText('pageTitleCOFeeSummary');
    expect(pageTitle).toBeInTheDocument();
  });
});
