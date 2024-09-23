import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react-hooks';
import AccountRuleValueManagementList from '../AccountRuleValueManagementList';
import useAccountRuleValueList from '../hooks/useAccountRuleValueList';
import { AccountRuleValueData } from '@woi/service/co/admin/accountRuleValue/accountRuleValueList';
import CreateAccountRuleValueModal from '../components/CreateAccountRuleValueModal';
import useAccountRuleValueUpsert from '../hooks/useAccountRuleValueUpsert';

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

const mockAdminActivityData: AccountRuleValueData[] = [
  {
    createdDate: '',
    modifiedDate: '',
    valueRegisterMember: 1,
    valueUnregisterMember: 1,
    startDate: '2023-05-26',
    endDate: '2024-12-31',
    accountRuleName: 'Minimum Amount',
    transactionTypeSecureId: '195c41d8-637d-4d44-80f0-6ad8ca55418b',
    transactionTypeName: 'Topup',
    currencyName: 'Peso',
    valueProMember: 1,
    id: '101d8b01-a2cc-300c-45b4-0d616c78d601',
  },
];

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useAccountRuleValueListFetcher: jest.fn(() => ({
    result: {
      currentPage: 0,
      totalElements: 1,
      totalPages: 1,
      data: mockAdminActivityData,
    },
    status: 'success',
    refetch: jest.fn(),
  })),
  useAccountRuleValueDetailFetcher: jest.fn(() => ({
    result: mockAdminActivityData[0],
    status: 'success',
    refetch: jest.fn(),
  })),
}));

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AccountRuleValueManagementList />
    </QueryClientProvider>,
  );
};

const renderModalCreate = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <CreateAccountRuleValueModal
        fetchAccountRuleValueList={jest.fn()}
        isActive={true}
        onHide={jest.fn()}
        selectedData={mockAdminActivityData[0]}
      />
    </QueryClientProvider>,
  );
};

const renderUseActivityHistoryList = () => {
  return renderHook(() => useAccountRuleValueList(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

const renderUseAccountRuleValueUpsert = () => {
  return renderHook(
    () =>
      useAccountRuleValueUpsert({
        selectedData: mockAdminActivityData[0],
        onHide: jest.fn(),
        fetchAccountRuleValueList: jest.fn(),
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

describe('account rule value management', () => {
  test('renders a loading state', () => {
    const { getByText, getByTestId } = renderPage();

    const pageTitle = getByText('pageTitle');
    expect(pageTitle).toBeInTheDocument();

    expect(getByText('filterRuleName')).toBeInTheDocument();
    expect(getByText('filterTransactionType')).toBeInTheDocument();
    expect(getByText('filterDate')).toBeInTheDocument();

    const loadingNode = getByTestId('loading-state');
    expect(loadingNode).toBeInTheDocument();
    expect(loadingNode).toMatchSnapshot();
  });
});

describe('show table data account rule value management', () => {
  test('should render successfully when data exists, the table and download button are shown', () => {
    const { getByText } = renderPage();
    expect(getByText('Minimum Amount')).toBeInTheDocument();
    expect(getByText('Topup')).toBeInTheDocument();
    expect(getByText('Peso')).toBeInTheDocument();
    expect(getByText('26 May 2023 - 31 Dec 2024')).toBeInTheDocument();
    expect(getByText('tableActionDetail')).toBeInTheDocument();

    fireEvent.click(getByText('tableActionDetail'));
  });

  test('should render successfully when data exists, the table and download button are shown', () => {
    const { getByText } = renderModalCreate();
    expect(getByText('formAccountRuleName')).toBeInTheDocument();
    expect(getByText('formTransactionType')).toBeInTheDocument();
    expect(getByText('formValue')).toBeInTheDocument();
    expect(getByText('formForLiteMember')).toBeInTheDocument();
    expect(getByText('formForRegularMember')).toBeInTheDocument();
    expect(getByText('formForProMember')).toBeInTheDocument();
    expect(getByText('formCurrency')).toBeInTheDocument();
    expect(getByText('formEffectiveDate')).toBeInTheDocument();
  });

  it('renders useActivityHistoryList without error', () => {
    const { result } = renderUseActivityHistoryList();
    expect(result.error).toBeUndefined();
  });

  it('renders useAccountRuleValueUpsert without error', () => {
    const { result } = renderUseAccountRuleValueUpsert();
    expect(result.error).toBeUndefined();
  });

  it('handles filter form changes', () => {
    const { result } = renderUseActivityHistoryList();
    const newFilterForm = {
      accountRuleSecureIds: [],
      transactionTypeSecureIds: [],
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
    const { result } = renderUseActivityHistoryList();
    const columnId: keyof AccountRuleValueData = 'transactionTypeName';
    const oldDirection = result.current.direction;

    act(() => {
      result.current.handleSort(columnId);
    });

    expect(result.current.sortBy).toEqual(columnId);
    expect(result.current.direction).toEqual(
      oldDirection === 'asc' ? 'desc' : 'asc',
    );
  });

  it('success fetches account rule value list without error', async () => {
    const { result } = renderUseActivityHistoryList();
    const mockFetchMemberList = jest.fn();
    result.current.fetchAccountRuleValueList = mockFetchMemberList;
    act(() => {
      result.current.fetchAccountRuleValueList();
    });
    await waitFor(() => {
      expect(mockFetchMemberList).toHaveBeenCalled();
      expect(result.error).toBeUndefined();
    });
  });
});
