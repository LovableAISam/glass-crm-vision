// Core
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

// Hooks
import { usePasswordVerificationFetcher } from '@woi/service/principal';
import { useForm } from 'react-hook-form';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import useRouteRedirection from '@src/shared/hooks/useRouteRedirection';
import { TextGetter } from '@woi/core';

type ResetPasswordForm = {
  password: string;
  passwordConfirm: string;
}

const initialForm: ResetPasswordForm = {
  password: '',
  passwordConfirm: '',
}

function useResetPassword() {
  const router = useRouter();
  const token = TextGetter.getterString(router.query?.token as string);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const { baseUrl } = useBaseUrl();
  const { onNavigate } = useRouteRedirection();

  const formData = useForm<ResetPasswordForm>({
    defaultValues: initialForm,
  });

  const { handleSubmit } = formData;

  const onSuccess = () => {
    setIsSuccess(true);
  }

  const onRedirectToLogin = () => {
    onNavigate('/login');
  }

  const onSubmit = handleSubmit(async (form) => {
    const { error, errorData } = await usePasswordVerificationFetcher(baseUrl, {
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      password: form.password,
      token,
    })
    if (!error) {
      onSuccess();
    } else {
      enqueueSnackbar(errorData?.details?.[0] || 'Password invalid. Please check again', { variant: 'error' });
    }
  })

  return {
    isSuccess,
    formData,
    onSubmit,
    onRedirectToLogin,
  }
}

export default useResetPassword;