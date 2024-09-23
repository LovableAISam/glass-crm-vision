import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CreateEmailManagementModal, {
  CreateEmailManagementModalProps,
} from '../components/CreateEmailManagementModal';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import useEmailContentUpsert from '../hooks/useEmailContentUpsert';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ConfirmationDialogProvider } from '@woi/web-component';

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

const mockOnHide = jest.fn();

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: jest.fn(() => ({
    reset: jest.fn(),
    watch: jest.fn(() => ({
      multipleContent: [{ description: '' }],
      contentName: false,
    })),
    control: jest.fn(),
    setValue: jest.fn(),
    register: jest.fn(),
    getValues: jest.fn(() => 'hai'),
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
    fields: [{ fieldSubject: 'title' }],
  })),
}));

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useConfirmationDialog: jest.fn(() => ({
    getConfirmation: new Promise(() => true),
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

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: jest.fn(() => ({
    enqueueSnackbar: jest.fn(),
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

const mockDetailEmailContent = {
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

let mockResponseErrorCreate = false;
let mockResponseErrorUpdate = false;

let mockDetailResponseError: any = false;

let mockResponseErrorDelete = false;

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useEmailContentDetailFetcher: jest.fn(() => ({
    result: mockDetailEmailContent,
    status: 'success',
    refetch: jest.fn(),
  })),
  useTransactionTypeOptionListFetcher: jest.fn(() => ({
    result: {
      'fg1789c4-30f0-21d1-adbb-1d1bad469d0b': 'Pay to Merchant',
      '6d30a898-cae9-752a-83e2-7ea0391b13f6': 'Welcome to VYBE',
    },
    status: 'success',
    refetch: jest.fn(),
  })),
  useEmailContentDeleteFetcher: jest.fn(() => ({
    error: mockResponseErrorDelete,
  })),
  useEmailContentCreateFetcher: jest.fn(() => ({
    error: mockResponseErrorCreate,
    errorData: { details: mockDetailResponseError },
  })),
  useEmailContentUpdateFetcher: jest.fn(() => ({
    error: mockResponseErrorUpdate,
    errorData: { details: mockDetailResponseError },
  })),
}));

const mockPropsCreate: CreateEmailManagementModalProps = {
  isActive: true,
  onHide: jest.fn(),
  selectedData: null,
  fetchEmailContentList: jest.fn(),
};

const renderPageCreate = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ConfirmationDialogProvider>
        <CreateEmailManagementModal {...mockPropsCreate} />
      </ConfirmationDialogProvider>
    </QueryClientProvider>,
  );
};

const renderUseEmailContentUpsert = () => {
  return renderHook(
    () =>
      useEmailContentUpsert({
        selectedData: null,
        fetchEmailContentList: jest.fn(),
        onHide: mockOnHide,
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

describe('CreateEmailManagementModal component', () => {
  it('renders component correctly', () => {
    const renderPage = renderPageCreate();

    expect(screen.getByText('modalCreateTitle')).toBeInTheDocument();

    renderPage.unmount();
  });

  it('handles select type content', () => {
    const renderPage = renderPageCreate();

    const inputSelectStatus = screen.getByPlaceholderText('placeholderSelect');
    fireEvent.click(inputSelectStatus);
    fireEvent.change(inputSelectStatus, {
      target: { value: 'Welcome to VYBE' },
    });
    expect(inputSelectStatus).toHaveValue('Welcome to VYBE');

    renderPage.unmount();
  });

  it('renders component with data correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ConfirmationDialogProvider>
          <CreateEmailManagementModal
            {...mockPropsCreate}
            selectedData={mockDetailEmailContent}
          />
        </ConfirmationDialogProvider>
      </QueryClientProvider>,
    );
  });

  it('handles cancel', async () => {
    const renderPage = renderPageCreate();

    fireEvent.click(screen.getByText('actionCancel'));

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', {
          name: 'confirmationCancelCreateYes',
        }),
      );
    });

    waitFor(() => {
      expect(mockOnHide).toHaveBeenCalled();
    });

    renderPage.unmount();
  });

  it('handles delete success', async () => {
    mockResponseErrorDelete = false;
    const renderPage = render(
      <QueryClientProvider client={queryClient}>
        <ConfirmationDialogProvider>
          <CreateEmailManagementModal
            {...mockPropsCreate}
            selectedData={mockDetailEmailContent}
          />
        </ConfirmationDialogProvider>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('actionDelete'));

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', {
          name: 'confirmationDeleteYes',
        }),
      );
    });

    waitFor(() => {
      expect(mockOnHide).toHaveBeenCalled();
    });

    renderPage.unmount();
  });

  it('handles delete failed', async () => {
    mockResponseErrorDelete = true;
    const renderPage = render(
      <QueryClientProvider client={queryClient}>
        <ConfirmationDialogProvider>
          <CreateEmailManagementModal
            {...mockPropsCreate}
            selectedData={mockDetailEmailContent}
          />
        </ConfirmationDialogProvider>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('actionDelete'));

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', {
          name: 'confirmationDeleteYes',
        }),
      );
    });

    waitFor(() => {
      expect(mockOnHide).toHaveBeenCalled();
    });

    renderPage.unmount();
  });

  it('handles active/deactive', async () => {
    const { unmount } = render(
      <QueryClientProvider client={queryClient}>
        <ConfirmationDialogProvider>
          <CreateEmailManagementModal
            {...mockPropsCreate}
            selectedData={mockDetailEmailContent}
          />
        </ConfirmationDialogProvider>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByTestId('buttonActiveDeactive'));

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', {
          name: 'confirmationDeactivateYes',
        }),
      );
    });

    waitFor(() => {
      expect(mockOnHide).toHaveBeenCalled();
    });

    unmount();
  });

  it('handles handleUpsert create failed without detail', async () => {
    mockResponseErrorCreate = true;
    mockDetailResponseError = false;
    const { unmount } = await render(
      <QueryClientProvider client={queryClient}>
        <ConfirmationDialogProvider>
          <CreateEmailManagementModal {...mockPropsCreate} />
        </ConfirmationDialogProvider>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('actionSave'));

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', {
          name: 'confirmationCreateYes',
        }),
      );
    });

    unmount();
  });

  it('handles handleUpsert create failed with detail', async () => {
    mockResponseErrorCreate = true;
    mockDetailResponseError = 'Update failed';
    const { unmount } = await render(
      <QueryClientProvider client={queryClient}>
        <ConfirmationDialogProvider>
          <CreateEmailManagementModal {...mockPropsCreate} />
        </ConfirmationDialogProvider>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('actionSave'));

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', {
          name: 'confirmationCreateYes',
        }),
      );
    });

    unmount();
  });

  it('handles handleUpsert update success', async () => {
    const { unmount } = await render(
      <QueryClientProvider client={queryClient}>
        <ConfirmationDialogProvider>
          <CreateEmailManagementModal
            {...mockPropsCreate}
            selectedData={mockDetailEmailContent}
          />
        </ConfirmationDialogProvider>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('actionSave'));

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', {
          name: 'confirmationUpdateYes',
        }),
      );
    });

    unmount();
  });

  it('handles handleUpsert update failed without detail', async () => {
    mockResponseErrorUpdate = true;
    mockDetailResponseError = false;
    const { unmount } = await render(
      <QueryClientProvider client={queryClient}>
        <ConfirmationDialogProvider>
          <CreateEmailManagementModal
            {...mockPropsCreate}
            selectedData={mockDetailEmailContent}
          />
        </ConfirmationDialogProvider>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('actionSave'));

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', {
          name: 'confirmationUpdateYes',
        }),
      );
    });

    unmount();
  });

  it('handles handleUpsert update failed with detail', async () => {
    mockResponseErrorUpdate = true;
    mockDetailResponseError = 'This eror uknown';
    const { unmount } = await render(
      <QueryClientProvider client={queryClient}>
        <ConfirmationDialogProvider>
          <CreateEmailManagementModal
            {...mockPropsCreate}
            selectedData={mockDetailEmailContent}
          />
        </ConfirmationDialogProvider>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('actionSave'));

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', {
          name: 'confirmationUpdateYes',
        }),
      );
    });

    unmount();
  });
});

describe('hook email content management', () => {
  it('success renders useEmailContentList without error', () => {
    const { result, unmount } = renderUseEmailContentUpsert();

    waitFor(() => {
      expect(result.error).toBeUndefined();
    });

    unmount();
  });

  it('handle delete', async () => {
    const render = await renderUseEmailContentUpsert();
    const { result, unmount } = render;

    act(() => {
      result.current.handleDelete();
    });

    unmount();
  });

  it('handles handleCancel', () => {
    const { result } = renderUseEmailContentUpsert();

    act(() => {
      result.current.handleCancel();
    });
  });
});
