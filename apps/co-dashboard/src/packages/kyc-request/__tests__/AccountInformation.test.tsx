import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-hooks';
import createDummy from '@woi/core/utils/dummy';
import AccountInformation from '../components/ViewKYCRequest/content/AccountInformation';
import { ConfirmationDialogProvider } from '@woi/web-component';
import useActivityMemberHistoryList from '../hooks/useActivityMemberHistoryList';
import { TransactionHistoryData } from '@woi/service/co/transaction/transactionHistory/transactionHistoryList';
import { useTransactionHistoryExportFetcher } from '@woi/service/co';

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

jest.mock('axios');

jest.mock('@woi/core/api/handleResponse', () => ({
  __esModule: true,
  default: { response: {}, result: {} },
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {
      coName: 'co',
    },
    push: jest.fn(),
    route: '',
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

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: jest.fn(() => ({
    enqueueSnackbar: jest.fn(),
  })),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {},
    };
  },
}));

const mockHistoryData: any = {
  account: '123456789',
  date: '2023-11-23T12:30:00Z',
  amount: 500,
  transactionType: {
    id: 1,
    code: 'T001',
    name: 'Transfer',
  },
  transactionCategory: {
    id: 101,
    name: 'General',
    isRepeatable: false,
  },
  transactionMethod: {
    id: 201,
    code: 'TM001',
    name: 'Bank Transfer',
  },
  status: 'SUCCESS',
  referenceId: 'TXN123456789',
  description: 'Transfer from John Doe',
  successDate: '2023-11-23T12:31:00Z',
  vaDest: '',
  transfer: null,
  deposit: null,
  withdraw: null,
  isDebit: true,
  balance: 1500,
  activityId: 'ACT123456789',
};
let mockKycPremiumMemberData = createDummy(1).map(() => mockHistoryData);

const mockRefect = jest.fn();

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useTransactionHistoryListFetcher: jest.fn(() => ({
    result: {
      currentPage: 0,
      totalElements: 20,
      totalPages: 2,
      data: mockKycPremiumMemberData,
    },
    status: 'success',
    refetch: mockRefect,
  })),
  useAccountStatementBalanceFetcher: jest.fn(() => ({
    result: {
      code: 'SUCCESS',
      message: 'Request berhasil.',
      data: {
        balance: 1000,
      },
      errors: null,
      serverTime: 1637700000,
    },
    status: 'success',
    refetch: mockRefect,
  })),
  useTransactionHistoryExportFetcher: jest.fn(() => ({
    result: { data: { url: 'test-url' } },
    error: false,
  })),
}));

jest.mock('../hooks/useActivityMemberHistoryList', () => ({
  __esModule: true,
  default: (props: { phoneNumber: '082208220822' }) => ({
    ...jest
      .requireActual('../hooks/useActivityMemberHistoryList')
      .default(props),
    pagination: {
      currentPage: 0,
      limit: 10,
      totalPages: 3,
      totalElements: 25,
    },
    activityMemberHistoryStatus: 'success',
    activityMemberHistoryData: mockKycPremiumMemberData,
  }),
}));

const mockPropsAccountInformation = {
  activeTab: 0,
  kycDetail: null,
  memberDetail: null,
};

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ConfirmationDialogProvider>
        <AccountInformation {...mockPropsAccountInformation} />
      </ConfirmationDialogProvider>
    </QueryClientProvider>,
  );
};

const renderUseActivityMemberHistoryList = () => {
  return renderHook(
    () => useActivityMemberHistoryList({ phoneNumber: '085207520752' }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    },
  );
};

describe('page account information', () => {
  test('renders a loading state', () => {
    const { getByText, unmount } = renderPage();

    const pageTitle = getByText('accountInformationCOCode');
    expect(pageTitle).toBeInTheDocument();

    const buttonSeeTrx = getByText(
      'accountInformationActionSeeTransactionDetail',
    );
    expect(buttonSeeTrx).toBeInTheDocument();
    fireEvent.click(buttonSeeTrx);

    unmount();
  });

  test('renders with data table with amount', () => {
    const { getByText, unmount } = renderPage();

    const buttonSeeTrx = getByText(
      'accountInformationActionSeeTransactionDetail',
    );
    expect(buttonSeeTrx).toBeInTheDocument();
    fireEvent.click(buttonSeeTrx);

    unmount();
  });

  test('renders with data table with withdraw', () => {
    mockKycPremiumMemberData = createDummy(1).map(() => ({
      ...mockHistoryData,
      amount: null,
      withdraw: {
        withdrawAmount: 1000,
      },
    }));
    const { getByText, unmount } = renderPage();

    const buttonSeeTrx = getByText(
      'accountInformationActionSeeTransactionDetail',
    );
    expect(buttonSeeTrx).toBeInTheDocument();
    fireEvent.click(buttonSeeTrx);

    unmount();
  });

  test('renders with data table with deposit', () => {
    mockKycPremiumMemberData = createDummy(1).map(() => ({
      ...mockHistoryData,
      amount: null,
      deposit: {
        depositAmount: 1000,
      },
    }));
    const { getByText, unmount } = renderPage();

    const buttonSeeTrx = getByText(
      'accountInformationActionSeeTransactionDetail',
    );
    expect(buttonSeeTrx).toBeInTheDocument();
    fireEvent.click(buttonSeeTrx);

    unmount();
  });

  test('renders with data table with transfer', () => {
    mockKycPremiumMemberData = createDummy(1).map(() => ({
      ...mockHistoryData,
      amount: null,
      transfer: {
        transferAmount: 1000,
      },
    }));
    const { getByText, unmount } = renderPage();

    const buttonSeeTrx = getByText(
      'accountInformationActionSeeTransactionDetail',
    );
    expect(buttonSeeTrx).toBeInTheDocument();
    fireEvent.click(buttonSeeTrx);

    unmount();
  });

  test('renders with data table with no amount', () => {
    mockKycPremiumMemberData = createDummy(1).map(() => ({
      ...mockHistoryData,
      amount: null,
    }));
    const { getByText, unmount } = renderPage();

    const buttonSeeTrx = getByText(
      'accountInformationActionSeeTransactionDetail',
    );
    expect(buttonSeeTrx).toBeInTheDocument();
    fireEvent.click(buttonSeeTrx);

    unmount();
  });

  it('handle change pagination', () => {
    const { unmount } = renderPage();

    const buttonSeeTrx = screen.getByText(
      'accountInformationActionSeeTransactionDetail',
    );
    expect(buttonSeeTrx).toBeInTheDocument();
    fireEvent.click(buttonSeeTrx);

    const buttonNext = screen.getByLabelText('Go to next page');
    expect(buttonNext).toBeInTheDocument();

    fireEvent.click(buttonNext);

    unmount();
  });
});

describe('hook account information', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = renderUseActivityMemberHistoryList();
  });

  afterEach(() => {
    wrapper.unmount();
  });
  it('success renders useActivityMemberHistoryList without error', () => {
    const { result } = wrapper;
    expect(result.error).toBeUndefined();
  });

  it('handle getSortPayload', () => {
    const { result } = wrapper;

    let resultSortPayload = '';

    act(() => {
      resultSortPayload = result.current.getSortPayload('transactionCategory');
    });
    expect(resultSortPayload).toEqual('transactionCategory');

    act(() => {
      resultSortPayload = result.current.getSortPayload('transactionType');
    });
    expect(resultSortPayload).toEqual('transaction.transactionTypeName');

    act(() => {
      resultSortPayload = result.current.getSortPayload('transactionMethod');
    });
    expect(resultSortPayload).toEqual('transaction.transactionMethodName');

    act(() => {
      resultSortPayload = result.current.getSortPayload('referenceId');
    });
    expect(resultSortPayload).toEqual('transaction.referenceId');

    act(() => {
      resultSortPayload = result.current.getSortPayload('account');
    });
    expect(resultSortPayload).toEqual(
      'transaction.accountStatementHistories.phoneNumber',
    );
  });

  it('handles sorting', () => {
    const { result } = wrapper;
    const columnId: keyof TransactionHistoryData = 'balance';
    const oldDirection = result.current.direction;
    act(() => {
      result.current.handleSort(columnId);
    });
    expect(result.current.sortBy).toEqual(columnId);
    expect(result.current.direction).toEqual(
      oldDirection === 'asc' ? 'desc' : 'asc',
    );
  });

  it('success handles export without error', async () => {
    const { result } = wrapper;
    act(() => {
      result.current.handleExport();
    });

    expect(useTransactionHistoryExportFetcher).toHaveBeenCalled();
    expect(result.error).toBeUndefined();
  });
});
