// Core
import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

// Hooks
import Router, { useRouter } from 'next/router';
import { useLoginFetcher } from '@woi/service/co';
import { useAuthenticationSpec, useAuthenticationSpecDispatch } from '@src/shared/context/AuthenticationContext';
import useRouteRedirection from '@src/shared/hooks/useRouteRedirection';
import { useForm } from 'react-hook-form';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';

// Types
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from 'react-i18next';
import { generateMenu, MenuType } from "@src/shared/constants/menu";
import { getJwtData } from "@woi/core/utils/jwt/jwt";
import { Cookie } from "@woi/core";
import { ckAccessToken } from "@woi/common/meta/cookieKeys";

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
  const { isLoggedIn } = useAuthenticationSpec();
  const accessToken = Cookie.get(ckAccessToken);

  const formData = useForm<LoginForm>({
    defaultValues: initialLoginForm,
  });

  const { handleSubmit } = formData;

  function hasAccess(
    pathname: string,
    menuList: MenuType[],
    authoritie: string[],
  ): boolean {
    function flattenMenuItems(items: MenuType[]): MenuType[] {
      return items.flatMap(item => {
        if (item.children) {
          return [...flattenMenuItems(item.children)];
        }
        return item;
      });
    }
    const flattenedMenu = flattenMenuItems(menuList);
    const filteredMenu = flattenedMenu.filter(item => {
      return authoritie.some(auth => item.privilege + ':get' === auth);
    });
    return filteredMenu.some(item => item.menuLink === pathname);
  }

  useEffect(() => {
    if (accessToken && isLoggedIn) {
      const menuLists = generateMenu('Admin');
      if (router.query && router.query.referer && hasAccess(router.query.referer as string, menuLists, getJwtData(accessToken).authorities)) {
        onNavigate(decodeURIComponent(router.query.referer as string));
      } else {
        onNavigate('/');
      }
    } else if (!accessToken && isLoggedIn) {
      dispatch({ type: 'do-logout', isMerchant: false });
      Router.reload();
    }
  }, [isLoggedIn, accessToken]);

  const onSubmit = handleSubmit(async (form) => {
    setLoadingSubmit(true);
    const { result, error, displayMessage } = await useLoginFetcher(baseUrl, {
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      grant_type: 'password',
      username: form.username,
      password: form.password,
      isMerchant: false // as a merchant?
    });
    if (result && !error) {
      dispatch({
        type: 'do-login',
        payload: {
          accessToken: result.access_token,
          refreshToken: result.refresh_token,
          isMerchant: false,
          merchantCode: result.merchantCode
        }
      });
      enqueueSnackbar(tCommon('successLogin'), { variant: 'success' });
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