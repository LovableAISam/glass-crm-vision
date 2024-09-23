import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import COVAMemberSummaryList from '../COVAMemberSummaryList';
import { MemberData } from '@woi/service/co/idp/member/memberList';
import { act, renderHook } from '@testing-library/react-hooks';
import useMemberSummaryList from '../hooks/useMemberSummaryList';
import { ResponseDataMemberSummaryDetail } from '@woi/service/co/admin/report/membersummaryDetail';
import ViewMemberSummaryModal from '../components/ViewMemberSummaryModal';
import useMemberSummaryDetail from '../hooks/useMemberSummaryDetail';

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

const mockVAMemberSummaryData: MemberData[] = [
  {
    createdDate: '2023-06-22T04:10:04.248375Z',
    modifiedDate: '',
    id: '',
    name: 'rinda bpi test anything',
    username: '630000000027',
    phoneNumber: '630000000027',
    accountNumber: '145133630000000027',
    email: 'rindabpiwoi2@mailinator.com',
    createdBy: '',
    isAccountNonLocked: true,
    activationStatus: 'ACTIVE',
    isAccountNonExpired: true,
    isCredentialsNonExpired: true,
    isEnable: true,
    loyaltyStatus: 'REGISTERED',
    isTemporaryPassword: true,
    upgradeStatus: 'NOT_UPGRADE',
    pictureFileName:
      'https://bpi-revamp.s3.ap-southeast-3.amazonaws.com/1697068801761_cool.png',
    rmNumber: '',
    vybeMember: 'LITE',
    upgradeDate: '',
    balance: 6030324,
    dateOfBirth: '',
    secretId: '',
    gcmId: '',
  },
];

const mockVAMemberSummaryDetail: ResponseDataMemberSummaryDetail = {
  today: '2023-10-31T08:48:21.061236Z',
  date: '30-Oct-2023 - 30-Oct-2023',
  name: 'rinda bpi test anything',
  vaNumber: '145133630000000027',
  balance: 6030324,
  status: 'UNREGISTER',
  reports: {
    currentPage: 0,
    totalElements: 352,
    totalPages: 36,
    transactions: [
      {
        date: '2023-10-30T11:24:02.35812Z',
        transactionType: 'ADD_MONEY_VIA_NG',
        category: 'CREDIT',
        vaSource: 'via NG',
        rmNumber: null,
        vaDest: '630000000027',
        amount: 1,
        status: 'COMPLETED',
        balance: 6030324,
        description: null,
        referalNumber: 'vFfcQbRJyrBbdCrHXGJM',
        bnisorc: null,
        secondaryIdentifier: null,
        traceNumber: null,
        billerFee: null,
        totalAmount: 1,
      },
    ],
  },
};

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useMemberListFetcher: jest.fn(() => ({
    result: {
      currentPage: 0,
      totalElements: 1,
      totalPages: 1,
      data: mockVAMemberSummaryData,
    },
    status: 'success',
    refetch: jest.fn(),
  })),
  useMemberSummaryDetailFetcher: jest.fn(() => ({
    result: {
      ...mockVAMemberSummaryDetail,
    },
    status: 'success',
    refetch: jest.fn(),
  })),
}));

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <COVAMemberSummaryList />
    </QueryClientProvider>,
  );
};

const renderUseMemberSummaryList = () => {
  return renderHook(() => useMemberSummaryList(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

const renderModal = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ViewMemberSummaryModal
        fetchMemberList={jest.fn()}
        isActive={true}
        onHide={jest.fn()}
        selectedData={mockVAMemberSummaryData[0]}
      />
    </QueryClientProvider>,
  );
};

const renderUseMemberSummaryDetail = () => {
  return renderHook(
    () =>
      useMemberSummaryDetail({
        selectedData: mockVAMemberSummaryData[0],
        formatOption: 'PDF',
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

describe('CO VA Member Summary With Loading', () => {
  test('renders a loading state', () => {
    const { getByText, getByTestId } = renderPage();

    const pageTitle = getByText('pageTitleVAMemberSummary');
    expect(pageTitle).toBeInTheDocument();

    expect(getByText('filterMemberName')).toBeInTheDocument();
    expect(getByText('filterVaNumber')).toBeInTheDocument();
    expect(getByText('filterDate')).toBeInTheDocument();

    const loadingNode = getByTestId('loading-state');
    expect(loadingNode).toBeInTheDocument();
    expect(loadingNode).toMatchSnapshot();
  });
});

describe('CO VA Member Summary With Table', () => {
  test('should render successfully when data exists, the table and download button are shown', () => {
    const { getByText } = renderPage();

    expect(getByText('filterMemberName')).toBeInTheDocument();
    expect(getByText('filterVaNumber')).toBeInTheDocument();
    expect(getByText('filterDate')).toBeInTheDocument();

    expect(getByText('tableHeaderMemberName')).toBeInTheDocument();
    expect(getByText('tableHeaderVANumber')).toBeInTheDocument();
    expect(getByText('tableHeaderCOName')).toBeInTheDocument();
    expect(getByText('tableHeaderBalance')).toBeInTheDocument();
    expect(getByText('tableHeaderRegistrationDate')).toBeInTheDocument();
    expect(getByText('tableHeaderAction')).toBeInTheDocument();

    expect(getByText('rinda bpi test anything')).toBeInTheDocument();
    expect(getByText('630000000027')).toBeInTheDocument();
    expect(getByText('tableActionDetail')).toBeInTheDocument();

    fireEvent.click(getByText('tableActionDetail'));
  });

  test('should render successfully when data exists, the table and download button are shown', () => {
    const { getByText, getByLabelText } = renderModal();
    expect(getByText('detailToday')).toBeInTheDocument();
    expect(getByText('detailDate')).toBeInTheDocument();
    expect(getByText('detailName')).toBeInTheDocument();
    expect(getByText('detailVANumber')).toBeInTheDocument();
    expect(getByText('detailBalance')).toBeInTheDocument();
    expect(getByText('detailStatus')).toBeInTheDocument();

    expect(
      getByText('activityMemberHistoryFilterTransactionDate'),
    ).toBeInTheDocument();
    expect(getByText('filterTransactionType')).toBeInTheDocument();

    expect(getByText('optionAddMoneyViaNG')).toBeInTheDocument();

    expect(getByText('actionDownload')).toBeInTheDocument();
    const pdfCheckbox = getByLabelText('PDF');
    const excelCheckbox = getByLabelText('Excel');
    expect(pdfCheckbox).toBeInTheDocument();
    fireEvent.click(excelCheckbox);
    expect(pdfCheckbox).not.toBeChecked();
    expect(excelCheckbox).toBeChecked();
  });

  it('renders useMemberSummaryList without error', () => {
    const { result } = renderUseMemberSummaryList();
    expect(result.error).toBeUndefined();
  });

  it('renders useMemberSummaryDetail without error', () => {
    const { result } = renderUseMemberSummaryDetail();
    expect(result.error).toBeUndefined();
  });

  it('handles filter form changes', () => {
    const { result } = renderUseMemberSummaryList();
    const newFilterForm = {
      phoneNumber: '',
      rmNumber: '',
      name: '',
      status: [],
      vybeMember: [],
      upgradeStatus: [],
      activeDate: {
        startDate: new Date(),
        endDate: new Date(),
      },
    };

    act(() => {
      result.current.setFilterForm(newFilterForm);
    });

    expect(result.current.filterForm).toEqual(newFilterForm);
  });

  it('handles sorting', () => {
    const { result } = renderUseMemberSummaryList();
    const columnId: keyof MemberData = 'createdDate';
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
    const { result } = renderUseMemberSummaryList();

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

  it('success fetches member summary transaction list without error', async () => {
    const { result } = renderUseMemberSummaryDetail();

    const mockFetchMemberList = jest.fn();
    result.current.fetchMemberSummaryTransaction = mockFetchMemberList;

    act(() => {
      result.current.fetchMemberSummaryTransaction();
    });

    expect(mockFetchMemberList).toHaveBeenCalled();
    expect(result.error).toBeUndefined();
  });
});
