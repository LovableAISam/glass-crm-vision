import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react-hooks';
import COTransactionSummaryList from '../COTransactionSummaryList';
import useTransactionSummaryList from '../hooks/useTransactionSummaryList';
import { TransactionSummaryData } from '@woi/service/co/transaction/transactionSummary/transactionSummaryList';
import { ResponseTransactionSummaryDetail } from '@woi/service/co/admin/report/transactionSummaryDetail';
import useTransactionSummaryDetail from '../hooks/useTransactionSummaryDetail';
import { PaginationData } from '@woi/core/api';
import { TransactionHistoryData } from '@woi/service/co/transaction/transactionHistory/transactionHistoryList';

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
    pathname: '/[coName]/co-transaction-summary',
    route: '/[coName]/co-transaction-summary',
    query: {
      coName: 'co',
    },
    asPath: '/co/co-transaction-summary/',
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

export const mockTransactionSummaryList: TransactionSummaryData[] = [
  {
    id: '1234567890',
    amount: 105.5,
    bacnetIsorc: 'ABC123',
    balance: 500.75,
    billerFee: '10.00',
    createdDate: '2023-11-15T10:00:00',
    dateTime: '2023-12-15T12:30:00',
    description: 'Payment for goods',
    merchantName: 'Example Merchant',
    modifiedDate: '2023-11-15T14:45:00',
    orderId: 'ORDER123',
    paymentMethod: 'Credit Card',
    receiverNumber: '9876543222',
    referralNumber: 'REF123',
    rmNumber: 'RM456',
    secondaryIdentifier: 'SecondaryID',
    senderNumber: '123456689',
    status: 'Completed',
    totalAmount: 110.5,
    traceNumber: 'TRACE789',
    transactionHistoryId: 'HISTORY123',
    transactionNumber: 'TRANS456',
    transactionType: 'ADD_MONEY_VIA_SAVING_ACCOUNT',
  },
];

const mockTransactionSummaryDetail: ResponseTransactionSummaryDetail = {
  dateTime: '2023-11-15T12:30:00',
  transactionType: 'Transfer',
  vaSource: '12345678910',
  vaDestination: '987654321321',
  principalAmount: 100.5,
  status: 'Completed',
  fee: 5.0,
  transactionNumber: 'TRANS123',
  referenceNumber: 'REF456',
  paymentMethod: 'ADD_MONEY_VIA_SAVING_ACCOUNT',
  bnisorc: 789,
  sourceRm: 'RM45356',
  primaryIdentifier: 'PrimaryID',
  secondaryIdentifier: 456,
  tertiaryIdentifier: 789758,
  searchResult: [
    {
      dateTime: '2023-10-15T12:30:00',
      type: 'REQUEST_MONEY',
      vaSource: '123456789',
      vaDestination: '987654321',
      amount: 104.5,
      status: 'Completed',
      category: 'General',
      balance: 500,
      referenceNumber: 'REF123',
      referralNumber: 123,
      beneficiaryAccountNumber: '876543210',
    },
  ],
  orderNumberRoyalty: 'ORDER789',
  billerFee: '2.50',
  bankFee: '1.00',
  traceNumber: 'TRACE321',
};

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useTransactionSummaryFetcher: jest.fn(() => ({
    result: {
      currentPage: 0,
      totalElements: 1,
      totalPages: 1,
      transactions: mockTransactionSummaryList,
    },
    status: 'success',
    refetch: jest.fn(),
  })),
  useTransactionSummaryDetailFetcher: jest.fn(() => ({
    result: {
      ...mockTransactionSummaryDetail,
    },
    status: 'success',
    refetch: jest.fn(),
  })),
}));

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <COTransactionSummaryList />
    </QueryClientProvider>,
  );
};

const mockApiExport = jest.fn();
const mockHandleExport = async () => {
  await mockApiExport();
};
const renderUseMemberSummaryList = () => {
  return renderHook(
    () => {
      const original = useTransactionSummaryList({ formatOption: 'PDF' });
      jest.spyOn(original, 'handleExport').mockReturnValue(mockHandleExport());
      return original;
    },
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    },
  );
};

const renderUseMemberSummaryDetail = () => {
  return renderHook(
    () =>
      useTransactionSummaryDetail({
        selectedData: mockTransactionSummaryList[0],
      }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    },
  );
};

describe('CO Transaction Summary With Loading', () => {
  test('renders a loading state', () => {
    const { getByText, getByTestId } = renderPage();

    const pageTitle = getByText('pageTitleQrisReport');
    expect(pageTitle).toBeInTheDocument();

    expect(getByText('filterDate')).toBeInTheDocument();
    expect(getByText('filterUpgradeStatus')).toBeInTheDocument();
    expect(getByText('filterTransactionType')).toBeInTheDocument();

    const loadingNode = getByTestId('loading-state');
    expect(loadingNode).toBeInTheDocument();
    expect(loadingNode).toMatchSnapshot();
  });
});

describe('CO Transaction Summary With Table', () => {
  test('should render successfully when data exists, the table and download button are shown', () => {
    const { getByText, getByLabelText } = renderPage();

    expect(getByText('filterDate')).toBeInTheDocument();
    expect(getByText('filterUpgradeStatus')).toBeInTheDocument();
    expect(getByText('filterTransactionType')).toBeInTheDocument();

    expect(getByText('tableHeaderDate')).toBeInTheDocument();
    expect(getByText('tableHeaderTransactionType')).toBeInTheDocument();
    expect(getByText('tableHeaderPaymentMethod')).toBeInTheDocument();
    expect(getByText('tableHeaderFrom')).toBeInTheDocument();
    expect(getByText('tableHeaderRMNumber')).toBeInTheDocument();
    expect(getByText('tableHeaderTo')).toBeInTheDocument();
    expect(getByText('tableHeaderMerchantName')).toBeInTheDocument();
    expect(getByText('tableHeaderAmount')).toBeInTheDocument();
    expect(getByText('tableHeaderStatus')).toBeInTheDocument();
    expect(getByText('tableHeaderTransactionNumber')).toBeInTheDocument();
    expect(getByText('tableHeaderOrderID')).toBeInTheDocument();
    expect(getByText('tableHeaderBalance')).toBeInTheDocument();
    expect(getByText('tableHeaderSecondaryIdentifier')).toBeInTheDocument();
    expect(getByText('tableHeaderTraceNumber')).toBeInTheDocument();
    expect(getByText('tableHeaderBillerFee')).toBeInTheDocument();
    expect(getByText('tableHeaderTotalAmount')).toBeInTheDocument();
    expect(getByText('tableHeaderAction')).toBeInTheDocument();
    expect(getByText('tableActionDetail')).toBeInTheDocument();

    expect(getByText('15 December 2023 12:30:00')).toBeInTheDocument();
    expect(getByText('optionAddMoneySaving')).toBeInTheDocument();
    expect(getByText('Credit Card')).toBeInTheDocument();
    expect(getByText('123456689')).toBeInTheDocument();
    expect(getByText('RM456')).toBeInTheDocument();
    expect(getByText('9876543222')).toBeInTheDocument();
    expect(getByText('Example Merchant')).toBeInTheDocument();
    expect(getByText('Completed')).toBeInTheDocument();
    expect(getByText('TRANS456')).toBeInTheDocument();
    expect(getByText('ORDER123')).toBeInTheDocument();
    expect(getByText('SecondaryID')).toBeInTheDocument();
    expect(getByText('TRACE789')).toBeInTheDocument();
    expect(getByText('10.00')).toBeInTheDocument();

    const pdfCheckbox = getByLabelText('PDF');
    const excelCheckbox = getByLabelText('Excel');
    expect(pdfCheckbox).toBeInTheDocument();
    expect(excelCheckbox).toBeInTheDocument();
    fireEvent.click(excelCheckbox);
    expect(pdfCheckbox).not.toBeChecked();
    expect(excelCheckbox).toBeChecked();
    expect(getByText('actionDownload')).toBeInTheDocument();
  });

  it('renders useMemberSummaryList without error and give the same value', () => {
    const { result } = renderUseMemberSummaryList();
    expect(result.error).toBeUndefined();

    expect(result.current.transactionSummaryData).toEqual(
      mockTransactionSummaryList,
    );
  });

  it('handles filter form changes', () => {
    const { result } = renderUseMemberSummaryList();
    const newFilterForm = {
      upgradeStatus: [],
      activeDate: {
        startDate: new Date(),
        endDate: new Date(),
      },
      transactionType: [],
      bank: [],
    };

    act(() => {
      result.current.setFilterForm(newFilterForm);
    });

    expect(result.current.filterForm).toEqual(newFilterForm);
  });

  it('handles pagination', async () => {
    const { result } = renderUseMemberSummaryList();
    const mockNewPaginationData: PaginationData = {
      currentPage: 1,
      limit: 10,
      totalPages: 2,
      totalElements: 20,
    };

    act(() => {
      result.current.setPagination(mockNewPaginationData);
    });
    expect(result.current.pagination).toEqual(mockNewPaginationData);
  });

  it('handles sorting', () => {
    const { result } = renderUseMemberSummaryList();
    const columnId: keyof TransactionSummaryData = 'amount';
    const oldDirection = result.current.direction;

    act(() => {
      result.current.handleSort(columnId);
    });

    expect(result.current.sortBy).toEqual(columnId);
    expect(result.current.direction).toEqual(
      oldDirection === 'asc' ? 'desc' : 'asc',
    );
  });

  it('success fetches transaction summary list without error', async () => {
    const { result } = renderUseMemberSummaryList();

    const mockFetchMemberList = jest.fn();
    result.current.fetchTransactionList = mockFetchMemberList;

    act(() => {
      result.current.fetchTransactionList();
    });

    await waitFor(() => {
      expect(mockFetchMemberList).toHaveBeenCalled();
      expect(result.error).toBeUndefined();
    });
  });

  test('handleExport is called when tableActionDetail button is clicked', async () => {
    const { getByText } = renderPage();
    const detailButton = getByText('tableActionDetail');
    fireEvent.click(detailButton);

    expect(mockApiExport).toHaveBeenCalled();
  });

  test('the modal detail should render successfully when data exists, and the user clicks the transaction detail button. in this scenario, the modal displays the detailed transaction data', () => {
    renderPage();
    fireEvent.click(screen.getByText('tableActionDetail'));

    expect(screen.getByText('detailDate')).toBeInTheDocument();
    expect(screen.getByText('15 November 2023 12:30:00')).toBeInTheDocument();

    expect(screen.getByText('detailTransactionType')).toBeInTheDocument();
    expect(screen.getByText('optionAddMoneySaving')).toBeInTheDocument();

    expect(screen.getByText('detailVASource')).toBeInTheDocument();
    expect(screen.getByText('12345678910')).toBeInTheDocument();

    expect(screen.getByText('detailVADestination')).toBeInTheDocument();
    expect(screen.getByText('987654321321')).toBeInTheDocument();

    expect(screen.getByText('detailPrincipalAmount')).toBeInTheDocument();

    expect(screen.getByText('detailStatus')).toBeInTheDocument();

    expect(screen.getByText('detailFeeComision')).toBeInTheDocument();

    expect(screen.getByText('detailReferenceNumber')).toBeInTheDocument();
    expect(screen.getByText('REF456')).toBeInTheDocument();

    expect(screen.getByText('detailTransactionNumber')).toBeInTheDocument();
    expect(screen.getByText('TRANS123')).toBeInTheDocument();

    expect(screen.getByText('detailPaymentMethod')).toBeInTheDocument();
    expect(screen.getByText('Credit Card')).toBeInTheDocument();

    expect(screen.getByText('detailOrderNumberRoyalty')).toBeInTheDocument();
    expect(screen.getByText('ORDER789')).toBeInTheDocument();

    expect(screen.getByText('detailBnisorcResponse')).toBeInTheDocument();
    expect(screen.getByText('789')).toBeInTheDocument();

    expect(screen.getByText('detailSourceRM')).toBeInTheDocument();
    expect(screen.getByText('RM45356')).toBeInTheDocument();

    expect(screen.getByText('detailPrimaryIdentifier')).toBeInTheDocument();
    expect(screen.getByText('PrimaryID')).toBeInTheDocument();

    expect(screen.getByText('detailSecondaryIdentifier')).toBeInTheDocument();
    expect(screen.getByText('456')).toBeInTheDocument();

    expect(screen.getByText('detailTertiaryIdentifier')).toBeInTheDocument();
    expect(screen.getByText('789758')).toBeInTheDocument();

    expect(screen.getByText('detailBillerFee')).toBeInTheDocument();
    expect(screen.getByText('2.50')).toBeInTheDocument();

    expect(screen.getByText('detailBankFee')).toBeInTheDocument();
    expect(screen.getByText('1.00')).toBeInTheDocument();

    expect(screen.getByText('detailTraceNumber')).toBeInTheDocument();
    expect(screen.getByText('TRACE321')).toBeInTheDocument();

    expect(screen.getByText('tableHeaderVASource')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderVADest')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderDrCr')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderReferenceNo')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderReferralNumber')).toBeInTheDocument();
    expect(
      screen.getByText('tableHeaderBeneficiaryAccount'),
    ).toBeInTheDocument();

    expect(screen.getByText('15 October 2023 12:30:00')).toBeInTheDocument();
    expect(screen.getByText('optionRequestMoney')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('987654321')).toBeInTheDocument();
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('REF123')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('876543210')).toBeInTheDocument();
  });

  it('renders useMemberSummaryDetail without error and give the same value', () => {
    const { result } = renderUseMemberSummaryDetail();
    expect(result.error).toBeUndefined();

    expect(result.current.transactionSummaryDetail).toEqual(
      mockTransactionSummaryDetail,
    );
    expect(result.current.transactionSummaryData).toEqual(
      mockTransactionSummaryDetail.searchResult,
    );
  });

  it('success fetches transaction summary transaction list without error', async () => {
    const { result } = renderUseMemberSummaryDetail();

    const mockFetchMemberList = jest.fn();
    result.current.fetchTransactionSummaryDetail = mockFetchMemberList;

    act(() => {
      result.current.fetchTransactionSummaryDetail();
    });

    expect(mockFetchMemberList).toHaveBeenCalled();
    expect(result.error).toBeUndefined();
  });

  it('handles sorting detail table transaction list', () => {
    const { result } = renderUseMemberSummaryDetail();
    const columnId: keyof TransactionHistoryData = 'date';
    const oldDirection = result.current.direction;

    act(() => {
      result.current.handleSort(columnId);
    });

    expect(result.current.sortBy).toEqual(columnId);
    expect(result.current.direction).toEqual(
      oldDirection === 'asc' ? 'desc' : 'asc',
    );
  });
});
