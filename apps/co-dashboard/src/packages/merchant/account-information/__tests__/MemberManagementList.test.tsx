import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { MemberData } from '@woi/service/co/idp/member/memberList';
import { ConfirmationDialogProvider } from '@woi/web-component';
import createDummy from '@woi/core/utils/dummy';
import MemberManagementList from '../MemberManagementList';
import { useMemberListFetcher } from '@woi/service/co';
import { renderHook } from '@testing-library/react-hooks';
import useMemberList from '../hooks/useMemberList';

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

const mockRefect = jest.fn();

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useMemberListFetcher: jest.fn(() => ({
    result: {
      data: [],
    },
    status: 'success',
    refetch: mockRefect,
  })),
}));

const mockMemberData: MemberData = {
  createdDate: '2023-11-09T04:16:54.398Z',
  modifiedDate: '',
  id: '',
  name: 'kimmy blanton',
  username: '639569408333_x',
  phoneNumber: '639569408333_x',
  accountNumber: '639569408333_x',
  email: 'x_bpi.vybe.eonboarding14_x@gmail.com',
  createdBy: '',
  isAccountNonLocked: false,
  activationStatus: 'ACTIVE',
  isAccountNonExpired: true,
  isCredentialsNonExpired: true,
  isEnable: true,
  loyaltyStatus: 'REGISTERED',
  isTemporaryPassword: false,
  upgradeStatus: 'UPGRADE',
  pictureFileName: 'TBD',
  rmNumber: '',
  vybeMember: 'LITE',
  upgradeDate: '',
  balance: 1068.27,
  dateOfBirth: '',
  secretId: '',
  gcmId: '',
};

let mockMemberDataList = createDummy(0).map(() => mockMemberData);

jest.mock('../components/ViewManageMemberModal', () =>
  jest.fn(({ children }) => <div>{children}</div>),
);

jest.mock('../hooks/useMemberList', () => ({
  __esModule: true,
  default: () => ({
    ...jest.requireActual('../hooks/useMemberList').default(),
    pagination: {
      currentPage: 0,
      limit: 10,
      totalPages: 3,
      totalElements: 25,
    },
    memberData: mockMemberDataList,
  }),
}));

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ConfirmationDialogProvider>
        <MemberManagementList />
      </ConfirmationDialogProvider>
    </QueryClientProvider>,
  );
};

const renderUseMemberList = () => {
  return renderHook(() => useMemberList(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
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
    mockMemberDataList = createDummy(10).map(() => mockMemberData);
    const { unmount } = renderPage();
    expect(screen.getByText('pageTitle')).toBeInTheDocument();

    expect(screen.getByText('tableHeaderPhoneNumber')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderRMNumber')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderMemberName')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderStatus')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderVybeMember')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderUpgradeStatus')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderRegistrationDate')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderAction')).toBeInTheDocument();

    const textActionView = screen.getAllByText('tableActionView');
    textActionView.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    const textValuePhone = screen.getAllByText('639569408333_x');
    textValuePhone.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('tableActionView')[0]);

    unmount();
  });

  it('should render the component table with other data condition', () => {
    mockMemberDataList = createDummy(15).map(() => ({
      ...mockMemberData,
      activationStatus: 'LOCK',
      vybeMember: 'REGULAR',
      upgradeStatus: 'NOT_UPGRADE',
    }));

    const { unmount } = renderPage();

    unmount();
  });

  it('should render the component table with other data condition', () => {
    mockMemberDataList = createDummy(15).map(() => ({
      ...mockMemberData,
      activationStatus: 'NONE',
      vybeMember: 'PRO',
      upgradeStatus: 'NONE',
    }));

    const { unmount } = renderPage();

    unmount();
  });

  it('should render the component table with other data condition', () => {
    mockMemberDataList = createDummy(15).map(() => ({
      ...mockMemberData,
      activationStatus: 'NONE',
      vybeMember: 'NONE',
      upgradeStatus: 'NONE',
    }));

    const { unmount } = renderPage();

    unmount();
  });

  it('handle filter phone number', () => {
    mockMemberDataList = createDummy(15).map(() => mockMemberData);

    const { unmount } = renderPage();

    const inputPhoneNumber =
      screen.getAllByPlaceholderText('placeholderType')[0];

    fireEvent.change(inputPhoneNumber, { target: { value: '0852' } });

    unmount();
  });

  it('handle filter rm number', () => {
    mockMemberDataList = createDummy(15).map(() => mockMemberData);

    const { unmount } = renderPage();

    const inputRmNumber = screen.getAllByPlaceholderText('placeholderType')[1];

    fireEvent.change(inputRmNumber, { target: { value: '3225' } });

    unmount();
  });

  it('handle filter member name', () => {
    mockMemberDataList = createDummy(15).map(() => mockMemberData);

    const { unmount } = renderPage();

    const inputMemberName =
      screen.getAllByPlaceholderText('placeholderType')[2];

    fireEvent.change(inputMemberName, { target: { value: 'name test' } });

    unmount();
  });

  it('handle change pagination', () => {
    mockMemberDataList = createDummy(15).map(() => mockMemberData);

    const { unmount } = renderPage();

    const buttonNext = screen.getByLabelText('Go to next page');
    expect(buttonNext).toBeInTheDocument();

    fireEvent.click(buttonNext);

    expect(useMemberListFetcher).toHaveBeenCalled();

    unmount();
  });

  it('handle sort', () => {
    const { unmount } = renderPage();

    const headerSort = screen.getByText('tableHeaderPhoneNumber');
    expect(headerSort).toBeInTheDocument();

    fireEvent.click(headerSort);

    expect(useMemberListFetcher).toHaveBeenCalled();

    unmount();
  });

  // it('handle filter status', () => {
  //   mockMemberDataList = createDummy(15).map(() => mockMemberData);

  //   const { unmount } = renderPage();

  //   const inputSelectStatus =
  //     screen.getAllByPlaceholderText('placeholderSelect')[0];
  //   fireEvent.click(inputSelectStatus);
  //   fireEvent.change(inputSelectStatus, { target: { value: 'Lock' } });
  //   expect(inputSelectStatus).toHaveValue('Lock');

  //   unmount();
  // });

  // it('handle filter vybe member', () => {
  //   mockMemberDataList = createDummy(15).map(() => mockMemberData);

  //   const { unmount } = renderPage();

  //   const inputSelectVybe =
  //     screen.getAllByPlaceholderText('placeholderSelect')[1];
  //   fireEvent.click(inputSelectVybe);
  //   fireEvent.change(inputSelectVybe, { target: { value: 'REGULAR' } });
  //   expect(inputSelectVybe).toHaveValue('REGULAR');

  //   unmount();
  // });
});

describe('hook layering approval', () => {
  it('success renders useMemberList without error', async () => {
    const { result, unmount } = renderUseMemberList();

    waitFor(() => {
      expect(result.error).toBeUndefined();
    });

    result.current.fetchMemberList();
    result.current.handleDeleteFilter('phoneNumber', 'none');

    expect(useMemberListFetcher).toHaveBeenCalled();

    unmount();
  });
});
