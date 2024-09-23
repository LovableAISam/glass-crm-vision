import React from 'react';
import { act, render, screen } from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-hooks';
import { ConfirmationDialogProvider } from '@woi/web-component';
import DailyChannelReliabilityList from '../DailyChannelReliabilityList';
import useDailyChannelReliabilityList from '../hooks/useDailyChannelReliabilityList';
import { ResponseChannelReliability } from '@woi/service/co/admin/channelReliability/channelReliabilityList';

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

jest.mock('@src/shared/hooks/useRouteRedirection', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    prefix: '[coName]',
    prefixText: '',
    coName: 'co',
    onNavigate: jest.fn(),
    getRoute: '',
    getRouteWithoutPrefix: '',
    generateRoute: '',
  })),
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

jest.mock('@src/shared/context/AuthenticationContext', () => ({
  useAuthenticationSpecDispatch: jest.fn(),
}));

let isDataTable = false;

const mockDailyChannelReliabilityData: ResponseChannelReliability = {
  loginAttempts: 40097,
  successfullLogin: 38757,
  succesLoginPercentage: 96.65810409756341,
  attemptedUserLogin: 153,
  avgAttemptsLoginPerUser: 262.0718954248366,
  successUserLoginAttempt: 148,
  nonFinancialAttempt: 38436,
  nonFinancialSuccess: 33637,
  successNonFinancialPercentage: 87.514309501509,
  attemptedNonFinancialMember: 147,
  avgAttemptsNonFinancialPerUser: 261.46938775510205,
  successUserNonFinancialAttempt: 146,
  attemptFinancial: 143,
  successFinancial: 154,
  successFinancialPercentage: 107.6923076923077,
  attemptFinancialMember: 97,
  avgAttemptsFinancialPerUser: 1.4742268041237112,
  successUserFinancialAttempt: 92,
  statsSuccessLogin: 38757,
  statsTotalMinsLoginLogout: 0,
  statsAverageMinsInApp: 0,
  statsSuccessNonFinancialTransaction: 33637,
  statsTotalMinsNonFinancial: 0,
  averageNonFinancialTransaction: 0,
  statsSuccessFinancialTransaction: 154,
  statsTotalMinsFinancial: 0,
  averageFinancialTransaction: 0,
};

const mockRefect = jest.fn();

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  userChannelReliabilityFetcher: jest.fn(() => ({
    result: isDataTable ? { ...mockDailyChannelReliabilityData } : false,
    status: 'success',
    refetch: mockRefect,
  })),
}));

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ConfirmationDialogProvider>
        <DailyChannelReliabilityList />
      </ConfirmationDialogProvider>
    </QueryClientProvider>,
  );
};

const renderUseDailyChannelReliabilityList = () => {
  return renderHook(() => useDailyChannelReliabilityList(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe('page daily channel reliability', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = renderPage();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('renders a loading state', () => {
    const { getByText, getByTestId } = wrapper;

    const pageTitle = getByText('pageTitleDailyChannelReliabilityReport');
    expect(pageTitle).toBeInTheDocument();

    expect(getByText('filterDate')).toBeInTheDocument();

    const loadingNode = getByTestId('loading-state');
    expect(loadingNode).toBeInTheDocument();
    expect(loadingNode).toMatchSnapshot();
  });

  test('renders empty state', () => {
    const { getByText } = wrapper;

    expect(getByText('tableEmptyTitle')).toBeInTheDocument();
    expect(getByText('tableEmptyDescriptionFiltered')).toBeInTheDocument();
  });

  beforeEach(() => {
    isDataTable = true;
  });

  it('should render the component table and value without crashing', () => {
    const { unmount } = wrapper;
    expect(
      screen.getByText('pageTitleDailyChannelReliabilityReport'),
    ).toBeInTheDocument();
    expect(screen.getByText('tableHeaderLoginAttempts')).toBeInTheDocument();

    const sameElement1 = screen.queryAllByText('tableHeaderSuccessfulLogins');
    expect(sameElement1).toHaveLength(2);
    sameElement1.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    const sameElement2 = screen.queryAllByText('tableHeader%Successful');
    expect(sameElement2).toHaveLength(3);
    sameElement2.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    const sameElement3 = screen.queryAllByText('tableHeaderUsersAttempted');
    expect(sameElement3).toHaveLength(3);
    sameElement3.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    const sameElement4 = screen.queryAllByText('tableHeaderAvgAttemptsOrUser');
    expect(sameElement4).toHaveLength(3);
    sameElement4.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    expect(
      screen.getByText('tableHeaderNonFinancialTransactionAttempt'),
    ).toBeInTheDocument();

    const sameElement5 = screen.queryAllByText(
      'tableHeaderSuccessNonFinancialTransactions',
    );
    expect(sameElement5).toHaveLength(2);
    sameElement5.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    expect(
      screen.getByText('tableHeaderFinancialTransactionAttempts'),
    ).toBeInTheDocument();
    const sameElement6 = screen.queryAllByText(
      'tableHeaderSuccessFinancialTransactions',
    );

    expect(sameElement6).toHaveLength(2);
    sameElement6.forEach(element => {
      expect(element).toBeInTheDocument();
    });
    expect(
      screen.getByText('tableHeaderTotalMinsLoginLogout'),
    ).toBeInTheDocument();
    expect(screen.getByText('tableHeaderAverageMinsInApp')).toBeInTheDocument();

    const sameElement7 = screen.queryAllByText(
      'tableHeaderTotalMinsStartEndTransaction',
    );
    expect(sameElement7).toHaveLength(2);
    sameElement7.forEach(element => {
      expect(element).toBeInTheDocument();
    });
    expect(screen.getByText('tableHeaderAverageNonFinTxn')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderAverageFinTxn')).toBeInTheDocument();

    expect(screen.getByText('96.65810409756341')).toBeInTheDocument();
    expect(screen.getByText('262.0718954248366')).toBeInTheDocument();
    expect(screen.getByText('87.514309501509')).toBeInTheDocument();

    unmount();
  });
});

describe('hook daily channel reliability', () => {
  it('success renders useDailyChannelReliabilityList without error', () => {
    const { result, unmount } = renderUseDailyChannelReliabilityList();
    expect(result.error).toBeUndefined();

    unmount();
  });

  it('handles filter form changes', () => {
    const { result, unmount } = renderUseDailyChannelReliabilityList();
    const newFilterForm = {
      activeDate: {
        startDate: new Date('2023-11-19'),
        endDate: new Date('2023-11-19'),
      },
    };

    act(() => {
      result.current.setFilterForm(newFilterForm);
    });

    expect(result.current.filterForm).toEqual(newFilterForm);

    unmount();
  });

  it('handles refetch data', () => {
    const { result, unmount } = renderUseDailyChannelReliabilityList();

    const mockFetchUserFundBalance = jest.fn();
    result.current.refetchUserFundBalance = mockFetchUserFundBalance;

    act(() => {
      result.current.refetchUserFundBalance();
    });

    expect(mockFetchUserFundBalance).toHaveBeenCalled();

    unmount();
  });

  it('success handles function change date range < 730', () => {
    const { result, unmount } = renderUseDailyChannelReliabilityList();

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
    });

    unmount();
  });

  it('failed handles function change date range > 730', () => {
    const { result, unmount } = renderUseDailyChannelReliabilityList();

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
    });

    unmount();
  });
});
