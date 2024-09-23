import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-hooks';
import createDummy from '@woi/core/utils/dummy';
import { ConfirmationDialogProvider } from '@woi/web-component';
import AccountInformation from '../components/ViewManageMamber/content/AccountInformation';
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

const mockTransactionHistory: any = {
  amount: 50.75,
  balance: 1000.25,
  dateTime: '2023-01-15T12:30:00',
  dbCr: 'CR',
  description: 'Sample transaction description',
  method: 'Credit Card',
  transactionId: 'trans-123456',
  type: 'ADD_MONEY_VIA_NG',
};

let mockTransactionHistoriList = createDummy(1).map(
  () => mockTransactionHistory,
);

let mockErrorDownload = false;

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useMemberTransactionHistoryListFetcher: jest.fn(() => ({
    result: {
      transaction: mockTransactionHistoriList,
    },
    status: 'success',
    refetch: jest.fn(),
  })),
  useMemberTransactionHistoryExportFetcher: jest.fn(() => ({
    result: { data: { url: 'test-url' } },
    error: mockErrorDownload,
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
    activityMemberHistoryData: mockTransactionHistoriList,
  }),
}));

const mockPropsAccountInformation = {
  activeTab: 0,
  memberDetail: null,
  memberKYCDetail: null,
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

    expect(getByText('accountInformationListOfCO')).toBeInTheDocument();
    expect(getByText('accountInformationAccountNumber')).toBeInTheDocument();
    expect(getByText('accountInformationUpgradeStatus')).toBeInTheDocument();
    expect(getByText('accountInformationRegisterDate')).toBeInTheDocument();
    expect(getByText('accountInformationUpgradeDate')).toBeInTheDocument();
    expect(getByText('accountInformationVYBEMember')).toBeInTheDocument();

    const buttonSeeTrx = getByText(
      'accountInformationActionSeeTransactionDetail',
    );
    expect(buttonSeeTrx).toBeInTheDocument();
    fireEvent.click(buttonSeeTrx);

    expect(getByText('15 January 2023 12:30:00')).toBeInTheDocument();

    unmount();
  });

  test('renders with data table with 0 amount', () => {
    mockTransactionHistoriList = createDummy(1).map(() => ({
      ...mockTransactionHistory,
      amount: 0,
    }));
    const { getByText, unmount } = renderPage();

    const buttonSeeTrx = getByText(
      'accountInformationActionSeeTransactionDetail',
    );
    expect(buttonSeeTrx).toBeInTheDocument();
    fireEvent.click(buttonSeeTrx);

    unmount();
  });

  test('renders with data table with amount null', () => {
    mockTransactionHistoriList = createDummy(1).map(() => ({
      ...mockTransactionHistory,
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

  test('handle pagination', () => {
    const { getByText, unmount, getByLabelText } = renderPage();

    const buttonSeeTrx = getByText(
      'accountInformationActionSeeTransactionDetail',
    );
    expect(buttonSeeTrx).toBeInTheDocument();
    fireEvent.click(buttonSeeTrx);

    const buttonNext = getByLabelText('Go to next page');
    expect(buttonNext).toBeInTheDocument();

    unmount();
  });

  test('handle change download data type & success', () => {
    const { getByText, unmount, getByLabelText } = renderPage();

    const buttonSeeTrx = getByText(
      'accountInformationActionSeeTransactionDetail',
    );
    expect(buttonSeeTrx).toBeInTheDocument();
    fireEvent.click(buttonSeeTrx);

    const pdfCheckbox = getByLabelText('PDF');
    const excelCheckbox = getByLabelText('Excel');
    expect(pdfCheckbox).toBeInTheDocument();
    expect(excelCheckbox).toBeInTheDocument();
    fireEvent.click(excelCheckbox);
    expect(pdfCheckbox).not.toBeChecked();
    expect(excelCheckbox).toBeChecked();

    fireEvent.click(getByText('actionDownload'));

    unmount();
  });

  test('handle  download & failed', () => {
    mockErrorDownload = true;
    const { getByText, unmount } = renderPage();

    const buttonSeeTrx = getByText(
      'accountInformationActionSeeTransactionDetail',
    );
    expect(buttonSeeTrx).toBeInTheDocument();
    fireEvent.click(buttonSeeTrx);

    fireEvent.click(getByText('actionDownload'));

    unmount();
  });

  test('handle get sort data', () => {
    const { getByText, unmount } = renderPage();

    const buttonSeeTrx = getByText(
      'accountInformationActionSeeTransactionDetail',
    );
    expect(buttonSeeTrx).toBeInTheDocument();
    fireEvent.click(buttonSeeTrx);

    fireEvent.click(getByText('accountInformationTableHeaderDateTime'));

    unmount();
  });
});

describe('hook account information', () => {
  it('success renders useActivityMemberHistoryList without error', () => {
    const { result } = renderUseActivityMemberHistoryList();
    expect(result.error).toBeUndefined();
  });
});
