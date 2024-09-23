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
import useLayeringApprovalList from '../hooks/useLayeringApprovalList';
import { ApprovalLayerData } from '@woi/service/co/admin/approvalLayer/approvalLayerList';
import LayeringApprovalList from '../LayeringApprovalList';
import CreateLayeringApprovalModal from '../components/CreateLayeringApprovalModal';
import { useApprovalLayerListFetcher } from '@woi/service/co';

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

jest.mock('../hooks/useLayeringApprovalList', () => ({
  __esModule: true,
  default: () => ({
    ...jest.requireActual('../hooks/useLayeringApprovalList').default(),
    pagination: {
      currentPage: 0,
      limit: 10,
      totalPages: 3,
      totalElements: 25,
    },
  }),
}));

const mockApLayerData = {
  id: '1a2b3c4d',
  createdDate: '2023-11-24T12:00:00Z',
  modifiedDate: '2023-11-24T15:30:00Z',
  menuId: 'abcd1234',
  menu: 'Layering admin',
  total: 15.99,
  role: [
    {
      id: 'r1',
      createdDate: '2023-11-24T12:30:00Z',
      modifiedDate: '2023-11-24T14:45:00Z',
      role: 'Admin',
      roleId: 'admin123',
      level: 2,
    },
    {
      id: 'r2',
      createdDate: '2023-11-24T13:15:00Z',
      modifiedDate: '2023-11-24T16:00:00Z',
      role: 'User',
      roleId: 'user456',
      level: 1,
    },
  ],
};
let mockApLayerList: ApprovalLayerData[] = createDummy(0).map(
  () => mockApLayerData,
);

const mockRefect = jest.fn();

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useApprovalLayerListFetcher: jest.fn(() => ({
    result: {
      currentPage: 0,
      totalElements: 15,
      totalPages: 2,
      data: mockApLayerList,
    },
    status: 'success',
    refetch: mockRefect,
  })),
}));

jest.mock('../components/CreateLayeringApprovalModal', () =>
  jest.fn(({ children }) => <div>{children}</div>),
);

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ConfirmationDialogProvider>
        <LayeringApprovalList />
      </ConfirmationDialogProvider>
    </QueryClientProvider>,
  );
};

const renderUseLayeringApprovalList = () => {
  return renderHook(() => useLayeringApprovalList(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe('page layering approval', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = renderPage();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('renders a loading state', () => {
    const { getByText, getByTestId } = wrapper;

    const pageTitle = getByText('pageTitle');
    expect(pageTitle).toBeInTheDocument();

    expect(getByText('pageTitle')).toBeInTheDocument();
    expect(getByText('pageActionAdd')).toBeInTheDocument();

    const loadingNode = getByTestId('loading-state');
    expect(loadingNode).toBeInTheDocument();
    expect(loadingNode).toMatchSnapshot();
  });

  test('renders empty state', () => {
    const { getByText } = wrapper;

    expect(getByText('tableEmptyTitle')).toBeInTheDocument();
    expect(getByText('tableEmptyDescription')).toBeInTheDocument();
  });

  beforeEach(() => {
    mockApLayerList = createDummy(15).map(() => mockApLayerData);
  });

  it('should render the component table and value without crashing', () => {
    expect(screen.getByText('pageTitle')).toBeInTheDocument();

    expect(screen.getByText('tableHeaderMenu')).toBeInTheDocument();
    expect(
      screen.getByText('tableHeaderLayeringApprovalAmount'),
    ).toBeInTheDocument();
    expect(screen.getByText('tableHeaderRole')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderAction')).toBeInTheDocument();

    const textValueMenu = screen.getAllByText('Layering admin');
    textValueMenu.forEach(element => {
      expect(element).toBeInTheDocument();
    });
    const textValueId = screen.getAllByText('1a2b3c4d');
    textValueId.forEach(element => {
      expect(element).toBeInTheDocument();
    });
    const textValueRole = screen.getAllByText('Admin, User');
    textValueRole.forEach(element => {
      expect(element).toBeInTheDocument();
    });
  });

  it('handle click detail', () => {
    const buttonDetail = screen.getAllByText('tableActionDetail');

    fireEvent.click(buttonDetail[0]);

    expect(CreateLayeringApprovalModal).toHaveBeenCalled();
  });

  it('handle add layer approval', () => {
    const buttonAdd = screen.getByText('pageActionAdd');

    fireEvent.click(buttonAdd);

    expect(CreateLayeringApprovalModal).toHaveBeenCalled();
  });

  it('handle filter', () => {
    const inputMenu = screen.getByPlaceholderText('placeholderType');
    fireEvent.change(inputMenu, { target: { value: 'Test Menu' } });

    expect(useApprovalLayerListFetcher).toHaveBeenCalled();
  });

  it('handle change pagination', () => {
    const buttonNext = screen.getByLabelText('Go to next page');
    expect(buttonNext).toBeInTheDocument();

    fireEvent.click(buttonNext);

    expect(CreateLayeringApprovalModal).toHaveBeenCalled();
  });
});

describe('hook layering approval', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = renderUseLayeringApprovalList();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('success renders useLayeringApprovalList without error', () => {
    const { result } = wrapper;
    expect(result.error).toBeUndefined();
  });

  it('handles refetch detail data', () => {
    const { result } = wrapper;
    act(() => {
      result.current.fetchApprovalLayerList();
    });
    expect(useApprovalLayerListFetcher).toHaveBeenCalled();
  });

  it('handles sorting', () => {
    const { result } = wrapper;
    const columnId: keyof ApprovalLayerData = 'role';
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
