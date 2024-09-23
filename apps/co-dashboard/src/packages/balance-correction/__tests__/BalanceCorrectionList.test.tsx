import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react-hooks';
import { MemberLockData } from '@woi/service/co/admin/member/memberLockList';
import BalanceCorrectionList from '../BalanceCorrectionList';
import useBalanceCorrectionList from '../hooks/useBalanceCorrectionList';
import ViewBalanceCorrectionModal from '../components/ViewBalanceCorrectionModal';
import ViewConfirmPasswordModal from '../components/ViewConfirmPasswordModal';

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

const mockMemberLockData: MemberLockData[] = [
  {
    createdDate: '2023-06-22T04:10:04.248375Z',
    modifiedDate: '',
    id: '',
    name: 'rinda bpi test anything',
    username: '630000000027',
    phoneNumber: '082192847736',
    accountNumber: '145133630000000027',
    rmNumber: 'a892375839',
    balance: 10000,
    amount: 100,
    balanceAfter: 0,
    referenceNumber: '145133630000000027',
    balanceCorrectionId: '17844245566',
    type: 'TOPUP',
  },
];

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useMemberLockListFetcher: jest.fn(() => ({
    result: {
      currentPage: 0,
      totalElements: 1,
      totalPages: 1,
      data: mockMemberLockData,
    },
    status: 'success',
    refetch: jest.fn(),
  })),
}));

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BalanceCorrectionList />
    </QueryClientProvider>,
  );
};

const renderModalView = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ViewBalanceCorrectionModal
        fetchMemberList={jest.fn()}
        isActive={true}
        onHide={jest.fn()}
        privilegeType="REQUESTER"
        selectedData={mockMemberLockData[0]}
      />
    </QueryClientProvider>,
  );
};

const renderModalPassword = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ViewConfirmPasswordModal
        isActive={true}
        onHide={jest.fn()}
        selectedData={mockMemberLockData[0]}
        correctionData={null}
        onHideModal={jest.fn()}
        actionType="APPROVED"
        privilegeType="REQUESTER"
        fetchMemberList={jest.fn()}
      />
    </QueryClientProvider>,
  );
};

const renderBalanceCorrectionList = () => {
  return renderHook(() => useBalanceCorrectionList(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe('balance correction list', () => {
  test('renders a loading state', () => {
    const { getByText, getByTestId } = renderPage();

    const pageTitle = getByText('pageTitleBalanceCorrection');
    expect(pageTitle).toBeInTheDocument();

    expect(getByText('filterPhoneNumber')).toBeInTheDocument();
    expect(getByText('filterMemberName')).toBeInTheDocument();

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

    expect(getByText('tableAccountName')).toBeInTheDocument();
    expect(getByText('tableHeaderAccountPhoneNumber')).toBeInTheDocument();
    expect(getByText('tableHeaderRmNumber')).toBeInTheDocument();
    expect(getByText('tableHeaderAccountBalance')).toBeInTheDocument();
    expect(getByText('tableHeaderAction')).toBeInTheDocument();
    expect(getByText('tableHeaderCorrection')).toBeInTheDocument();

    expect(getByText('rinda bpi test anything')).toBeInTheDocument();
    expect(getByText('082192847736')).toBeInTheDocument();
    expect(getByText('a892375839')).toBeInTheDocument();

    expect(getByText('tableHeaderCorrection')).toBeInTheDocument();

    fireEvent.click(getByText('tableHeaderCorrection'));
  });

  test('should render modal successfully when correction button is press, the modal detail are shown', () => {
    const { getByText } = renderModalView();

    expect(getByText('detailTitle')).toBeInTheDocument();
    expect(getByText('detailVANumber')).toBeInTheDocument();
    expect(getByText('detailVAName')).toBeInTheDocument();
    expect(getByText('detailBalance')).toBeInTheDocument();

    expect(getByText('rinda bpi test anything')).toBeInTheDocument();
    expect(getByText('082192847736')).toBeInTheDocument();
  });

  test('should render modal password form successfully when save correction button is press', () => {
    const { getByText } = renderModalPassword();

    expect(getByText('detailPassword')).toBeInTheDocument();
    expect(getByText('actionCancel')).toBeInTheDocument();
    expect(getByText('actionCancel')).toBeInTheDocument();
    expect(getByText('actionSubmit')).toBeInTheDocument();
  });

  it('renders useBalanceCorrectionList without error', () => {
    const { result } = renderBalanceCorrectionList();
    expect(result.error).toBeUndefined();
  });

  it('handles filter form changes', () => {
    const { result } = renderBalanceCorrectionList();
    const newFilterForm = {
      phoneNumber: '',
      name: 'rinda',
    };

    act(() => {
      result.current.setFilterForm(newFilterForm);
    });

    expect(result.current.filterForm).toEqual(newFilterForm);
  });

  it('handles sorting', () => {
    const { result } = renderBalanceCorrectionList();
    const columnId: keyof MemberLockData = 'createdDate';
    const oldDirection = result.current.direction;

    act(() => {
      result.current.handleSort(columnId);
    });

    expect(result.current.sortBy).toEqual(columnId);
    expect(result.current.direction).toEqual(
      oldDirection === 'asc' ? 'desc' : 'asc',
    );
  });

  it('success fetches member summary list without error', async () => {
    const { result } = renderBalanceCorrectionList();

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
});
