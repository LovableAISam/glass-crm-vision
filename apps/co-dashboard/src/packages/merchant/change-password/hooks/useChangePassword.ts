// Cores
import { useQuery } from "@tanstack/react-query";

// Hooks & Utils
import { useAuthenticationSpecDispatch } from "@src/shared/context/AuthenticationContext";
import useBaseUrl from "@src/shared/hooks/useBaseUrl";
import useRouteRedirection from "@src/shared/hooks/useRouteRedirection";
import { useChangePasswordFetcher, useLogoutFetcher, usePasswordChangedActivityFetcher } from "@woi/service/co";
import { useConfirmationDialog } from "@woi/web-component";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { JWTConfig } from "@woi/core";

export interface ChangePasswordForm {
  password: string;
  newPassword: string;
  newPasswordConfirm: string;
}

const initialChangePasswordForm: ChangePasswordForm = {
  password: '',
  newPassword: '',
  newPasswordConfirm: '',
};

function useChangePassword() {
  const router = useRouter();
  const formData = useForm<ChangePasswordForm>({
    defaultValues: initialChangePasswordForm,
  });
  const { handleSubmit, reset } = formData;
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const { baseUrl } = useBaseUrl();
  const { onNavigate } = useRouteRedirection();
  const dispatch = useAuthenticationSpecDispatch();
  const { t: tCommon } = useTranslation('common');

  const isMerchant = router.asPath.includes('/merchant/');

  const handleChangePassword = handleSubmit(async (form) => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationUpdateTitle', { text: 'Password' }),
      message: tCommon('confirmationUpdateDescription', { text: 'Password' }),
      primaryText: tCommon('confirmationUpdateYes'),
      secondaryText: tCommon('confirmationUpdateNo'),
    });

    if (confirmed) {
      const { error, errorData } = await useChangePasswordFetcher(baseUrl, {
        password: form.password,
        newPassword: form.newPassword,
      });
      if (!error) {
        enqueueSnackbar(tCommon('successUpdate', { text: 'Password' }), { variant: 'success' });

        const tokenData = JWTConfig.getTokenData(isMerchant);
        const { result, error, displayMessage } = await useLogoutFetcher(
          baseUrl,
          {
            username: tokenData?.user_name || '',
          },
        );
        if (result && !error) {
          reset();
          refetchPasswordChangedHistory();
          dispatch({ type: 'do-logout', isMerchant });
          onNavigate(isMerchant ? '/merchant/login' : '/login');
        } else {
          enqueueSnackbar(displayMessage || result?.message, {
            variant: 'error',
          });
        }
      } else {
        enqueueSnackbar(errorData?.details?.[0] || tCommon('failedUpdate', { text: 'Password' }), { variant: 'error' });
      }
    }
  });

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancelTitle', { text: 'Change Password' }),
      message: tCommon('confirmationCancelDescription', { text: 'Change Password' }),
      primaryText: tCommon('confirmationCancelYes'),
      secondaryText: tCommon('confirmationCancelNo'),
    });

    if (confirmed) {
      onNavigate('/merchant/account-profile');
    }
  };

  const {
    data: passwordChangedHistoryData,
    status: passwordChangedHistoryStatus,
    refetch: refetchPasswordChangedHistory
  } = useQuery(
    ['password-changed-history-list'],
    async () => usePasswordChangedActivityFetcher(baseUrl, {
      page: 0,
      limit: 9999,
    }),
    {
      refetchOnWindowFocus: false,
    }
  );

  return {
    formData,
    passwordChangedHistoryData: passwordChangedHistoryData?.result?.data || [],
    passwordChangedHistoryStatus,
    handleChangePassword,
    handleCancel,
  };
}

export default useChangePassword;