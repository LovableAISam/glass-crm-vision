import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ConfirmationDialogProvider } from '@woi/web-component';
import createDummy from '@woi/core/utils/dummy';
import MerchantManagementList from '../MerchantManagementList';
import {
  useMerchantDetailFetcher,
  useMerchantListFetcher,
} from '@woi/service/co';

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ConfirmationDialogProvider>
        <MerchantManagementList />
      </ConfirmationDialogProvider>
    </QueryClientProvider>,
  );
};

describe('page layering approval', () => {
  test('renders a loading state', () => {
    const { unmount } = renderPage();

    const pageTitle = screen.getByText('pageTitle');
    expect(pageTitle).toBeInTheDocument();

    expect(screen.getByText('pageTitle')).toBeInTheDocument();

    const loadingNode = screen.getByTestId('loading-state');
    expect(loadingNode).toBeInTheDocument();
    expect(loadingNode).toMatchSnapshot();

    unmount();
  });

  test('renders empty state', () => {
    const { unmount } = renderPage();

    expect(screen.getByText('tableEmptyTitle')).toBeInTheDocument();
    expect(screen.getByText('tableEmptyDescription')).toBeInTheDocument();

    unmount();
  });

  it('should render the component table and value without crashing', () => {
    merchantDataList = createDummy(10).map(() => merchantData);
    const { unmount } = renderPage();
    expect(screen.getByText('pageTitle')).toBeInTheDocument();

    expect(screen.getByText('tableHeaderMerchantCode')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderMerchantName')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderStatus')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderBalance')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderAction')).toBeInTheDocument();

    const textActionView = screen.getAllByText('actionView');
    textActionView.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    const textActionEdit = screen.getAllByText('actionEdit');
    textActionEdit.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    const textValueMerchantCode = screen.getAllByText('M123456');
    textValueMerchantCode.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    unmount();
  });

  it('handle sort', () => {
    const { unmount } = renderPage();

    fireEvent.click(screen.getByText('tableHeaderMerchantName'));

    unmount();
  });

  it('handle detail', async () => {
    let render: any;

    render = renderPage();

    const { unmount } = render;

    await act(async () => {
      fireEvent.click(screen.getAllByText('actionView')[0]);
    });

    expect(useMerchantDetailFetcher).toHaveBeenCalled();

    expect(screen.getByText('M789012')).toBeInTheDocument();

    fireEvent.click(screen.getByText('actionViewPhoto'));

    fireEvent.click(screen.getByTestId('closeButton'));

    unmount();
  });

  it('handle add', () => {
    let render: any;

    render = renderPage();

    const { unmount } = render;

    fireEvent.click(screen.getByText('pageActionAdd'));

    fireEvent.click(screen.getByText('Close Create'));

    unmount();
  });

  it('handle edit', async () => {
    mockErrorDetailFetch = true;
    let render: any;

    render = renderPage();

    const { unmount } = render;

    await act(async () => {
      fireEvent.click(screen.getAllByText('actionEdit')[0]);
    });

    unmount();
  });

  it('handle filter merchant name', () => {
    const { unmount } = renderPage();

    const inputMerchant = screen.getAllByPlaceholderText('placeholderType')[0];

    fireEvent.change(inputMerchant, { target: { value: 'Merchant Test' } });

    expect(useMerchantListFetcher).toHaveBeenCalled();

    unmount();
  });

  it('handle filter merchant code', () => {
    const { unmount } = renderPage();

    const inputMerchant = screen.getAllByPlaceholderText('placeholderType')[1];

    fireEvent.change(inputMerchant, { target: { value: 'Merchant Test' } });

    expect(useMerchantListFetcher).toHaveBeenCalled();

    unmount();
  });

  it('handle filter status', () => {
    const { unmount } = renderPage();

    const inputSelectStatus =
      screen.getAllByPlaceholderText('placeholderSelect')[0];

    fireEvent.click(inputSelectStatus);
    fireEvent.change(inputSelectStatus, { target: { value: 'Active' } });
    expect(inputSelectStatus).toHaveValue('Active');

    fireEvent.click(inputSelectStatus);
    fireEvent.change(inputSelectStatus, { target: { value: 'Inactive' } });
    expect(inputSelectStatus).toHaveValue('Inactive');

    unmount();
  });

  it('handle change pagination', () => {
    const { unmount } = renderPage();

    const buttonNext = screen.getByLabelText('Go to next page');
    expect(buttonNext).toBeInTheDocument();

    fireEvent.click(buttonNext);

    expect(useMerchantListFetcher).toHaveBeenCalled();

    unmount();
  });
});

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

jest.mock('../components/CreateMerchantModal', () => {
  return jest.fn(props => {
    return (
      <div>
        <button onClick={() => props.onHide(null)}>Close Create</button>
      </div>
    );
  });
});

jest.mock('@src/shared/components/FormUpload/ImageUpload', () => {
  return jest.fn(props => {
    return (
      <div>
        <button onClick={() => props.onView(null)}>View Image</button>
      </div>
    );
  });
});

const merchantData = {
  createdDate: '2023-01-20',
  modifiedDate: '2023-01-20',
  merchantCode: 'M123456',
  merchantName: 'Sample Merchant',
  balance: null,
  status: true,
  effectiveDateFrom: '2023-01-21',
  effectiveDateTo: '2023-12-31',
  id: 'merchant-123',
};

let merchantDataList = createDummy(0).map(() => merchantData);

const mockRefect = jest.fn();

let mockErrorDetailFetch = false;

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useMerchantListFetcher: jest.fn(() => ({
    result: {
      currentPage: 0,
      totalElements: 15,
      totalPages: 2,
      data: [],
    },
    error: true,
    status: 'success',
    refetch: mockRefect,
  })),
  useMerchantDetailFetcher: jest.fn(() => ({
    result: {
      balance: 15000.75,
      createdDate: '2023-03-01',
      effectiveDateFrom: '2023-03-01',
      effectiveDateTo: '2023-12-31',
      status: true,
      email: 'merchant@example.com',
      id: 'merchant-789',
      merchantCode: 'M789012',
      merchantName: 'Sample Merchant',
      modifiedDate: '2023-03-01',
      phoneNumber: '987-654-3210',
      photoLogo: 'logo.jpg',
      principalId: 'principal-123',
      countryCode: 'US',
      isLocked: false,
    },
    error: mockErrorDetailFetch,
    status: 'success',
    refetch: mockRefect,
  })),
}));

jest.mock('../hooks/useMerchantUpsert', () => ({
  __esModule: true,
  default: () => ({
    ...jest.requireActual('../hooks/useMerchantUpsert').default(),
    merchantListData: merchantDataList,
    pagination: {
      currentPage: 0,
      limit: 10,
      totalPages: 3,
      totalElements: 25,
    },
  }),
}));
