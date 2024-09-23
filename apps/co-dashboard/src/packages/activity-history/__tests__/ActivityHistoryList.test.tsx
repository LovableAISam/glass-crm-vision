import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import ActivityHistoryList from '../ActivityHistoryList';
import { AdminActivityData } from '@woi/service/co/admin/report/adminActivityList';
import { act, renderHook } from '@testing-library/react-hooks';
import useActivityHistoryList from '../hooks/useActivityHistoryList';
import createDummy from '@woi/core/utils/dummy';

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

const mockAdminActivityData: AdminActivityData = {
  dateTime: '2023-10-31T12:42:11.178+00:00',
  activityId: '1698756131177',
  fromUser: 'RizkySam_CO@gmail.com',
  toUser: 'RizkySam_CO2@gmail.com',
  type: 'Login',
  description: 'system_admin RizkySam_CO@gmail.com Login Success',
  status: 'APPROVED',
};

let mockAdminActivityList = createDummy(0).map(() => mockAdminActivityData);

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useAdminActivityListFetcher: jest.fn(() => ({
    result: {
      currentPage: 0,
      totalElements: 1,
      totalPages: 1,
      transactions: mockAdminActivityList,
    },
    status: 'success',
    refetch: jest.fn(),
  })),
}));

jest.mock('../hooks/useActivityHistoryList', () => ({
  __esModule: true,
  default: (props: { formatOption: 'PDF' }) => ({
    ...jest.requireActual('../hooks/useActivityHistoryList').default(props),
    pagination: {
      currentPage: 0,
      limit: 10,
      totalPages: 3,
      totalElements: 25,
    },
    adminActivityData: mockAdminActivityList,
  }),
}));

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ActivityHistoryList />
    </QueryClientProvider>,
  );
};

const renderUseActivityHistoryList = () => {
  return renderHook(() => useActivityHistoryList({ formatOption: 'PDF' }), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe('activity history show table', () => {
  test('renders a loading state', () => {
    const { getByText, getByTestId, unmount } = renderPage();

    const pageTitle = getByText('activityHistory');
    expect(pageTitle).toBeInTheDocument();

    expect(getByText('fromUser')).toBeInTheDocument();
    expect(getByText('toUser')).toBeInTheDocument();
    expect(getByText('type')).toBeInTheDocument();
    expect(getByText('filterDate')).toBeInTheDocument();

    const loadingNode = getByTestId('loading-state');
    expect(loadingNode).toBeInTheDocument();
    expect(loadingNode).toMatchSnapshot();

    unmount();
  });

  test('renders empty state', () => {
    const { getByText, unmount } = renderPage();

    expect(getByText('tableEmptyTitle')).toBeInTheDocument();
    expect(getByText('tableEmptyDescription')).toBeInTheDocument();

    unmount();
  });

  test('should render successfully when data exists, the table and download button are shown', () => {
    mockAdminActivityList = createDummy(10).map(() => mockAdminActivityData);
    const { getByLabelText, getAllByText, unmount } = renderPage();

    const textValueFromUser = getAllByText('RizkySam_CO@gmail.com');
    textValueFromUser.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    const textValueType = getAllByText('Login');
    textValueType.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    const textDownload = getAllByText('actionDownload');
    textDownload.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    const pdfCheckbox = getByLabelText('PDF');
    const excelCheckbox = getByLabelText('Excel');
    expect(pdfCheckbox).toBeInTheDocument();
    expect(excelCheckbox).toBeInTheDocument();
    fireEvent.click(excelCheckbox);
    expect(pdfCheckbox).not.toBeChecked();
    expect(excelCheckbox).toBeChecked();

    unmount();
  });

  test('handle filter', () => {
    const { getAllByPlaceholderText, unmount } = renderPage();

    const inputFromUser = getAllByPlaceholderText(
      'placeholderType',
    )[0];
    fireEvent.change(inputFromUser, { target: { value: 'Rizky' } });

    const inputToUser = getAllByPlaceholderText(
      'placeholderType',
    )[1];
    fireEvent.change(inputToUser, { target: { value: 'Rizky' } });

    // const selectType = getAllByPlaceholderText(
    //   'placeholderType',
    // )[2];
    // fireEvent.click(selectType)
    // fireEvent.change(selectType, { target: { value: 'Login' } });

    unmount();
  });

  it('renders useActivityHistoryList without error', () => {
    const { result, unmount } = renderUseActivityHistoryList();
    expect(result.error).toBeUndefined();

    unmount();
  });

  it('handles filter form changes', () => {
    const { result, unmount } = renderUseActivityHistoryList();
    const newFilterForm = {
      account: '',
      fromUser: '',
      toUser: '',
      date: {
        startDate: new Date(),
        endDate: new Date(),
      },
      type: [],
    };

    act(() => {
      result.current.setFilterForm(newFilterForm);
    });

    expect(result.current.filterForm).toEqual(newFilterForm);

    unmount();
  });

  it('handles sorting', () => {
    const { result, unmount } = renderUseActivityHistoryList();
    const columnId: keyof AdminActivityData = 'dateTime';
    const oldDirection = result.current.direction;

    act(() => {
      result.current.handleSort(columnId);
    });

    expect(result.current.sortBy).toEqual(columnId);
    expect(result.current.direction).toEqual(
      oldDirection === 'asc' ? 'desc' : 'asc',
    );

    unmount();
  });

  it('success fetches activity history list without error', async () => {
    const { result, unmount } = renderUseActivityHistoryList();

    const mockFetchMemberList = jest.fn();
    result.current.fetchAdminActivity = mockFetchMemberList;
    act(() => {
      result.current.fetchAdminActivity();
    });
    await waitFor(() => {
      expect(mockFetchMemberList).toHaveBeenCalled();
      expect(result.error).toBeUndefined();
    });

    unmount();
  });

  it('success handles export without error', async () => {
    const { result, unmount } = renderUseActivityHistoryList();

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

    unmount();
  });
});
