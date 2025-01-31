// Core
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

// Components
import ReCAPTCHA from 'react-google-recaptcha';

// Hooks
import { useRouter } from 'next/router';
import { useLoginFetcher } from '@woi/service/co';
import { useAuthenticationSpecDispatch } from '@src/shared/context/AuthenticationContext';
import useRouteRedirection from '@src/shared/hooks/useRouteRedirection';
import { useForm } from 'react-hook-form';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';

// Types
import { useTranslation } from 'react-i18next';

type LoginForm = {
  username: string;
  password: string;
};

const initialLoginForm: LoginForm = {
  username: '',
  password: '',
};

function useLogin() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAuthenticationSpecDispatch();
  const { onNavigate } = useRouteRedirection();
  const { baseUrl } = useBaseUrl();
  const recaptchaRef = React.useRef<ReCAPTCHA | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const { t: tCommon } = useTranslation('common');

  const formData = useForm<LoginForm>({
    defaultValues: initialLoginForm,
  });

  const { handleSubmit } = formData;

  const onSubmit = handleSubmit(async (form) => {
    setLoadingSubmit(true);
    const { result, error, displayMessage } = await useLoginFetcher(baseUrl, {
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      grant_type: 'password',
      username: form.username,
      password: form.password,
      isMerchant: true // login as a merchant
    });
    if (result && !error) {
      dispatch({
        type: 'do-login',
        payload: {
          accessToken: result.access_token,
          refreshToken: result.refresh_token,
          isMerchant: true,
          merchantCode: result.merchantCode
        }
      });
      enqueueSnackbar(tCommon('successLogin'), { variant: 'success' });
      if (router.query && router.query.referer) {
        onNavigate({ pathname: decodeURIComponent(router.query.referer as string) });
      } else {
        onNavigate({ pathname: '/merchant/account-profile' });
      }
    } else {
      recaptchaRef.current?.reset();
      setIsVerified(false);
      enqueueSnackbar(displayMessage || tCommon('failedLogin'), { variant: 'error' });
    }
    setLoadingSubmit(false);
  });

  const onChange = (token: string | null) => {
    if (token) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  };

  return {
    recaptchaRef,
    isVerified,
    formData,
    loadingSubmit,
    onSubmit,
    onChange,
  };
}

export default useLogin;