import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-hooks';
import { ConfirmationDialogProvider } from '@woi/web-component';
import DailyReportList from '../DailyReportList';
import useDailyReportList from '../hooks/useDailyReportList';
import useDailyReportFetcher, {
  DailyReportData,
} from '@woi/service/co/admin/report/dailyReportList';
import createDummy from '@woi/core/utils/dummy';
import { useDailyReportExportFetcher } from '@woi/service/co';
import { PaginationData } from '@woi/core/api';

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

const mockEnqueueSnackbar = jest.fn();

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: jest.fn(() => ({
    enqueueSnackbar: mockEnqueueSnackbar,
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

const mockDailyEonBoarding = {
  createdBy: 'John Doe',
  createdDate: '2023-11-20T08:00:00Z',
  deletedAt: '',
  effectiveDate: '2023-12-01T00:00:00Z',
  fileName: 'sample_report.pdf',
  id: 123,
  modifiedBy: 'Jane Doe',
  modifiedDate: '2023-11-21T10:30:00Z',
  reportUrl: 'https://example.com/reports/sample_report',
};

let dummyDailyEonBoarding: DailyReportData[] = createDummy(0).map(
  () => mockDailyEonBoarding,
);

const mockRefect = jest.fn();
let mockResponseExport = {
  result: { url: 'test-url' },
  error: false,
};

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useDailyReportFetcher: jest.fn(() => ({
    result: {
      currentPage: 0,
      totalElements: 15,
      totalPages: 2,
      dailyEonboardingLists: dummyDailyEonBoarding,
    },
    response: {
      currentPage: 0,
      totalElements: 15,
      totalPages: 2,
      dailyEonboardingLists: dummyDailyEonBoarding,
    },
    status: 'success',
    refetch: mockRefect,
  })),
  useDailyReportExportFetcher: jest.fn(() => mockResponseExport),
}));

let mockModulePagination = {};

jest.mock('../hooks/useDailyReportList', () => ({
  __esModule: true,
  default: () => ({
    ...jest.requireActual('../hooks/useDailyReportList').default(),
    ...mockModulePagination,
  }),
}));

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ConfirmationDialogProvider>
        <DailyReportList />
      </ConfirmationDialogProvider>
    </QueryClientProvider>,
  );
};

const renderUseDailyChannelReliabilityList = () => {
  return renderHook(() => useDailyReportList(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe('page daily report', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = renderPage();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('renders a loading state', () => {
    const { getByText, getByTestId } = wrapper;

    const pageTitle = getByText('pageTitleDailyReport');
    expect(pageTitle).toBeInTheDocument();

    expect(getByText('filterDate')).toBeInTheDocument();

    const loadingNode = getByTestId('loading-state');
    expect(loadingNode).toBeInTheDocument();
    expect(loadingNode).toMatchSnapshot();
  });

  test('renders empty state', () => {
    const { getByText } = wrapper;

    expect(getByText('tableEmptyTitle')).toBeInTheDocument();
  });

  beforeEach(() => {
    dummyDailyEonBoarding = createDummy(1).map(() => mockDailyEonBoarding);
    mockModulePagination = {
      pagination: {
        currentPage: 0,
        limit: 10,
        totalPages: 3,
        totalElements: 25,
      },
    };
  });

  it('should render the component table and value without crashing', () => {
    expect(screen.getByText('pageTitleDailyReport')).toBeInTheDocument();
    expect(screen.getByText('filterDate')).toBeInTheDocument();

    expect(screen.getByText('tableHeaderFileName')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderDate')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderAction')).toBeInTheDocument();

    expect(screen.getByText('sample_report.pdf')).toBeInTheDocument();
    expect(screen.getByText('01 December 2023 07:00:00')).toBeInTheDocument();
    expect(screen.getByText('tableActionDownload')).toBeInTheDocument();
  });

  test('should call api export fetcher when click download button', () => {
    expect(screen.getByText('tableActionDownload')).toBeInTheDocument();

    fireEvent.click(screen.getByText('tableActionDownload'));

    expect(useDailyReportExportFetcher).toHaveBeenCalled();
  });

  it('handle change pagination', () => {
    const buttonNext = screen.getByLabelText('Go to next page');
    expect(buttonNext).toBeInTheDocument();

    fireEvent.click(buttonNext);

    waitFor(() => {
      expect(useDailyReportFetcher).toHaveBeenCalled();
    });
  });
});

describe('hook daily report', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = renderUseDailyChannelReliabilityList();
    mockModulePagination = {};
    mockResponseExport = {
      result: { url: 'test-url' },
      error: true,
    };
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('success renders useDailyChannelReliabilityList without error', () => {
    const { result } = wrapper;
    expect(result.error).toBeUndefined();
  });

  it('handles filter form changes', () => {
    const { result } = wrapper;
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
  });

  it('handles pagination', async () => {
    const { result } = wrapper;
    const mockOldPaginationData: PaginationData = {
      currentPage: 0,
      limit: 10,
      totalPages: 2,
      totalElements: 20,
    };
    const mockNewPaginationData: PaginationData = {
      currentPage: 1,
      limit: 10,
      totalPages: 2,
      totalElements: 20,
    };
    result.current.pagination = mockOldPaginationData;

    act(() => {
      result.current.setPagination(mockNewPaginationData);
    });
    expect(result.current.pagination).toEqual(mockNewPaginationData);
  });

  it('handles refetch data', () => {
    const { result } = wrapper;

    const mockFetchDailyReport = jest.fn();
    result.current.fetchDailyReport = mockFetchDailyReport;

    act(() => {
      result.current.fetchDailyReport();
    });

    expect(mockFetchDailyReport).toHaveBeenCalled();
  });

  it('success handles function change date range < 730', () => {
    const { result } = wrapper;

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
  });

  it('failed handles function change date range > 730', () => {
    const { result } = wrapper;

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
  });

  it('handle getSortPayload', () => {
    const { result } = wrapper;

    let resultSortPayload = '';

    act(() => {
      resultSortPayload = result.current.getSortPayload('fileName');
    });

    expect(resultSortPayload).toEqual('fileName');

    act(() => {
      resultSortPayload = result.current.getSortPayload('effectiveDate');
    });

    expect(resultSortPayload).toEqual('effective_date');
  });

  it('show error failed export fetching', async () => {
    const { result } = wrapper;
    act(() => {
      result.current.handleExport();
    });

    expect(mockEnqueueSnackbar).toBeCalled();
  });

  it('handles sorting', () => {
    const { result } = wrapper;
    const columnId: keyof DailyReportData = 'createdBy';
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
