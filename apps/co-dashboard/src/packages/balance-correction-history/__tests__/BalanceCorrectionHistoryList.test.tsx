import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react-hooks';
import BalanceCorrectionHistoryList from '../BalanceCorrectionHistoryList';
import ViewBalanceCorrectionModal from '../components/ViewBalanceCorrectionModal';
import useBalanceCorrectionHistoryList from '../hooks/useBalanceCorrectionHistoryList';
import { BalanceCorrectionHistoryData } from '@woi/service/co/admin/balanceCorrection/balanceCorrectionHistory';
import useBalanceCorrectionHistoryView from '../hooks/useBalanceCorrectionHistoryView';

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
    pathname: '/[coName]/co-va-member-summary',
    route: '/[coName]/co-va-member-summary',
    query: {
      coName: 'co',
    },
    asPath: '/co/co-va-member-summary/',
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

const mockBalanceCorrectionHistoryData: BalanceCorrectionHistoryData[] = [
  {
    accountPhoneNumber: '639430917870',
    accountName: 'andre testing duabelas',
    rmNumber: '00000020831574',
    vaNumber: '783084639430917870',
    balanceBefore: 0,
    amount: 10,
    balanceAfter: 10,
    type: 'TOPUP',
    status: 'REJECTED',
  },
];

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useBalanceCorrectionHistorytFetcher: jest.fn(() => ({
    result: {
      currentPage: 0,
      totalElements: 1,
      totalPages: 1,
      balanceCorrectionDto: mockBalanceCorrectionHistoryData,
    },
    status: 'success',
    refetch: jest.fn(),
  })),
}));

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BalanceCorrectionHistoryList />
    </QueryClientProvider>,
  );
};

const renderModalView = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ViewBalanceCorrectionModal
        isActive={true}
        onHide={jest.fn()}
        selectedData={mockBalanceCorrectionHistoryData[0]}
      />
    </QueryClientProvider>,
  );
};

const renderUseBalanceCorrectionHistoryList = () => {
  return renderHook(() => useBalanceCorrectionHistoryList(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

const renderUseBalanceCorrectionHistoryView = () => {
  return renderHook(() => useBalanceCorrectionHistoryView(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe('balance correction list', () => {
  test('renders a loading state', () => {
    const { getByText, getByTestId } = renderPage();

    const pageTitle = getByText('pageTitleBalanceCorrectionHistory');
    expect(pageTitle).toBeInTheDocument();

    expect(getByText('filterPhoneNumber')).toBeInTheDocument();
    expect(getByText('filterMemberName')).toBeInTheDocument();
    expect(getByText('filterStatus')).toBeInTheDocument();

    const loadingNode = getByTestId('loading-state');
    expect(loadingNode).toBeInTheDocument();
    expect(loadingNode).toMatchSnapshot();
  });
});

describe('balance correction list with table', () => {
  test('should render successfully when data exists, the table and download button are shown', () => {
    const { getByText } = renderPage();

    expect(getByText('filterPhoneNumber')).toBeInTheDocument();
    expect(getByText('filterMemberName')).toBeInTheDocument();
    expect(getByText('filterStatus')).toBeInTheDocument();

    expect(getByText('tableAccountName')).toBeInTheDocument();
    expect(getByText('tableHeaderAccountPhoneNumber')).toBeInTheDocument();
    expect(getByText('tableHeaderRmNumber')).toBeInTheDocument();
    expect(getByText('tableHeaderAccountBalance')).toBeInTheDocument();
    expect(getByText('tableHeaderAction')).toBeInTheDocument();

    expect(getByText('andre testing duabelas')).toBeInTheDocument();
    expect(getByText('639430917870')).toBeInTheDocument();
    expect(getByText('00000020831574')).toBeInTheDocument();
    expect(getByText('optionReject')).toBeInTheDocument();

    expect(getByText('tableActionDetail')).toBeInTheDocument();

    fireEvent.click(getByText('tableActionDetail'));
  });

  test('should render modal successfully when correction button is press, the modal detail are shown', () => {
    const { getByText } = renderModalView();

    expect(getByText('detailTitle')).toBeInTheDocument();
    expect(getByText('detailVANumber')).toBeInTheDocument();
    expect(getByText('detailVAName')).toBeInTheDocument();
    expect(getByText('detailBalance')).toBeInTheDocument();

    expect(getByText('andre testing duabelas')).toBeInTheDocument();
    expect(getByText('639430917870')).toBeInTheDocument();
  });

  it('renders useBalanceCorrectionHistoryList without error', () => {
    const { result } = renderUseBalanceCorrectionHistoryList();
    expect(result.error).toBeUndefined();
  });

  it('renders useBalanceCorrectionHistoryView without error', () => {
    const { result } = renderUseBalanceCorrectionHistoryView();
    expect(result.error).toBeUndefined();
  });

  it('handles filter form changes', () => {
    const { result } = renderUseBalanceCorrectionHistoryList();
    const newFilterForm = {
      status: [],
      phoneNumber: '082282242131',
      memberName: '',
    };

    act(() => {
      result.current.setFilterForm(newFilterForm);
    });

    expect(result.current.filterForm).toEqual(newFilterForm);
  });

  it('handles sorting', () => {
    const { result } = renderUseBalanceCorrectionHistoryList();
    const columnId: keyof BalanceCorrectionHistoryData = 'accountName';
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
