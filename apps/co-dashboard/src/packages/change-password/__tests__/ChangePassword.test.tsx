import React, { Dispatch } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import ChangePassword from '../ChangePassword';
import { act } from 'react-dom/test-utils';
import { PasswordChangedActivityData } from '@woi/service/co/auth/passwordChangedActivity';
import { renderHook } from '@testing-library/react-hooks';
import useChangePassword from '../hooks/useChangePassword';
import { ConfirmationDialogProvider } from '@woi/web-component';
import { useAuthenticationSpecDispatch } from '@src/shared/context/AuthenticationContext';
import { useChangePasswordFetcher } from '@woi/service/co';
import useRouteRedirection from '@src/shared/hooks/useRouteRedirection';
import { useSnackbar } from 'notistack';

type AuthenticationAction = {
  type: 'do-logout';
};

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

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: jest.fn(() => ({
    enqueueSnackbar: jest.fn(),
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

jest.mock('@src/shared/context/AuthenticationContext', () => ({
  useAuthenticationSpecDispatch: jest.fn(),
}));

const mockPasswordChangedHistoryData: PasswordChangedActivityData[] = [
  {
    id: '1',
    createdDate: '2023-01-15T08:30:00',
    modifiedDate: '2023-01-15T08:35:00',
  },
  {
    id: '2',
    createdDate: '2023-02-20T15:45:00',
    modifiedDate: '2023-02-20T15:50:00',
  },
  {
    id: '3',
    createdDate: '2023-03-05T11:20:00',
    modifiedDate: '2023-03-05T11:25:00',
  },
];

jest.mock('@woi/service/co', () => ({
  __esModule: true,
  usePasswordChangedActivityFetcher: jest.fn(() => ({
    result: {
      currentPage: 0,
      totalElements: 1,
      totalPages: 1,
      data: mockPasswordChangedHistoryData,
    },
    status: 'success',
    refetch: jest.fn(),
  })),
  useChangePasswordFetcher: jest.fn(() => ({
    response: '',
    result: '',
  })),
}));

const renderPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ConfirmationDialogProvider>
        <ChangePassword />
      </ConfirmationDialogProvider>
    </QueryClientProvider>,
  );
};

const renderUseChangePassword = () => {
  return renderHook(() => useChangePassword(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe('page change password', () => {
  it('should render the component without crashing', () => {
    const { unmount } = renderPage();
    expect(screen.getByText('pageTitle')).toBeInTheDocument();
    expect(screen.getByText('formOldPassword')).toBeInTheDocument();
    expect(screen.getByText('formNewPassword')).toBeInTheDocument();
    expect(screen.getByText('formConfirmNewPassword')).toBeInTheDocument();
    expect(screen.getByText('actionCancel')).toBeInTheDocument();
    expect(screen.getByText('actionSave')).toBeInTheDocument();

    unmount();
  });

  it('will display an error when password is not filled', async () => {
    const { unmount } = renderPage();

    const inputOldPassword = screen.getByPlaceholderText(
      'placeholderOldPassword',
    );

    fireEvent.change(inputOldPassword, { target: { value: '' } });

    await act(async () => {
      fireEvent.click(screen.getByText('actionSave'));
    });

    const elements = screen.queryAllByText('generalErrorRequired');
    expect(elements).toHaveLength(3);
    elements.forEach(element => {
      expect(element).toBeInTheDocument();
    });

    unmount();
  });

  it('will display an error if the password confirmation is not filled', async () => {
    const { unmount } = renderPage();

    const inputOldPassword = screen.getByPlaceholderText(
      'placeholderOldPassword',
    );
    const inputNewPassword = screen.getByPlaceholderText(
      'placeholderNewPassword',
    );
    const inputConfirmNewPassword = screen.getByPlaceholderText(
      'placeholderConfirmNewPassword',
    );

    fireEvent.change(inputOldPassword, { target: { value: 'Password1!' } });
    fireEvent.change(inputNewPassword, {
      target: { value: 'Password2!' },
    });
    fireEvent.change(inputConfirmNewPassword, {
      target: { value: '' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('actionSave'));
    });

    expect(screen.getByText('generalErrorRequired')).toBeInTheDocument();

    unmount();
  });

  it('will display an error if the entered password characters exceed 20', async () => {
    const { unmount } = renderPage();

    const inputOldPassword = screen.getByPlaceholderText(
      'placeholderOldPassword',
    );
    const inputNewPassword = screen.getByPlaceholderText(
      'placeholderNewPassword',
    );
    const inputConfirmNewPassword = screen.getByPlaceholderText(
      'placeholderConfirmNewPassword',
    );

    fireEvent.change(inputOldPassword, { target: { value: 'Password1!' } });
    fireEvent.change(inputNewPassword, {
      target: { value: 'Pwd1234a89yf98asdyfddsdfgs' },
    });
    fireEvent.change(inputConfirmNewPassword, {
      target: { value: 'Pwd1234a89yf98asdyfddsdfgs' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('actionSave'));
    });

    expect(screen.getByText('generalErrorMaxChar')).toBeInTheDocument();

    unmount();
  });

  it('will display an error if the new password and confirmation password do not match', async () => {
    const { unmount } = renderPage();

    const inputOldPassword = screen.getByPlaceholderText(
      'placeholderOldPassword',
    );
    const inputNewPassword = screen.getByPlaceholderText(
      'placeholderNewPassword',
    );
    const inputConfirmNewPassword = screen.getByPlaceholderText(
      'placeholderConfirmNewPassword',
    );

    fireEvent.change(inputOldPassword, { target: { value: 'Password1!' } });
    fireEvent.change(inputNewPassword, { target: { value: 'NewPassword1!' } });
    fireEvent.change(inputConfirmNewPassword, {
      target: { value: 'DiferentPassword1!' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('actionSave'));
    });

    expect(screen.getByText('generalErrorMissMatching')).toBeInTheDocument();

    unmount();
  });

  it('will display an error if the password is less than 8 characters', async () => {
    const { unmount } = renderPage();

    const inputOldPassword = screen.getByPlaceholderText(
      'placeholderOldPassword',
    );
    const inputNewPassword = screen.getByPlaceholderText(
      'placeholderNewPassword',
    );
    const inputConfirmNewPassword = screen.getByPlaceholderText(
      'placeholderConfirmNewPassword',
    );

    fireEvent.change(inputOldPassword, { target: { value: 'Password1!' } });
    fireEvent.change(inputNewPassword, { target: { value: 'Pwd1234' } });
    fireEvent.change(inputConfirmNewPassword, {
      target: { value: 'Pwd1234' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('actionSave'));
    });

    expect(screen.getByText('generalErrorMinChar')).toBeInTheDocument();

    unmount();
  });

  it('will display an error if the password does not contain uppercase letters', async () => {
    const { unmount } = renderPage();

    const inputOldPassword = screen.getByPlaceholderText(
      'placeholderOldPassword',
    );
    const inputNewPassword = screen.getByPlaceholderText(
      'placeholderNewPassword',
    );
    const inputConfirmNewPassword = screen.getByPlaceholderText(
      'placeholderConfirmNewPassword',
    );

    fireEvent.change(inputOldPassword, { target: { value: 'Password1!' } });
    fireEvent.change(inputNewPassword, { target: { value: 'password2!' } });
    fireEvent.change(inputConfirmNewPassword, {
      target: { value: 'password2!' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('actionSave'));
    });

    expect(
      screen.getByText('generalErrorContainsUppercase'),
    ).toBeInTheDocument();

    unmount();
  });

  it('will display an error if the password does not contain special characters', async () => {
    const { unmount } = renderPage();

    const inputOldPassword = screen.getByPlaceholderText(
      'placeholderOldPassword',
    );
    const inputNewPassword = screen.getByPlaceholderText(
      'placeholderNewPassword',
    );
    const inputConfirmNewPassword = screen.getByPlaceholderText(
      'placeholderConfirmNewPassword',
    );

    fireEvent.change(inputOldPassword, { target: { value: 'Password1!' } });
    fireEvent.change(inputNewPassword, { target: { value: 'Password2' } });
    fireEvent.change(inputConfirmNewPassword, {
      target: { value: 'Password2' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('actionSave'));
    });

    expect(
      screen.getByText('generalErrorContainsSpecialChars'),
    ).toBeInTheDocument();

    unmount();
  });

  it('will display an error if the password does not contain numeric characters', async () => {
    const { unmount } = renderPage();

    const inputOldPassword = screen.getByPlaceholderText(
      'placeholderOldPassword',
    );
    const inputNewPassword = screen.getByPlaceholderText(
      'placeholderNewPassword',
    );
    const inputConfirmNewPassword = screen.getByPlaceholderText(
      'placeholderConfirmNewPassword',
    );

    fireEvent.change(inputOldPassword, { target: { value: 'Password1!' } });
    fireEvent.change(inputNewPassword, { target: { value: 'Password!' } });
    fireEvent.change(inputConfirmNewPassword, {
      target: { value: 'Password!' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('actionSave'));
    });

    expect(screen.getByText('generalErrorContainsNumber')).toBeInTheDocument();

    unmount();
  });

  it('will not display any errors if all password conditions are met', async () => {
    const mockDispatch: jest.MockedFunction<Dispatch<AuthenticationAction>> =
      jest.fn();
    (useAuthenticationSpecDispatch as jest.Mock).mockReturnValue(mockDispatch);

    const { unmount } = renderPage();

    const inputOldPassword = screen.getByPlaceholderText(
      'placeholderOldPassword',
    );
    const inputNewPassword = screen.getByPlaceholderText(
      'placeholderNewPassword',
    );
    const inputConfirmNewPassword = screen.getByPlaceholderText(
      'placeholderConfirmNewPassword',
    );

    fireEvent.change(inputOldPassword, { target: { value: 'Password1!' } });
    fireEvent.change(inputNewPassword, {
      target: { value: 'Password2!' },
    });
    fireEvent.change(inputConfirmNewPassword, {
      target: { value: 'Password2!' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('actionSave'));
    });

    expect(screen.queryByText('generalErrorRequired')).not.toBeInTheDocument();
    expect(screen.queryByText('generalErrorMinChar')).not.toBeInTheDocument();
    expect(screen.queryByText('generalErrorMaxChar')).not.toBeInTheDocument();
    expect(
      screen.queryByText('generalErrorContainsUppercase'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('generalErrorContainsSpecialChars'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('generalErrorContainsNumber'),
    ).not.toBeInTheDocument();

    unmount();
  });

  it('display enqueueSnackbar success when password change is successful', async () => {
    const mockDispatch: jest.MockedFunction<Dispatch<AuthenticationAction>> =
      jest.fn();
    (useAuthenticationSpecDispatch as jest.Mock).mockReturnValue(mockDispatch);

    const { unmount } = renderPage();

    const inputOldPassword = screen.getByPlaceholderText(
      'placeholderOldPassword',
    );
    const inputNewPassword = screen.getByPlaceholderText(
      'placeholderNewPassword',
    );
    const inputConfirmNewPassword = screen.getByPlaceholderText(
      'placeholderConfirmNewPassword',
    );

    fireEvent.change(inputOldPassword, { target: { value: 'Password1!' } });
    fireEvent.change(inputNewPassword, {
      target: { value: 'Password2!' },
    });
    fireEvent.change(inputConfirmNewPassword, {
      target: { value: 'Password2!' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('actionSave'));
    });

    const buttonConfirm = screen.getByRole('button', {
      name: 'confirmationUpdateYes',
    });

    await act(async () => {
      fireEvent.click(buttonConfirm);
    });

    expect(useChangePasswordFetcher).toHaveBeenCalled();
    expect(useSnackbar).toHaveBeenCalled();

    expect(screen.queryByText('successUpdate')).not.toBeInTheDocument();

    unmount();
  });

  it('display enqueueSnackbar failure when password change fails', async () => {
    const mockDispatch: jest.MockedFunction<Dispatch<AuthenticationAction>> =
      jest.fn();
    (useAuthenticationSpecDispatch as jest.Mock).mockReturnValue(mockDispatch);

    (useChangePasswordFetcher as jest.Mock).mockReturnValue({
      status: 400,
      error: true,
      message: 'Bad Request Exception',
      errorCode: 13,
      timestamp: '2023-11-19T17:46:29.847+00:00',
      details: ['incorrect password'],
      descriptions: [null],
    });

    const { unmount } = renderPage();

    const inputOldPassword = screen.getByPlaceholderText(
      'placeholderOldPassword',
    );
    const inputNewPassword = screen.getByPlaceholderText(
      'placeholderNewPassword',
    );
    const inputConfirmNewPassword = screen.getByPlaceholderText(
      'placeholderConfirmNewPassword',
    );

    fireEvent.change(inputOldPassword, { target: { value: 'Password1!' } });
    fireEvent.change(inputNewPassword, {
      target: { value: 'Password3!' },
    });
    fireEvent.change(inputConfirmNewPassword, {
      target: { value: 'Password3!' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('actionSave'));
    });

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', {
          name: 'confirmationUpdateYes',
        }),
      );
    });

    expect(useChangePasswordFetcher).toHaveBeenCalled();
    expect(useSnackbar).toHaveBeenCalled();

    expect(screen.queryByText('failedUpdate')).not.toBeInTheDocument();

    unmount();
  });

  it('display cancellation confirmation dialog when cancel button is pressed', async () => {
    const { unmount } = renderPage();

    await act(async () => {
      fireEvent.click(screen.getByText('actionCancel'));
    });

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', {
          name: 'confirmationCancelYes',
        }),
      );
    });

    expect(useRouteRedirection).toHaveBeenCalled();

    unmount();
  });
});

describe('useChangePassword', () => {
  it('renders useChangePassword without error', () => {
    const { result, unmount } = renderUseChangePassword();
    expect(result.error).toBeUndefined();

    unmount();
  });

  it('function handleChangePassword', async () => {
    const { result } = renderUseChangePassword();

    act(() => {
      result.current.handleChangePassword();
    });

    expect(result.current.handleChangePassword).toBeDefined();
  });
});
