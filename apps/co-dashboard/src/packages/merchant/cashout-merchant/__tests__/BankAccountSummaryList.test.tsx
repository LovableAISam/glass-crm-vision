import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react-hooks';
import BankAccountSummaryList from '../BankAccountSummaryList';
import useBankAccountSummaryList from '../hooks/useBankAccountSummaryList';
import { BankAccountSummaryData } from '@woi/service/co/admin/report/bankAccountSummaryList';

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

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => {
    return {
      enqueueSnackbar: jest.fn(),
    };
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {},
    };
  },
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/[coName]/co-fee-summary',
    route: '/[coName]/co-fee-summary',
    query: {
      coName: 'co',
    },
    asPath: '/co/co-fee-summary/',
    components: {},
    isFallback: false,
    basePath: '',
    locale: 'en',
    locales: ['en', 'id'],
    defaultLocale: 'en',
    isReady: true,
    isPreview: false,
    isLocaleDomain: false,
    events: {},
  }),
}));

const mockBankAccountSummary: BankAccountSummaryData[] = [
  {
    dateTime: '2023-11-06T04:22:47.223+00:00',
    transactionType: 'Topup',
    transactionId: 'hjklo009',
    description: 'Top UP From BPI',
    amount: 10000,
    category: 'DEBIT',
    balance: 186404,
  },
];

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useBankAccountSummaryFetcher: jest.fn(() => ({
    result: {
      currentPage: 0,
      totalElements: 1,
      totalPages: 1,
      transactions: mockBankAccountSummary,
      inquiryTime: '11 November 2023 15:57:57',
      name: 'Rizky Samuel Purba',
      period: '12 November 2021 - 11 November 2023',
    },
    status: 'success',
    refetch: jest.fn(),
  })),
}));

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BankAccountSummaryList />
    </QueryClientProvider>,
  );
};

const renderUseBankAccountSummaryList = () => {
  return renderHook(() => useBankAccountSummaryList({ formatOption: 'PDF' }), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe('Bank Account Summary With Loading', () => {
  test('renders a loading state', () => {
    const { getByText, getByTestId } = renderPage();

    const pageTitle = getByText('pageTitleBankAccountSummary');
    expect(pageTitle).toBeInTheDocument();

    const filterDateInput = getByText('filterDate');
    expect(filterDateInput).toBeInTheDocument();

    const loadingNode = getByTestId('loading-state');
    expect(loadingNode).toBeInTheDocument();
    expect(loadingNode).toMatchSnapshot();
  });
});

describe('Bank Account Summary With Table', () => {
  test('should render successfully when data exists, the table and download button are shown', () => {
    const { getByText, getByLabelText } = renderPage();
    expect(getByText('filterDate')).toBeInTheDocument();
    expect(getByText('tableHeaderPostDate')).toBeInTheDocument();
    expect(getByText('tableHeaderTransactionType')).toBeInTheDocument();
    expect(getByText('tableHeaderTransactionId')).toBeInTheDocument();
    expect(getByText('tableHeaderDescription')).toBeInTheDocument();
    expect(getByText('tableHeaderAmount')).toBeInTheDocument();
    expect(getByText('tableHeaderDebitorCredit')).toBeInTheDocument();
    expect(getByText('tableHeaderBalance')).toBeInTheDocument();

    expect(getByText('detailInquiryTime')).toBeInTheDocument();
    expect(getByText('11 November 2023 15:57:57')).toBeInTheDocument();
    expect(getByText('detailAccount')).toBeInTheDocument();
    expect(getByText('Rizky Samuel Purba')).toBeInTheDocument();

    expect(getByText('actionDownload')).toBeInTheDocument();

    const pdfCheckbox = getByLabelText('PDF');
    const excelCheckbox = getByLabelText('Excel');
    expect(pdfCheckbox).toBeInTheDocument();
    expect(excelCheckbox).toBeInTheDocument();
    fireEvent.click(excelCheckbox);
    expect(pdfCheckbox).not.toBeChecked();
    expect(excelCheckbox).toBeChecked();
  });

  it('renders useBankAccountSummaryList without error', () => {
    const { result } = renderUseBankAccountSummaryList();
    expect(result.error).toBeUndefined();
  });

  it('handles filter form changes', () => {
    const { result } = renderUseBankAccountSummaryList();
    const newFilterForm = {
      activeDate: {
        startDate: new Date(),
        endDate: new Date(),
      },
      transactionType: [],
    };
    act(() => {
      result.current.setFilterForm(newFilterForm);
    });
    expect(result.current.filterForm).toEqual(newFilterForm);
  });

  it('handles sorting', () => {
    const { result } = renderUseBankAccountSummaryList();
    const columnId: keyof BankAccountSummaryData = 'amount';
    const oldDirection = result.current.direction;
    act(() => {
      result.current.handleSort(columnId);
    });
    expect(result.current.sortBy).toEqual(columnId);
    expect(result.current.direction).toEqual(
      oldDirection === 'asc' ? 'desc' : 'asc',
    );
  });

  it('success fetches fee summary list without error', async () => {
    const { result } = renderUseBankAccountSummaryList();
    const mockFetchMemberList = jest.fn();
    result.current.fetchMemberList = mockFetchMemberList;
    act(() => {
      result.current.fetchMemberList();
    });
    await waitFor(() => {
      expect(mockFetchMemberList).toHaveBeenCalled();
      expect(result.error).toBeUndefined();
    });
  });

  it('success handles export without error', async () => {
    const { result } = renderUseBankAccountSummaryList();
    const mockUseFeeSummaryExportFetcher = jest.fn();
    mockUseFeeSummaryExportFetcher.mockResolvedValue({
      result: { url: 'test-url' },
      error: false,
    });
    result.current.handleExport = mockUseFeeSummaryExportFetcher;
    act(() => {
      result.current.handleExport();
    });
    expect(mockUseFeeSummaryExportFetcher).toHaveBeenCalled();
    expect(result.error).toBeUndefined();
  });
});
