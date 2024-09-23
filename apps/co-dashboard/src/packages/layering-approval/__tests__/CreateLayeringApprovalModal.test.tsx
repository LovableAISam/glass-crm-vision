import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ConfirmationDialogProvider } from '@woi/web-component';
import CreateLayeringApprovalModal from '../components/CreateLayeringApprovalModal';
import useLayeringApprovalUpsert from '../hooks/useLayeringApprovalUpsert';

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

let mockIsFilledForm = true;

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
      (onSubmit: (data: any) => void) => () =>
        onSubmit({
          menu: {
            label: 'CO Account Management',
            value: '7fce3752-f367-41c0-b216-0259823328f6',
          },
          roles: mockIsFilledForm
            ? [
                {
                  role: {
                    label: 'system_admin',
                    value: 'adb2aba6-c408-482d-8e49-8ee691e07709',
                  },
                },
              ]
            : [],
        }),
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

let mockErrorCreate = false;
let mockErrorDelete = false;

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useRoleListFetcher: jest.fn(() => ({
    result: {
      data: [
        {
          name: 'Role 1',
          id: 'idRole1',
        },
      ],
    },
    status: 'success',
    refetch: jest.fn(),
  })),
  useMenuApprovalLayerListFetcher: jest.fn(() => ({
    result: {
      data: [
        {
          name: 'Menu 1',
          id: 'idMenu1',
        },
      ],
    },
    status: 'success',
    refetch: jest.fn(),
  })),
  useApprovalLayerDetailFetcher: jest.fn(() => ({
    result: {
      menu: 'Menu Name',
      menuId: 'MenuId',
      role: [
        {
          role: 'Admin',
          roleId: 'admin123',
        },
      ],
    },
    status: 'success',
    refetch: jest.fn(),
  })),
  useApprovalLayerCreateFetcher: jest.fn(() => ({
    error: mockErrorCreate,
  })),
  useApprovalLayerMenuDeleteFetcher: jest.fn(() => ({
    error: mockErrorDelete,
  })),
}));

let mockSelectedData: any = {
  id: '1a2b3c4d',
  createdDate: '2023-01-01T12:00:00Z',
  modifiedDate: '2023-01-02T15:30:00Z',
  menuId: 'abcd1234',
  menu: 'Nasi Goreng',
  total: 50.25,
  role: [
    {
      id: '1a2b3c4d',
      createdDate: '2023-01-01T12:00:00Z',
      modifiedDate: '2023-01-02T15:30:00Z',
      role: 'Admin',
      roleId: 'admin123',
      level: 3,
    },
  ],
};

const renderPageCreate = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ConfirmationDialogProvider>
        <CreateLayeringApprovalModal
          isActive
          onHide={jest.fn()}
          selectedData={null}
          fetchApprovalLayerList={jest.fn()}
        />
      </ConfirmationDialogProvider>
    </QueryClientProvider>,
  );
};

const renderPageUpdate = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ConfirmationDialogProvider>
        <CreateLayeringApprovalModal
          isActive
          onHide={jest.fn()}
          selectedData={mockSelectedData}
          fetchApprovalLayerList={jest.fn()}
        />
      </ConfirmationDialogProvider>
    </QueryClientProvider>,
  );
};

const renderUseLayeringApprovalUpsert = () => {
  return renderHook(
    () =>
      useLayeringApprovalUpsert({
        selectedData: null,
        fetchApprovalLayerList: jest.fn(),
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
  it('renders component correctly', async () => {
    let renderPage: any;
    await act(async () => {
      renderPage = renderPageCreate();
    });

    expect(screen.getByText('modalCreateTitle')).toBeInTheDocument();

    renderPage.unmount();
  });

  it('handles save success response', async () => {
    let renderPage: any;
    await act(async () => {
      renderPage = renderPageCreate();
    });

    const inputSelectMenu = screen.getAllByPlaceholderText('placeholderSelect');
    fireEvent.click(inputSelectMenu[0]);
    fireEvent.change(inputSelectMenu[0], {
      target: { value: 'Menu 1' },
    });
    expect(inputSelectMenu[0]).toHaveValue('Menu 1');

    fireEvent.click(screen.getByText('actionAddLayer'));

    fireEvent.click(inputSelectMenu[1]);
    fireEvent.change(inputSelectMenu[1], {
      target: { value: 'Role 1' },
    });
    expect(inputSelectMenu[1]).toHaveValue('Role 1');

    fireEvent.click(screen.getByText('actionAddLayer'));

    fireEvent.click(screen.getByTestId('ButtonRemove'));

    fireEvent.click(screen.getByText('actionCancel'));

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', {
          name: 'confirmationCancelCreateYes',
        }),
      );
    });

    fireEvent.click(screen.getByText('actionSave'));

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', {
          name: 'confirmationCreateYes',
        }),
      );
    });

    renderPage.unmount();
  });

  it('handles save failed response', async () => {
    mockErrorCreate = true;
    let renderPage: any;
    await act(async () => {
      renderPage = renderPageCreate();
    });

    fireEvent.click(screen.getByText('actionSave'));

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', {
          name: 'confirmationCreateYes',
        }),
      );
    });

    renderPage.unmount();
  });

  it('handles save failed with no role', async () => {
    mockIsFilledForm = false;
    mockErrorCreate = true;
    let renderPage: any;
    await act(async () => {
      renderPage = renderPageCreate();
    });

    fireEvent.click(screen.getByText('actionSave'));

    renderPage.unmount();
  });

  it('renders component as update', async () => {
    let renderPage: any;
    await act(async () => {
      renderPage = renderPageUpdate();
    });

    expect(screen.getByText('modalUpdateTitle')).toBeInTheDocument();

    renderPage.unmount();
  });

  it('handle delete success response', async () => {
    let renderPage: any;
    await act(async () => {
      renderPage = renderPageUpdate();
    });

    fireEvent.click(screen.getByText('actionDelete'));

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', {
          name: 'confirmationDeleteYes',
        }),
      );
    });

    renderPage.unmount();
  });

  it('handle delete failed response', async () => {
    mockErrorDelete = true;
    let renderPage: any;
    await act(async () => {
      renderPage = renderPageUpdate();
    });

    fireEvent.click(screen.getByText('actionDelete'));

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', {
          name: 'confirmationDeleteYes',
        }),
      );
    });

    renderPage.unmount();
  });
});

describe('hook layering approval upsert', () => {
  it('success renders useLayeringApprovalUpsert without error', async () => {
    let render: any;

    await act(async () => {
      render = renderUseLayeringApprovalUpsert();
    });
    const { result, unmount } = render;

    expect(result.error).toBeUndefined();

    unmount();
  });
});
