import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ConfirmationDialogProvider } from '@woi/web-component';
import ViewKYCRequestModal from '../components/ViewKYCRequestModal';
import useKycRequestUpsert from '../hooks/useKycRequstUpsert';
import { useSnackbar } from 'notistack';

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

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {
      coName: 'co',
    },
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

jest.mock('../components/ViewKYCRequest/ViewKYCRequestTab', () =>
  jest.fn(({ children }) => <div>{children}</div>),
);

let mockErrorDttotUpdate = false;

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  useKycPremiumMemberDetailFetcher: jest.fn(() => ({
    error: false,
    result: {
      identityCardUrl: 'url',
      selfieUrl: 'url',
      signatureUrl: 'url',
      status: 'UNREGISTERED',
      isDttot: true,
    },
  })),
  useMemberDetailFetcher: jest.fn(() => ({
    error: false,
    result: {
      identityCardUrl: 'url',
      selfieUrl: 'url',
      signatureUrl: 'url',
    },
  })),
  useKycPremiumMemberDttotUpdateFetcher: jest.fn(() => ({
    error: mockErrorDttotUpdate,
  })),
}));

const mockPropsCreate = {
  isActive: true,
  isHistory: false,
  onHide: jest.fn(),
  selectedId: null,
  fetchKycRequestList: jest.fn(),
};

let mockKycDetailStatus: any = 'UNREGISTERED';

jest.mock('../hooks/useKycRequstUpsert', () => ({
  __esModule: true,
  default: (props: { showModal: () => void; idSelectedContent: string }) => ({
    ...jest.requireActual('../hooks/useKycRequstUpsert').default(props),
    kycDetail: {
      status: mockKycDetailStatus,
      isDttot: false,
      phoneNumber: '082282242222',
      fullName: 'Test Name',
      occupation: {
        name: 'Occ Name',
      },
    },
  }),
}));

const renderPageCreate = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ConfirmationDialogProvider>
        <ViewKYCRequestModal {...mockPropsCreate} />
      </ConfirmationDialogProvider>
    </QueryClientProvider>,
  );
};

const renderUseKycRequestUpsert = () => {
  return renderHook(
    () =>
      useKycRequestUpsert({
        selectedId: '123',
        fetchKycRequestList: jest.fn(),
        onHide: mockOnHide,
      }),
    {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          <ConfirmationDialogProvider>{children}</ConfirmationDialogProvider>
        </QueryClientProvider>
      ),
    },
  );
};

describe('ViewKYCRequestModal component', () => {
  it('renders component correctly with status unregistered', () => {
    const renderPage = renderPageCreate();

    expect(screen.getByText('modalDetailTitle')).toBeInTheDocument();
    expect(screen.getByText('statusUnregistered')).toBeInTheDocument();

    renderPage.unmount();
  });

  it('renders component correctly with status waiting to verify', () => {
    mockKycDetailStatus = 'WAITING_TO_REVIEW';
    const renderPage = renderPageCreate();

    expect(screen.getByText('statusWaitingToVerify')).toBeInTheDocument();

    renderPage.unmount();
  });

  it('renders component correctly with status approved', () => {
    mockKycDetailStatus = 'PREMIUM';
    const renderPage = renderPageCreate();

    expect(screen.getByText('statusApproved')).toBeInTheDocument();

    renderPage.unmount();
  });

  it('renders component correctly with status rejected', () => {
    mockKycDetailStatus = 'REJECTED';
    const renderPage = renderPageCreate();

    expect(screen.getByText('statusRejected')).toBeInTheDocument();

    renderPage.unmount();
  });

  it('renders component correctly with status none', () => {
    mockKycDetailStatus = 'NONE';
    const renderPage = renderPageCreate();

    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.getByText('detailTabAccountInformation')).toBeInTheDocument();

    renderPage.unmount();
  });

  it('handles register dttot success and show snackbar', async () => {
    mockKycDetailStatus = 'WAITING_TO_REVIEW';
    const renderPage = renderPageCreate();

    const inputSelectStatus = screen.getByTestId('ButtonOpenInNewIcon');
    fireEvent.click(inputSelectStatus);

    await act(async () => {
      await fireEvent.click(
        screen.getByRole('button', {
          name: 'confirmationRegisteredDTTOTNo',
        }),
      );
    });

    expect(useSnackbar).toHaveBeenCalled();

    renderPage.unmount();
  });

  it('handles register dttot failed and show snackbar', async () => {
    mockKycDetailStatus = 'WAITING_TO_REVIEW';
    mockErrorDttotUpdate = true;
    const renderPage = renderPageCreate();

    const inputSelectStatus = screen.getByTestId('ButtonOpenInNewIcon');
    fireEvent.click(inputSelectStatus);

    await act(async () => {
      await fireEvent.click(
        screen.getByRole('button', {
          name: 'confirmationRegisteredDTTOTNo',
        }),
      );
    });

    expect(useSnackbar).toHaveBeenCalled();

    renderPage.unmount();
  });

  it('handles verify member success', async () => {
    const renderPage = renderPageCreate();

    const buttonVerify = screen.getByText('actionVerifyThisMember');
    fireEvent.click(buttonVerify);

    expect(screen.getByText('detailRegisteredAsDTTOT')).toBeInTheDocument();

    renderPage.unmount();
  });

  // it('renders component with data correctly', () => {
  //   render(
  //     <QueryClientProvider client={queryClient}>
  //       <ConfirmationDialogProvider>
  //         <ViewKYCRequestModal {...mockPropsCreate} />
  //       </ConfirmationDialogProvider>
  //     </QueryClientProvider>,
  //   );
  // });

  // it('handles cancel', async () => {
  //   const renderPage = renderPageCreate();

  //   fireEvent.click(screen.getByText('actionCancel'));

  //   await act(async () => {
  //     fireEvent.click(
  //       screen.getByRole('button', {
  //         name: 'confirmationCancelCreateYes',
  //       }),
  //     );
  //   });

  //   waitFor(() => {
  //     expect(mockOnHide).toHaveBeenCalled();
  //   });

  //   renderPage.unmount();
  // });

  // it('handles delete success', async () => {
  //   mockResponseErrorDelete = false;
  //   const renderPage = render(
  //     <QueryClientProvider client={queryClient}>
  //       <ConfirmationDialogProvider>
  //         <ViewKYCRequestModal {...mockPropsCreate} />
  //       </ConfirmationDialogProvider>
  //     </QueryClientProvider>,
  //   );

  //   fireEvent.click(screen.getByText('actionDelete'));

  //   await act(async () => {
  //     fireEvent.click(
  //       screen.getByRole('button', {
  //         name: 'confirmationDeleteYes',
  //       }),
  //     );
  //   });

  //   waitFor(() => {
  //     expect(mockOnHide).toHaveBeenCalled();
  //   });

  //   renderPage.unmount();
  // });

  // it('handles delete failed', async () => {
  //   mockResponseErrorDelete = true;
  //   const renderPage = render(
  //     <QueryClientProvider client={queryClient}>
  //       <ConfirmationDialogProvider>
  //         <ViewKYCRequestModal {...mockPropsCreate} />
  //       </ConfirmationDialogProvider>
  //     </QueryClientProvider>,
  //   );

  //   fireEvent.click(screen.getByText('actionDelete'));

  //   await act(async () => {
  //     fireEvent.click(
  //       screen.getByRole('button', {
  //         name: 'confirmationDeleteYes',
  //       }),
  //     );
  //   });

  //   waitFor(() => {
  //     expect(mockOnHide).toHaveBeenCalled();
  //   });

  //   renderPage.unmount();
  // });

  // it('handles active/deactive', async () => {
  //   const { unmount } = render(
  //     <QueryClientProvider client={queryClient}>
  //       <ConfirmationDialogProvider>
  //         <ViewKYCRequestModal {...mockPropsCreate} />
  //       </ConfirmationDialogProvider>
  //     </QueryClientProvider>,
  //   );

  //   fireEvent.click(screen.getByTestId('buttonActiveDeactive'));

  //   await act(async () => {
  //     fireEvent.click(
  //       screen.getByRole('button', {
  //         name: 'confirmationDeactivateYes',
  //       }),
  //     );
  //   });

  //   waitFor(() => {
  //     expect(mockOnHide).toHaveBeenCalled();
  //   });

  //   unmount();
  // });

  // it('handles handleUpsert create failed without detail', async () => {
  //   mockResponseErrorCreate = true;
  //   mockDetailResponseError = false;
  //   const { unmount } = await render(
  //     <QueryClientProvider client={queryClient}>
  //       <ConfirmationDialogProvider>
  //         <ViewKYCRequestModal {...mockPropsCreate} />
  //       </ConfirmationDialogProvider>
  //     </QueryClientProvider>,
  //   );

  //   fireEvent.click(screen.getByText('actionSave'));

  //   await act(async () => {
  //     fireEvent.click(
  //       screen.getByRole('button', {
  //         name: 'confirmationCreateYes',
  //       }),
  //     );
  //   });

  //   unmount();
  // });

  // it('handles handleUpsert create failed with detail', async () => {
  //   mockResponseErrorCreate = true;
  //   mockDetailResponseError = 'Update failed';
  //   const { unmount } = await render(
  //     <QueryClientProvider client={queryClient}>
  //       <ConfirmationDialogProvider>
  //         <ViewKYCRequestModal {...mockPropsCreate} />
  //       </ConfirmationDialogProvider>
  //     </QueryClientProvider>,
  //   );

  //   fireEvent.click(screen.getByText('actionSave'));

  //   await act(async () => {
  //     fireEvent.click(
  //       screen.getByRole('button', {
  //         name: 'confirmationCreateYes',
  //       }),
  //     );
  //   });

  //   unmount();
  // });

  // it('handles handleUpsert update success', async () => {
  //   const { unmount } = await render(
  //     <QueryClientProvider client={queryClient}>
  //       <ConfirmationDialogProvider>
  //         <ViewKYCRequestModal {...mockPropsCreate} />
  //       </ConfirmationDialogProvider>
  //     </QueryClientProvider>,
  //   );

  //   fireEvent.click(screen.getByText('actionSave'));

  //   await act(async () => {
  //     fireEvent.click(
  //       screen.getByRole('button', {
  //         name: 'confirmationUpdateYes',
  //       }),
  //     );
  //   });

  //   unmount();
  // });

  // it('handles handleUpsert update failed without detail', async () => {
  //   mockResponseErrorUpdate = true;
  //   mockDetailResponseError = false;
  //   const { unmount } = await render(
  //     <QueryClientProvider client={queryClient}>
  //       <ConfirmationDialogProvider>
  //         <ViewKYCRequestModal {...mockPropsCreate} />
  //       </ConfirmationDialogProvider>
  //     </QueryClientProvider>,
  //   );

  //   fireEvent.click(screen.getByText('actionSave'));

  //   await act(async () => {
  //     fireEvent.click(
  //       screen.getByRole('button', {
  //         name: 'confirmationUpdateYes',
  //       }),
  //     );
  //   });

  //   unmount();
  // });

  // it('handles handleUpsert update failed with detail', async () => {
  //   mockResponseErrorUpdate = true;
  //   mockDetailResponseError = 'This eror uknown';
  //   const { unmount } = await render(
  //     <QueryClientProvider client={queryClient}>
  //       <ConfirmationDialogProvider>
  //         <ViewKYCRequestModal {...mockPropsCreate} />
  //       </ConfirmationDialogProvider>
  //     </QueryClientProvider>,
  //   );

  //   fireEvent.click(screen.getByText('actionSave'));

  //   await act(async () => {
  //     fireEvent.click(
  //       screen.getByRole('button', {
  //         name: 'confirmationUpdateYes',
  //       }),
  //     );
  //   });

  //   unmount();
  // });
});

describe('hook email content management', () => {
  it('success renders useEmailContentList without error', async () => {
    let render: any;

    await act(async () => {
      render = await renderUseKycRequestUpsert();
    });
    const { result, unmount } = render;

    waitFor(() => {
      expect(result.error).toBeUndefined();
    });

    unmount();
  });

  // it('handle delete', async () => {
  //   const render = await renderUseKycRequestUpsert();
  //   const { result, unmount } = render;

  //   act(() => {
  //     result.current.handleDelete();
  //   });

  //   unmount();
  // });

  // it('handles handleCancel', () => {
  //   const { result } = renderUseKycRequestUpsert();

  //   act(() => {
  //     result.current.handleCancel();
  //   });
  // });
});
