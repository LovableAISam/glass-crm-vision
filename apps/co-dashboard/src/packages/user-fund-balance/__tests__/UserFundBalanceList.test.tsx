import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-hooks';
import UserFundBalanceList from '../UserFundBalanceList';
import useUserFundBalanceList from '../hooks/useUserFundBalanceList';
import createDummy from '@woi/core/utils/dummy';
import { userFundBalanceFetcher } from '@woi/service/co';
import { UserFundBalanceData } from '@woi/service/co/admin/report/userFundBalanceList';

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
    pathname: '/[coName]/',
    route: '/[coName]/',
    query: {
      coName: 'co',
    },
    asPath: '/co//',
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

const mockUserFundBalanceData: UserFundBalanceData = {
  enrollmentDate: '2022-01-01',
  id: 1,
  lastMonthCashInBpi: 5000,
  lastMonthCashInNonBpi: 3000,
  lastMonthFundBalance: 15000,
  lastWeekCashInBpi: 1000,
  lastWeekCashInNonBpi: 500,
  lastWeekFundBalance: 12000,
  numLinkBank: '1234',
  numLinkCredit: '5678',
  numLinkDebit: '9012',
  numLinkWallet: '3456',
  phoneNumber: '123-456-7890',
  reportDateFundBalance: 16000,
  rmNumber: 'RM123456',
  startOfYearFundBalance: 18000,
  thisWeekCashInBpi: 2000,
  thisWeekCashInNonBpi: 1000,
  totalCashInBpi: 8000,
  totalCashInNonBpi: 4500,
  type: 'LITE',
  ytdBpi: 10000,
  ytdNonBpi: 6000,
};

let mockUserFundBalanceDataList = createDummy(0).map(
  () => mockUserFundBalanceData,
);

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  userFundBalanceFetcher: jest.fn(() => ({
    result: {
      currentPage: 0,
      totalElements: 1,
      totalPages: 1,
      fundBalanceLists: mockUserFundBalanceDataList,
    },
    status: 'success',
    refetch: jest.fn(),
  })),
}));

jest.mock('../hooks/useUserFundBalanceList', () => ({
  __esModule: true,
  default: () => ({
    ...jest.requireActual('../hooks/useUserFundBalanceList').default(),
    pagination: {
      currentPage: 0,
      limit: 10,
      totalPages: 3,
      totalElements: 25,
    },
    userFundBalanceData: mockUserFundBalanceDataList,
  }),
}));

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <UserFundBalanceList />
    </QueryClientProvider>,
  );
};

const renderUseUserFundBalanceList = () => {
  return renderHook(() => useUserFundBalanceList(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe('user fund balance list', () => {
  test('renders a loading state', () => {
    const { getByText, getByTestId, unmount } = renderPage();

    const pageTitle = getByText('pageTitleUserFundBalance');
    expect(pageTitle).toBeInTheDocument();

    expect(getByText('pageTitleUserFundBalance')).toBeInTheDocument();
    expect(getByText('filterUserId')).toBeInTheDocument();
    expect(getByText('filterRMNumber')).toBeInTheDocument();
    expect(getByText('filterMobileNumber')).toBeInTheDocument();

    const loadingNode = getByTestId('loading-state');
    expect(loadingNode).toBeInTheDocument();
    expect(loadingNode).toMatchSnapshot();

    unmount();
  });

  test('renders empty state', () => {
    const { getByText, unmount } = renderPage();

    const pageTitle = getByText('pageTitleUserFundBalance');
    expect(pageTitle).toBeInTheDocument();

    expect(getByText('tableEmptyTitle')).toBeInTheDocument();
    expect(getByText('tableEmptyDescription')).toBeInTheDocument();

    unmount();
  });

  test('should render successfully when data exists, the table and download button are shown', () => {
    mockUserFundBalanceDataList = createDummy(10).map(
      () => mockUserFundBalanceData,
    );
    const { getByText, unmount } = renderPage();

    expect(getByText('filterUserId')).toBeInTheDocument();
    expect(getByText('filterRMNumber')).toBeInTheDocument();
    expect(getByText('filterMobileNumber')).toBeInTheDocument();

    unmount();
  });

  it('handle change pagination', () => {
    const { getByLabelText, unmount } = renderPage();
    const buttonNext = getByLabelText('Go to next page');
    expect(buttonNext).toBeInTheDocument();

    fireEvent.click(buttonNext);

    expect(userFundBalanceFetcher).toHaveBeenCalled();

    unmount();
  });

  it('handle filter', () => {
    const { getAllByPlaceholderText, unmount } = renderPage();

    const inputUserId = getAllByPlaceholderText('placeholderType')[0];
    fireEvent.change(inputUserId, { target: { value: 'User Id Test' } });

    const inputRmNumber = getAllByPlaceholderText('placeholderType')[1];
    fireEvent.change(inputRmNumber, { target: { value: '12345' } });

    const inputMobileNumber = getAllByPlaceholderText('placeholderType')[2];
    fireEvent.change(inputMobileNumber, { target: { value: '0822' } });

    expect(userFundBalanceFetcher).toHaveBeenCalled();

    unmount();
  });

  it('handle sort', () => {
    const { getByText, unmount } = renderPage();

    const headerSort = getByText('tableHeaderUserType');
    expect(headerSort).toBeInTheDocument();

    fireEvent.click(headerSort);

    expect(userFundBalanceFetcher).toHaveBeenCalled();

    unmount();
  });

  it('renders useMemberSummaryList without error', () => {
    const { result } = renderUseUserFundBalanceList();
    expect(result.error).toBeUndefined();
  });

  it('handle delete filter', async () => {
    const { result, unmount } = renderUseUserFundBalanceList();

    result.current.handleDeleteFilter('tableHeaderUserID', 'none');

    expect(userFundBalanceFetcher).toHaveBeenCalled();

    unmount();
  });

  it('handle fetch', async () => {
    const { result, unmount } = renderUseUserFundBalanceList();

    result.current.fetchUserFundBalance();

    expect(userFundBalanceFetcher).toHaveBeenCalled();

    unmount();
  });

  it('success handles function change date range < 730', () => {
    const { result, unmount } = renderUseUserFundBalanceList();

    act(() => {
      result.current.handleChangeDate({
        startDate: new Date('2023-11-19'),
        endDate: new Date('2023-11-20'),
      });
    });

    expect(result.current.filterForm).toEqual({
      activeDate: {
        startDate: new Date('2023-11-19'),
        endDate: new Date('2023-11-20'),
      },
      memberId: '',
      phoneNumber: '',
      rmNumber: '',
    });

    unmount();
  });

  it('failed handles function change date range > 730', () => {
    const { result, unmount } = renderUseUserFundBalanceList();

    act(() => {
      result.current.handleChangeDate({
        startDate: new Date('2023-11-20'),
        endDate: new Date('2023-11-20'),
      });
    });

    // failed to execute when changing the date range to more than 730 days for unit testing.
    act(() => {
      result.current.handleChangeDate({
        startDate: new Date('2020-11-19'),
        endDate: new Date('2023-11-20'),
      });
    });

    expect(result.current.filterForm).toEqual({
      activeDate: {
        startDate: new Date('2023-11-20'),
        endDate: new Date('2023-11-20'),
      },
      memberId: '',
      phoneNumber: '',
      rmNumber: '',
    });

    unmount();
  });
});
