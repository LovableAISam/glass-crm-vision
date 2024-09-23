import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { renderHook } from '@testing-library/react-hooks';
import { ConfirmationDialogProvider } from '@woi/web-component';
import createDummy from '@woi/core/utils/dummy';
import SMSContentManagementList from '../SMSContentManagementList';
import useSMSContentList from '../hooks/useSMSContentList';
import { useSMSContentListFetcher } from '@woi/service/co';
import { SMSContentData } from '@woi/service/co/admin/smsContent/smsContentList';

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ConfirmationDialogProvider>
        <SMSContentManagementList />
      </ConfirmationDialogProvider>
    </QueryClientProvider>,
  );
};

const renderUseSMSContentList = () => {
  return renderHook(() => useSMSContentList(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe('page sms content management', () => {
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
    mockSMSContentList = createDummy(15).map(() => mockSMSContentData);
  });

  it('should render the component table and value without crashing', () => {
    expect(screen.getByText('pageTitle')).toBeInTheDocument();

    expect(screen.getByText('tableHeaderSubject')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderContent')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderType')).toBeInTheDocument();
    expect(screen.getByText('tableHeaderAction')).toBeInTheDocument();

    const textActionDetail = screen.getAllByText('tableActionDetail');
    textActionDetail.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    const textValueSubject = screen.getAllByText('Welcome to VYBE');
    textValueSubject.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    const textValueType = screen.getAllByText('Register Vybe Lite');
    textValueType.forEach(element => {
      expect(element).toBeInTheDocument();
    });
  });

  it('handle detail', () => {
    const buttonDetail = screen.getAllByText('tableActionDetail')[0];
    expect(buttonDetail).toBeInTheDocument();

    fireEvent.click(buttonDetail);

    expect(screen.getByText('Button Close Create Modal')).toBeInTheDocument();
  });

  it('handle change pagination', () => {
    const buttonNext = screen.getByLabelText('Go to next page');
    expect(buttonNext).toBeInTheDocument();

    fireEvent.click(buttonNext);

    waitFor(() => {
      expect(useSMSContentList).toHaveBeenCalled();
    });
  });

  it('handle create', () => {
    const buttonAdd = screen.getByText('pageActionAdd');
    expect(buttonAdd).toBeInTheDocument();

    fireEvent.click(buttonAdd);

    expect(screen.getByText('Button Close Create Modal')).toBeInTheDocument();
  });
});

describe('hook sms content management', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = renderUseSMSContentList();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('success renders useSMSContentList without error', () => {
    const { result } = wrapper;
    expect(result.error).toBeUndefined();
  });

  it('handle getSortPayload', () => {
    const { result } = wrapper;

    let resultSortPayload = '';
    act(() => {
      resultSortPayload = result.current.getSortPayload('subject');
    });
    expect(resultSortPayload).toEqual('subject');

    act(() => {
      resultSortPayload = result.current.getSortPayload('transactionType');
    });
    expect(resultSortPayload).toEqual('transactionType.name');
  });

  it('handles refetch data', async () => {
    const { result } = wrapper;
    await act(async () => {
      result.current.fetchSMSContentList();
    });
    expect(useSMSContentListFetcher).toHaveBeenCalled();
  });

  it('handles sorting', () => {
    const { result } = wrapper;
    const columnId: keyof SMSContentData = 'subject';
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

// Mock Data

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

jest.mock('../hooks/useSMSContentList', () => ({
  __esModule: true,
  default: (props: { showModal: () => void; idSelectedContent: string }) => ({
    ...jest.requireActual('../hooks/useSMSContentList').default(props),
    pagination: {
      currentPage: 0,
      limit: 10,
      totalPages: 3,
      totalElements: 25,
    },
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

jest.mock('../components/CreateSMSContentManagementModal', () => {
  return jest.fn(props => {
    return (
      <div>
        <button onClick={() => props.onHide(null)}>
          Button Close Create Modal
        </button>
      </div>
    );
  });
});

const mockSMSContentData = {
  id: '4cba4af0-e19c-4fc8-96df-adb6b24a6f12',
  createdDate: '2023-11-16T18:33:02.011686Z',
  modifiedDate: '2023-11-16T18:33:02.011686Z',
  subject: 'Welcome to VYBE',
  content:
    '<p>Dear <strong>{userName}</strong>,</p><p>Welcome to VYBE! Your registration reference number is {referenceID}.</p>',
  createdBy: '2023-11-16T18:33:02.011686Z',
  transactionType: {
    id: '57b07529-86f3-c6e4-98b4-660d951129b0',
    createdDate: '2023-11-16T18:33:02.011686Z',
    modifiedDate: '2023-11-16T18:33:02.011686Z',
    code: 'REGISTERVYBELITE',
    name: 'Register Vybe Lite',
    description: 'Register Vybe Lite',
    createdBy: '2023-11-16T18:33:02.011686Z',
  },
};

let mockSMSContentList: SMSContentData[] = createDummy(0).map(
  () => mockSMSContentData,
);

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useSMSContentListFetcher: jest.fn(() => ({
    result: {
      currentPage: 0,
      totalElements: 15,
      totalPages: 2,
      data: mockSMSContentList,
    },
    response: {
      currentPage: 0,
      totalElements: 15,
      totalPages: 2,
      data: mockSMSContentList,
    },
    status: 'success',
    refetch: jest.fn(),
  })),
}));
