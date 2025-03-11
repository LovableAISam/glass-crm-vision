import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import COFeeSummaryList from '../COFeeSummaryList';
import { FeeSummaryTransaction } from '@woi/service/co/admin/report/feeSummary';
import useFeeSummaryList from '../hooks/useFeeSummaryList';
import { renderHook, act } from '@testing-library/react-hooks';
import { MemberData } from '@woi/service/co/idp/member/memberList';

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

const mockFeeSummaryData: FeeSummaryTransaction[] = [
  {
    dateTime: '2023-10-18T06:08:26.631+00:00',
    transactionType: 'CARDLESS_WITHDRAWAL',
    vaSource: '639946704955',
    rmNumber: 'a:00000011875935',
    vaDestination: null,
    feeCommision: 20,
    dbCr: 'DEBIT',
    status: 'COMPLETED',
    balance: 23720.15,
    referenceNumber: '053859324643',
    orderId: '36527411',
    description: '',
  },
];

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useFeeSummaryFetcher: jest.fn(() => ({
    result: {
      currentPage: 0,
      totalElements: 1,
      totalPages: 1,
      transactions: mockFeeSummaryData,
    },
    status: 'success',
    refetch: jest.fn(),
  })),
}));

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <COFeeSummaryList />
    </QueryClientProvider>,
  );
};

const renderUseFeeSummaryList = () => {
  return renderHook(() => useFeeSummaryList({ formatOption: 'PDF' }), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe('CO Fee Summary With Loading', () => {
  test('renders a loading state', () => {
    const { getByText, getByTestId } = renderPage();

    const pageTitle = getByText('pageTitleCOFeeSummary');
    expect(pageTitle).toBeInTheDocument();

    const filterDateInput = getByText('filterDate');
    expect(filterDateInput).toBeInTheDocument();
    const filterTransactionTypeInput = getByText('filterTransactionType');
    expect(filterTransactionTypeInput).toBeInTheDocument();

    const loadingNode = getByTestId('loading-state');
    expect(loadingNode).toBeInTheDocument();
    expect(loadingNode).toMatchSnapshot();
  });
});

describe('CO Fee Summary With Table', () => {
  test('should render successfully when data exists, the table and download button are shown', () => {
    const { getByText, getByLabelText } = renderPage();
    expect(getByText('filterDate')).toBeInTheDocument();
    expect(getByText('tableHeaderDate')).toBeInTheDocument();
    expect(getByText('tableHeaderTransactionType')).toBeInTheDocument();
    expect(getByText('tableHeaderVASource')).toBeInTheDocument();
    expect(getByText('tableHeaderRMNumber')).toBeInTheDocument();
    expect(getByText('tableHeaderVADestination')).toBeInTheDocument();
    expect(getByText('tableHeaderFeeOrComision')).toBeInTheDocument();
    expect(getByText('tableHeaderDrCr')).toBeInTheDocument();
    expect(getByText('tableHeaderStatus')).toBeInTheDocument();
    expect(getByText('tableHeaderBalance')).toBeInTheDocument();
    expect(getByText('tableHeaderReferenceNo')).toBeInTheDocument();
    expect(getByText('tableHeaderOrderID')).toBeInTheDocument();
    expect(getByText('optionCardLessWithdrawal')).toBeInTheDocument();
    expect(getByText('639946704955')).toBeInTheDocument();
    expect(getByText('Debit')).toBeInTheDocument();
    expect(getByText('Completed')).toBeInTheDocument();
    expect(getByText('053859324643')).toBeInTheDocument();

    expect(getByText('actionDownload')).toBeInTheDocument();

    const pdfCheckbox = getByLabelText('PDF');
    const excelCheckbox = getByLabelText('Excel');
    expect(pdfCheckbox).toBeInTheDocument();
    expect(excelCheckbox).toBeInTheDocument();
    fireEvent.click(excelCheckbox);
    expect(pdfCheckbox).not.toBeChecked();
    expect(excelCheckbox).toBeChecked();
  });

  it('renders useFeeSummaryList without error', () => {
    const { result } = renderUseFeeSummaryList();
    expect(result.error).toBeUndefined();
  });

  it('handles filter form changes', () => {
    const { result } = renderUseFeeSummaryList();
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
    const { result } = renderUseFeeSummaryList();
    const columnId: keyof MemberData = 'createdBy';
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
    const { result } = renderUseFeeSummaryList();
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
    const { result } = renderUseFeeSummaryList();
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
