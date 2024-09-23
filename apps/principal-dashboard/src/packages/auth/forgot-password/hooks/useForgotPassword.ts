// Core
import { useState } from 'react';
import { useSnackbar } from 'notistack';

// Hooks
import { useResetPasswordFetcher } from '@woi/service/principal';
import { useTimer } from '@woi/web-component';
import { useForm } from 'react-hook-form';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import { TimeConvert } from '@woi/core';

type ForgotPasswordForm = {
  email: string;
}

const initialForgotPasswordForm: ForgotPasswordForm = {
  email: ''
}

function useForgotPassword() {
  const { enqueueSnackbar } = useSnackbar();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLimit, setIsLimit] = useState<boolean>(false);
  const [resend, setResend] = useState<boolean>(false);
  const { countdown, displayCountdown, resetTimer } = useTimer({ timer: 300, onComplete: () => setResend(true)});
  const formData = useForm<ForgotPasswordForm>({
    defaultValues: initialForgotPasswordForm,
  });
  const { baseUrl } = useBaseUrl();
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const { handleSubmit } = formData;

  const onSuccessEmailSent = (max: boolean, timeWindowSecond: number) => {
    if (timeWindowSecond > 0) {
      resetTimer(timeWindowSecond);
    }
    setIsLimit(max);
    setIsSuccess(true);
  }

  const onSubmit = handleSubmit(async (form) => {
    setLoadingSubmit(true);
    const { result, error, errorData } = await useResetPasswordFetcher(baseUrl, {
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      email: form.email,
    })
    if (result && !error) {
      if (result.success) {
        onSuccessEmailSent(result.max, result.timeWindowSecond);
      } else {
        if (isSuccess) {
          onSuccessEmailSent(result.max, result.timeWindowSecond)
        }
        enqueueSnackbar(`Reset email process is blocked for ${TimeConvert.displayTimeStrWithTime(result.timeWindowSecond)}`, { variant: 'error' });
      }
    } else {
      enqueueSnackbar(errorData?.details?.[0] || 'Failed to send email. Please contact admin.', { variant: 'error' });
    }
    setLoadingSubmit(false);
  })

  return {
    isSuccess,
    resend,
    countdown,
    displayCountdown,
    isLimit,
    formData,
    loadingSubmit,
    onSubmit,
  }
}

export default useForgotPassword;