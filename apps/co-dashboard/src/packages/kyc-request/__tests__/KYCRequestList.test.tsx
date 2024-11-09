import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-hooks';
import { ConfirmationDialogProvider } from '@woi/web-component';
import createDummy from '@woi/core/utils/dummy';
import useKycPremiumMemberListFetcher, {
  KycPremiumMemberData,
  KycPremiumMemberStatus,
} from '@woi/service/co/kyc/premiumMember/premiumMemberList';
import KYCRequestList from '../KYCRequestList';
import useKycRequestList from '../hooks/useKycRequestList';
import { act } from 'react-dom/test-utils';

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

let mockPagination = {};

jest.mock('../hooks/useKycRequestList', () => ({
  __esModule: true,
  default: (props: { showModal: () => void; idSelectedContent: string }) => ({
    ...jest.requireActual('../hooks/useKycRequestList').default(props),
    ...mockPagination,
  }),
}));

jest.mock('../components/ViewKYCRequestModal', () =>
  jest.fn(({ children }) => <div>{children}</div>),
);

const mockKYCPremiumMember = {
  id: '54321',
  createdDate: '2023-11-23T10:45:00Z',
  modifiedDate: '2023-11-23T11:45:00Z',
  identityNumber: 555555555,
  identityType: 'Passport',
  fullName: 'Alex Johnson',
  phoneNumber: '087654321098',
  createdBy: 'superadmin',
  modifiedBy: 'admin',
};

const statusPremiumMember: KycPremiumMemberStatus = 'UNREGISTERED';

const mockPremiumMemberData = {
  ...mockKYCPremiumMember,
  status: statusPremiumMember,
};

let mockKycPremiumMemberData: KycPremiumMemberData[] = createDummy(0).map(
  () => mockPremiumMemberData,
);

const mockRefect = jest.fn();

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useKycPremiumMemberListFetcher: jest.fn(() => ({
    result: {
      currentPage: 0,
      totalElements: 15,
      totalPages: 2,
      data: mockKycPremiumMemberData,
    },
    status: 'success',
    refetch: mockRefect,
  })),
}));

jest.mock('../hooks/useKycRequestList', () => ({
  __esModule: true,
  default: () => ({
    ...jest.requireActual('../hooks/useKycRequestList').default(),
    pagination: {
      currentPage: 0,
      limit: 10,
      totalPages: 3,
      totalElements: 25,
    },
  }),
}));

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ConfirmationDialogProvider>
        <KYCRequestList />
      </ConfirmationDialogProvider>
    </QueryClientProvider>,
  );
};

const renderUseEmailContentList = () => {
  return renderHook(() => useKycRequestList(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe('page email content management', () => {
  test('renders a loading state', () => {
    const { getByText, getByTestId, unmount } = renderPage();

    const pageTitle = getByText('pageTitle');
    expect(pageTitle).toBeInTheDocument();

    expect(getByText('pageTitle')).toBeInTheDocument();

    const loadingNode = getByTestId('loading-state');
    expect(loadingNode).toBeInTheDocument();
    expect(loadingNode).toMatchSnapshot();

    unmount();
  });

  test('renders empty state', () => {
    const statusPremiumMemberOther: KycPremiumMemberStatus = 'UNREGISTERED';
    const mockPremiumMemberData = {
      ...mockKYCPremiumMember,
      status: statusPremiumMemberOther,
    };
    mockKycPremiumMemberData = createDummy(10).map(() => mockPremiumMemberData);
    const { getByText, unmount } = renderPage();

    expect(getByText('tableEmptyTitle')).toBeInTheDocument();
    expect(getByText('tableEmptyDescription')).toBeInTheDocument();

    unmount();
  });

  it('should render the component table and value without crashing', () => {
    const statusPremiumMemberOther: KycPremiumMemberStatus =
      'WAITING_TO_REVIEW';
    const mockPremiumMemberData = {
      ...mockKYCPremiumMember,
      status: statusPremiumMemberOther,
    };
    mockKycPremiumMemberData = createDummy(15).map(() => mockPremiumMemberData);
    const { unmount } = renderPage();

    expect(screen.getByText('pageTitle')).toBeInTheDocument();

    expect(screen.getByText('tableHeaderPhoneNumber')).toBeInTheDocument();
    expect(screen.getByText('detailMemberName')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderRequestDate')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderIDType')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderIDNumber')).toBeInTheDocument();
    expect(screen.getByText('detailKYCStatus')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderAction')).toBeInTheDocument();

    const textActionDetail = screen.getAllByText('actionViewKYC');
    textActionDetail.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    const textValuePhone = screen.getAllByText('087654321098');
    textValuePhone.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    const textValueStatus = screen.getAllByText('statusUnregistered');
    textValueStatus.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    const textValueCreatedDate = screen.getAllByText(
      '23 November 2023 17:45:00',
    );
    textValueCreatedDate.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    unmount();
  });

  it('render table with status waiting to verify', () => {
    const statusPremiumMemberOther: KycPremiumMemberStatus = 'PREMIUM';
    const mockPremiumMemberData = {
      ...mockKYCPremiumMember,
      status: statusPremiumMemberOther,
    };
    mockKycPremiumMemberData = createDummy(15).map(() => mockPremiumMemberData);
    const { unmount } = renderPage();

    const textValueStatus = screen.getAllByText('statusWaitingToVerify');
    textValueStatus.forEach(element => {
      expect(element).toBeInTheDocument();
    });
    unmount();
  });

  it('render table with status approved', () => {
    const statusPremiumMemberOther: KycPremiumMemberStatus = 'REJECTED';
    const mockPremiumMemberData = {
      ...mockKYCPremiumMember,
      status: statusPremiumMemberOther,
    };
    mockKycPremiumMemberData = createDummy(15).map(() => mockPremiumMemberData);
    const { unmount } = renderPage();

    const textValueStatus = screen.getAllByText('statusApproved');
    textValueStatus.forEach(element => {
      expect(element).toBeInTheDocument();
    });
    unmount();
  });

  it('render table with status rejected', () => {
    const statusPremiumMemberOther: KycPremiumMemberStatus = 'NONE';
    const mockPremiumMemberData = {
      ...mockKYCPremiumMember,
      status: statusPremiumMemberOther,
    };
    mockKycPremiumMemberData = createDummy(1).map(() => mockPremiumMemberData);
    const { unmount } = renderPage();

    const textValueStatus = screen.getAllByText('statusRejected');
    textValueStatus.forEach(element => {
      expect(element).toBeInTheDocument();
    });
    unmount();
  });

  it('render table with status none', () => {
    const { unmount } = renderPage();

    const textValueStatus = screen.getAllByText('-');
    textValueStatus.forEach(element => {
      expect(element).toBeInTheDocument();
    });
    unmount();
  });

  it('handle click view kyc', () => {
    mockKycPremiumMemberData = createDummy(1).map(() => mockPremiumMemberData);

    const { unmount } = renderPage();

    const buttonView = screen.getByText('actionViewKYC');
    expect(buttonView).toBeInTheDocument();

    fireEvent.click(buttonView);

    unmount();
  });

  it('handle filter phone number', () => {
    mockKycPremiumMemberData = createDummy(1).map(() => mockPremiumMemberData);

    const { unmount } = renderPage();

    const inputFilterPhone = screen.getByPlaceholderText(
      'placeholderTypePhoneNumber',
    );
    fireEvent.click(inputFilterPhone);
    fireEvent.change(inputFilterPhone, { target: { value: '082282223333' } });

    waitFor(() => {
      expect(useKycPremiumMemberListFetcher).toHaveBeenCalled();
    });

    unmount();
  });

  it('handle filter member name', () => {
    mockKycPremiumMemberData = createDummy(15).map(() => mockPremiumMemberData);

    const { unmount } = renderPage();

    const inputFilterPhone = screen.getByPlaceholderText(
      'placeholderTypeMemberName',
    );
    fireEvent.click(inputFilterPhone);
    fireEvent.change(inputFilterPhone, { target: { value: 'Test Name' } });

    waitFor(() => {
      expect(useKycPremiumMemberListFetcher).toHaveBeenCalled();
    });

    unmount();
  });

  it('handle change pagination', () => {
    const { unmount } = renderPage();

    const buttonNext = screen.getByLabelText('Go to next page');
    expect(buttonNext).toBeInTheDocument();

    fireEvent.click(buttonNext);

    waitFor(() => {
      expect(useKycPremiumMemberListFetcher).toHaveBeenCalled();
    });

    unmount();
  });

  it('handle sort', () => {
    const { unmount } = renderPage();

    const headerSort = screen.getByText('tableHeaderPhoneNumber');
    expect(headerSort).toBeInTheDocument();

    fireEvent.click(headerSort);

    waitFor(() => {
      expect(useKycPremiumMemberListFetcher).toHaveBeenCalled();
    });

    unmount();
  });
});

describe('hook email content management', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = renderUseEmailContentList();
    mockPagination = {};
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('success renders useKycRequestList without error', () => {
    const { result } = wrapper;
    expect(result.error).toBeUndefined();
  });

  it('handles sorting', () => {
    const { result } = wrapper;
    const columnId: keyof KycPremiumMemberData = 'phoneNumber';
    const oldDirection = result.current.direction;
    act(() => {
      result.current.handleSort(columnId);
    });
    expect(result.current.sortBy).toEqual(columnId);
    expect(result.current.direction).toEqual(
      oldDirection === 'asc' ? 'desc' : 'asc',
    );
  });

  it('handles refetch data', () => {
    const { result } = wrapper;
    act(() => {
      result.current.fetchKycRequestList();
    });

    waitFor(() => {
      expect(useKycPremiumMemberListFetcher).toHaveBeenCalled();
    });
  });
});
