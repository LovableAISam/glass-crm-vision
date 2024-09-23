// @ts-nocheck
// Core
import React from 'react';
import { NextPageContext } from 'next';
import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { Cookie } from '@woi/core';
import {
  QueryClientProvider,
  QueryClient,
  QueryCache,
} from '@tanstack/react-query';

// Types & Constants
import { Theme } from '@mui/material/styles';
import { CacheProvider, EmotionCache } from '@emotion/react';
import idLocale from 'date-fns/locale/id';
import defaultTheme from "@woi/core/utils/theme";
import { ckAccessToken, ckRefreshToken } from "@woi/common/meta/cookieKeys";

// Components
import CssBaseline from '@mui/material/CssBaseline';
import ProtectedRoute from '../shared/utils/ProtectedRoute';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AppHead from '@src/shared/components/AppHead/AppHead';
import SnackbarStatus from '@src/shared/components/Snackbar/SnackbarStatus';

// Utils
import createEmotionCache from '@woi/core/utils/createEmotionCache';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { GeneralInfoProvider } from '@src/shared/context/GeneralInfoContext';
import { LastOpenedProvider } from '@src/shared/context/LastOpenedContext';
import { SnackbarProvider } from 'notistack';
import { ConfirmationDialogProvider } from '@woi/web-component';
import { AuthenticationProvider } from '@src/shared/context/AuthenticationContext';
import { getJwtData, isExpiredToken } from '@woi/core/utils/jwt/jwt';
import { OnlineStatusProvider } from '@woi/common/context/OnlineStatusContext';

// Query Client Config
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

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface Context extends NextPageContext {
  // any modifications to the default context, e.g. query types
}

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  ctx: Context,
  theme: Theme;
  previousAccessToken: string | null;
  previousRefreshToken: string | null;
}

function App(props: MyAppProps) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
    router,
    theme,
    previousAccessToken,
    previousRefreshToken,
  } = props;

  return (
    <CacheProvider value={emotionCache}>
      <QueryClientProvider client={queryClient}>
        <GeneralInfoProvider theme={theme || defaultTheme}>
          <AppHead />
          <CssBaseline />
          <AuthenticationProvider accessToken={previousAccessToken} refreshToken={previousRefreshToken}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={idLocale}>
              <ProtectedRoute router={router}>
                {/** @ts-ignore */}
                <SnackbarProvider
                  maxSnack={3}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  autoHideDuration={2000}
                >
                  <OnlineStatusProvider>
                    <ConfirmationDialogProvider>
                      <LastOpenedProvider>
                        {/** @ts-ignore */}
                        <Component {...pageProps} />
                        <SnackbarStatus />
                      </LastOpenedProvider>
                    </ConfirmationDialogProvider>
                  </OnlineStatusProvider>
                </SnackbarProvider>
              </ProtectedRoute>
            </LocalizationProvider>
          </AuthenticationProvider>
        </GeneralInfoProvider>
      </QueryClientProvider>
    </CacheProvider>
  );
}

App.getInitialProps = async (props: MyAppProps) => {
  const { Component, ctx } = props;

  let pageProps = {};
  let previousAccessToken = null;
  let previousRefreshToken = null;
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  if (ctx.req && ctx.req.headers.cookie) {
    previousAccessToken = await Cookie.getServer(ckAccessToken, ctx.req.headers.cookie);
    previousRefreshToken = await Cookie.getServer(ckRefreshToken, ctx.req.headers.cookie);

    if (previousAccessToken) {
      const jwtData = getJwtData(previousAccessToken)
      const expiredToken = isExpiredToken(jwtData.exp)
      if (expiredToken) {
        previousAccessToken = null;
        previousRefreshToken = null;
      }
    }
  }
  return {
    pageProps,
    theme: null,
    previousAccessToken,
    previousRefreshToken,
  };
};

export default appWithTranslation(App);