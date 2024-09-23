import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-hooks';
import { ConfirmationDialogProvider } from '@woi/web-component';
import createDummy from '@woi/core/utils/dummy';
import useRoleList from '../hooks/useRoleList';
import RoleManagementList from '../RoleManagementList';
import { useRoleListFetcher } from '@woi/service/co';
import { RoleData } from '@woi/service/co/idp/role/roleList';

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ConfirmationDialogProvider>
        <RoleManagementList />
      </ConfirmationDialogProvider>
    </QueryClientProvider>,
  );
};

const renderUseRoleList = () => {
  return renderHook(() => useRoleList(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe('page content management', () => {
  test('renders a loading state', () => {
    const { getByText, getByTestId, unmount } = renderPage();

    const pageTitle = getByText('pageTitle');
    expect(pageTitle).toBeInTheDocument();

    expect(getByText('filterRoleName')).toBeInTheDocument();

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

  it('should render the component table and value without crashing', () => {
    mockRoleDataList = createDummy(10).map(() => mockRoleData);
    const { getByText, getAllByText, unmount } = renderPage();

    expect(getByText('pageTitle')).toBeInTheDocument();
    expect(getByText('filterRoleName')).toBeInTheDocument();

    expect(getByText('tableHeaderRoleName')).toBeInTheDocument();
    expect(getByText('tableHeaderNumberOfUsers')).toBeInTheDocument();
    expect(getByText('tableHeaderAction')).toBeInTheDocument();

    const textActionDetail = getAllByText('tableActionDetail');
    textActionDetail.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    const textValueName = getAllByText('Admin Role');
    textValueName.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    const textValueNumberUser = getAllByText('5');
    textValueNumberUser.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    unmount();
  });

  it('handle detail', () => {
    const { unmount } = renderPage();
    const buttonDetail = screen.getAllByText('tableActionDetail')[0];

    fireEvent.click(buttonDetail);

    unmount();
  });

  it('handle add data', () => {
    const { unmount } = renderPage();
    const buttonAdd = screen.getByText('pageActionAdd');

    fireEvent.click(buttonAdd);

    unmount();
  });

  it('handle change pagination', () => {
    const { unmount } = renderPage();
    const buttonNext = screen.getByLabelText('Go to next page');
    expect(buttonNext).toBeInTheDocument();

    fireEvent.click(buttonNext);
    expect(useRoleListFetcher).toHaveBeenCalled();

    unmount();
  });

  it('handle filter role name', () => {
    const { unmount } = renderPage();

    const inputRoleName = screen.getByPlaceholderText('placeholderType');
    fireEvent.change(inputRoleName, { target: { value: 'Test Biller' } });

    expect(useRoleListFetcher).toHaveBeenCalled();

    unmount();
  });

  it('handle sort', () => {
    const { unmount } = renderPage();

    fireEvent.click(screen.getByText('tableHeaderRoleName'));

    expect(useRoleListFetcher).toHaveBeenCalled();

    unmount();
  });
});

describe('hook content management', () => {
  it('success renders useRoleList without error', () => {
    const { result } = renderUseRoleList();
    expect(result.error).toBeUndefined();
  });

  it('handles refetch data', () => {
    const { result } = renderUseRoleList();
    act(() => {
      result.current.fetchRoleList();
    });
    expect(useRoleListFetcher).toHaveBeenCalled();
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

const mockRoleData: RoleData = {
  id: 'role-123',
  createdDate: '2023-04-01',
  modifiedDate: '2023-04-01',
  name: 'Admin Role',
  description: 'Administrator role with full privileges',
  menuPrivileges: [
    {
      menuId: 'menu-1',
      privilegeType: 'read',
    },
    {
      menuId: 'menu-2',
      privilegeType: 'write',
    },
  ],
  numberOfUser: 5,
};

let mockRoleDataList = createDummy(0).map(() => mockRoleData);

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useRoleListFetcher: jest.fn(() => ({
    result: {
      currentPage: 0,
      totalElements: 15,
      totalPages: 2,
      data: mockRoleDataList,
    },
    status: 'success',
    refetch: jest.fn(),
  })),
}));

jest.mock('../hooks/useRoleList', () => ({
  __esModule: true,
  default: (props: { showModal: () => void; idSelectedContent: string }) => ({
    ...jest.requireActual('../hooks/useRoleList').default(props),
    pagination: {
      currentPage: 0,
      limit: 10,
      totalPages: 3,
      totalElements: 25,
    },
    roleData: mockRoleDataList,
  }),
}));

jest.mock('@src/shared/components/AuthorizeView/AuthorizeView', () => {
  const mockAuthorizeView: jest.Mock = jest.fn(({ children }) => (
    <div>{children}</div>
  ));

  return {
    __esModule: true,
    default: mockAuthorizeView as React.FC<{ children: React.ReactNode }>,
    mockAuthorizeView,
  };
});

jest.mock('../components/CreateRoleModal', () => {
  return jest.fn(props => {
    return (
      <div>
        <button onClick={() => props.onHide(null)}>Close Create</button>
      </div>
    );
  });
});
