import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MemberActivityData } from '@woi/service/co/admin/report/memberActivityList';
import ActivityMemberHistoryList from '../ActivityMemberHistoryList';
import { act, renderHook } from '@testing-library/react-hooks';
import useActivityMemberHistoryList from '../hooks/useActivityMemberHistoryList';

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
    query: {
      coName: 'co',
    },
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

const mockMemberActivityData: MemberActivityData[] = [
  {
    activityId: '507487366960647209',
    createdDate: '2023-11-01T09:33:36.942+00:00',
    referenceId: 'REQUEST_MONEY_169883119562630',
    type: 'Success Send money Between Member',
    account: '639134679059',
    rmNumber: '00000020831903',
    description: '639134679059 Success Send money Between Member',
  },
];

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useMemberActivityListFetcher: jest.fn(() => ({
    result: {
      currentPage: 0,
      totalElements: 1,
      totalPages: 1,
      activities: mockMemberActivityData,
    },
    status: 'success',
    refetch: jest.fn(),
  })),
}));

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ActivityMemberHistoryList />
    </QueryClientProvider>,
  );
};

const renderUseActivityMemberHistoryList = () => {
  return renderHook(
    () => useActivityMemberHistoryList({ formatOption: 'PDF' }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    },
  );
};

describe('activity member history', () => {
  test('renders a loading state', () => {
    const { getByText, getByTestId } = renderPage();

    const pageTitle = getByText('pageTitle');
    expect(pageTitle).toBeInTheDocument();

    expect(getByText('filterAccount')).toBeInTheDocument();
    expect(getByText('filterType')).toBeInTheDocument();
    expect(getByText('filterDate')).toBeInTheDocument();

    const loadingNode = getByTestId('loading-state');
    expect(loadingNode).toBeInTheDocument();
    expect(loadingNode).toMatchSnapshot();
  });
});

describe('activity member history show table', () => {
  test('should render successfully when data exists, the table and download button are shown', () => {
    const { getByText, getByLabelText } = renderPage();
    expect(getByText('507487366960647209')).toBeInTheDocument();
    expect(getByText('REQUEST_MONEY_169883119562630')).toBeInTheDocument();
    expect(getByText('639134679059')).toBeInTheDocument();
    expect(getByText('Success Send money Between Member')).toBeInTheDocument();
    expect(
      getByText('639134679059 Success Send money Between Member'),
    ).toBeInTheDocument();

    expect(getByText('actionDownload')).toBeInTheDocument();

    const pdfCheckbox = getByLabelText('PDF');
    const excelCheckbox = getByLabelText('Excel');
    expect(pdfCheckbox).toBeInTheDocument();
    expect(excelCheckbox).toBeInTheDocument();
    fireEvent.click(excelCheckbox);
    expect(pdfCheckbox).not.toBeChecked();
    expect(excelCheckbox).toBeChecked();
  });

  it('renders useActivityMemberHistoryList without error', () => {
    const { result } = renderUseActivityMemberHistoryList();
    expect(result.error).toBeUndefined();
  });

  it('handles filter form changes', () => {
    const { result } = renderUseActivityMemberHistoryList();
    const newFilterForm = {
      account: '',
      transactionDate: {
        startDate: new Date(),
        endDate: new Date(),
      },
      activityType: [],
    };

    act(() => {
      result.current.setFilterForm(newFilterForm);
    });

    expect(result.current.filterForm).toEqual(newFilterForm);
  });

  it('handles sorting', () => {
    const { result } = renderUseActivityMemberHistoryList();
    const columnId: keyof MemberActivityData = 'createdDate';
    const oldDirection = result.current.direction;

    act(() => {
      result.current.handleSort(columnId);
    });

    expect(result.current.sortBy).toEqual(columnId);
    expect(result.current.direction).toEqual(
      oldDirection === 'asc' ? 'desc' : 'asc',
    );
  });

  it('success fetches activity member history list without error', async () => {
    const { result } = renderUseActivityMemberHistoryList();
    const mockFetchMemberList = jest.fn();
    result.current.fetchMemberActivity = mockFetchMemberList;
    act(() => {
      result.current.fetchMemberActivity();
    });
    await waitFor(() => {
      expect(mockFetchMemberList).toHaveBeenCalled();
      expect(result.error).toBeUndefined();
    });
  });

  it('success handles export without error', async () => {
    const { result } = renderUseActivityMemberHistoryList();
    const mockuseActivityAdminHistoryExport = jest.fn();
    mockuseActivityAdminHistoryExport.mockResolvedValue({
      result: { url: 'test-url' },
      error: false,
    });
    result.current.handleExport = mockuseActivityAdminHistoryExport;
    act(() => {
      result.current.handleExport();
    });
    expect(mockuseActivityAdminHistoryExport).toHaveBeenCalled();
    expect(result.error).toBeUndefined();
  });
});
