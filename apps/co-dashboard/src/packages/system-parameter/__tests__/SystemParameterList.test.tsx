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
import SystemParameterList from '../SystemParameterList';
import useSystemParameterList from '../hooks/useSystemParameterList';
import {
  useSystemParameterDetailFetcher,
  useSystemParameterListFetcher,
} from '@woi/service/co';
import { SystemParameterData } from '@woi/service/co/admin/systemParameter/systemParameterList';

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ConfirmationDialogProvider>
        <SystemParameterList />
      </ConfirmationDialogProvider>
    </QueryClientProvider>,
  );
};

const renderUseSystemParameterList = () => {
  return renderHook(() => useSystemParameterList(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe('page system parameter', () => {
  test('renders a loading state', () => {
    const { getByText, getByTestId, unmount, getAllByText } = renderPage();

    const pageTitle = getByText('System Parameter');
    expect(pageTitle).toBeInTheDocument();

    const textCode = getAllByText('Code');
    textCode.forEach(element => {
      expect(element).toBeInTheDocument();
    });

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
    mockSystemParameterDataList = createDummy(10).map(
      () => mockSystemParameterData,
    );
    const { getAllByText, unmount } = renderPage();

    const textValueCode = getAllByText('ABC123');
    textValueCode.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    const textValueType = getAllByText('Lorem Ipsum');
    textValueType.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    const textValueDescription = getAllByText('Mock data for testing purposes');
    textValueDescription.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    const textActionDetail = getAllByText('tableActionDetail');
    textActionDetail.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    unmount();
  });

  it('handle detail', async () => {
    const { unmount } = renderPage();
    const buttonDetail = screen.getAllByText('tableActionDetail')[0];

    await act(async () => {
      fireEvent.click(buttonDetail);
    });

    expect(useSystemParameterDetailFetcher).toHaveBeenCalled();

    unmount();
  });

  it('handle add & close', async () => {
    const { unmount } = renderPage();

    const buttonCreate = screen.getByText('Add System Parameter');
    fireEvent.click(buttonCreate);

    const buttonClose = screen.getByTestId('closeButton');
    fireEvent.click(buttonClose);

    unmount();
  });

  it('handle filter role name', () => {
    const { unmount } = renderPage();

    const inputCode = screen.getByPlaceholderText('placeholderType');
    fireEvent.change(inputCode, { target: { value: 'Test Code' } });

    expect(useSystemParameterListFetcher).toHaveBeenCalled();

    unmount();
  });

  it('handle change pagination', () => {
    const { unmount } = renderPage();
    const buttonNext = screen.getByLabelText('Go to next page');
    expect(buttonNext).toBeInTheDocument();

    fireEvent.click(buttonNext);
    expect(useSystemParameterListFetcher).toHaveBeenCalled();

    unmount();
  });

  it('handle sort', () => {
    const { unmount } = renderPage();

    fireEvent.click(screen.getAllByText('Code')[1]);

    expect(useSystemParameterListFetcher).toHaveBeenCalled();

    unmount();
  });
});

describe('hook system parameter', () => {
  it('success renders useSystemParameterList without error', () => {
    const { result } = renderUseSystemParameterList();
    expect(result.error).toBeUndefined();
  });

  it('handles refetch data', () => {
    const { result } = renderUseSystemParameterList();
    act(() => {
      result.current.fetchSystemParameterList();
    });
    expect(useSystemParameterListFetcher).toHaveBeenCalled();
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

const mockSystemParameterData: SystemParameterData = {
  createdDate: '2023-11-28T12:00:00Z',
  modifiedDate: '2023-11-28T14:30:00Z',
  code: 'ABC123',
  valueType: 'Text',
  valueDate: '2023-12-01',
  valueText: 'Lorem Ipsum',
  id: '123456789',
  description: 'Mock data for testing purposes',
};

let mockSystemParameterDataList = createDummy(0).map(
  () => mockSystemParameterData,
);

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useSystemParameterListFetcher: jest.fn(() => ({
    result: {
      currentPage: 0,
      totalElements: 15,
      totalPages: 2,
      data: mockSystemParameterDataList,
    },
    status: 'success',
    refetch: jest.fn(),
  })),
  useSystemParameterDetailFetcher: jest.fn(() => ({
    result: {
      createdDate: '2023-11-16T18:33:00.311873Z',
      modifiedDate: '2023-11-16T18:33:00.311873Z',
      code: 'END_HOUR_AMLA_REPORT_SCHEDULER',
      valueType: 'Text',
      valueText: '21:59:59',
      description: 'End Hour for Generate AMLA Report',
      id: '3483ae51-7c38-47b4-808b-71871859ad70',
    },
    error: false,
  })),
}));

jest.mock('../hooks/useSystemParameterList', () => ({
  __esModule: true,
  default: (props: { showModal: () => void; idSelectedContent: string }) => ({
    ...jest.requireActual('../hooks/useSystemParameterList').default(props),
    pagination: {
      currentPage: 0,
      limit: 10,
      totalPages: 3,
      totalElements: 25,
    },
    systemParameterData: mockSystemParameterDataList,
  }),
}));

const mockReset = jest.fn();

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: jest.fn(() => ({
    reset: mockReset,
    watch: jest.fn(() => ({
      multipleContent: [{ description: '' }],
      contentName: false,
    })),
    control: jest.fn(),
    setValue: jest.fn(),
    register: jest.fn(),
    getValues: jest.fn(() => 'text'),
    handleSubmit: jest.fn(
      (onSubmit: (data: any) => void) => (e: any) => onSubmit(e),
    ),
    formState: { errors: jest.fn() },
  })),
  useFieldArray: jest.fn(() => ({
    fields: [{ title: 'title' }],
    append: jest.fn(),
    remove: jest.fn(),
  })),
  useController: jest.fn(() => ({
    fields: [{ valueDate: '' }],
  })),
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
