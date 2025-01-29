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
import defaultTheme from '@woi/core/utils/theme';
import { ckAccessToken, ckRefreshToken } from '@woi/common/meta/cookieKeys';

// Components
import CssBaseline from '@mui/material/CssBaseline';
import ProtectedRoute from '../shared/utils/ProtectedRoute';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AppHead from '@src/shared/components/AppHead/AppHead';

// Utils
import createEmotionCache from '@woi/core/utils/createEmotionCache';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { GeneralInfoProvider } from '@src/shared/context/GeneralInfoContext';
import { LastOpenedProvider } from '@src/shared/context/LastOpenedContext';
import { SnackbarProvider } from 'notistack';
import { ConfirmationDialogProvider } from '@woi/web-component';
import { AuthenticationProvider } from '@src/shared/context/AuthenticationContext';
import { getJwtData, isExpiredToken } from '@woi/core/utils/jwt/jwt';
import { ConfigProvider } from '@src/shared/components/Surfaces/Config';
import { CommunityOwnerProvider } from '@src/shared/context/CommunityOwnerContext';
import { OnlineStatusProvider } from '@woi/common/context/OnlineStatusContext';
import { useCommunityOwnerCheckFetcher } from '@woi/service/co';
import { CommunityOwnerDetailData } from '@woi/service/co/admin/communityOwner/communityOwnerDetail';
import Page404 from "./404";

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
  ctx: Context;
  theme: Theme;
  previousAccessToken: string | null;
  previousRefreshToken: string | null;
  coName: string | null;
  coDetail: CommunityOwnerDetailData | null;
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
    coName,
    coDetail,
  } = props;

  return (
    <CacheProvider value={emotionCache}>
      <QueryClientProvider client={queryClient}>
        <CommunityOwnerProvider coName={coName} coDetail={coDetail}>
          <GeneralInfoProvider theme={theme}>
            <AppHead />
            <CssBaseline />
            <AuthenticationProvider
              accessToken={previousAccessToken}
              refreshToken={previousRefreshToken}
            >
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={idLocale}
              >
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
                      {coName === 'co' ?
                        <ConfigProvider>
                          <ConfirmationDialogProvider>
                            <LastOpenedProvider>
                              {/** @ts-ignore */}
                              <Component {...pageProps} />
                            </LastOpenedProvider>
                          </ConfirmationDialogProvider>
                        </ConfigProvider>
                        : <Page404 />}
                    </OnlineStatusProvider>
                  </SnackbarProvider>
                </ProtectedRoute>
              </LocalizationProvider>
            </AuthenticationProvider>
          </GeneralInfoProvider>
        </CommunityOwnerProvider>
      </QueryClientProvider>
    </CacheProvider>
  );
}

App.getInitialProps = async (props: MyAppProps) => {
  const { Component, ctx } = props;

  let pageProps = {};
  let previousAccessToken = null;
  let previousRefreshToken = null;
  let coName = ctx.query.coName as string;
  let coDetail: CommunityOwnerDetailData | null = null;
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  if (ctx.req && ctx.req.headers.cookie) {
    previousAccessToken = await Cookie.getServer(
      ckAccessToken,
      ctx.req.headers.cookie,
    );
    previousRefreshToken = await Cookie.getServer(
      ckRefreshToken,
      ctx.req.headers.cookie,
    );

    if (previousAccessToken) {
      const jwtData = getJwtData(previousAccessToken);
      const expiredToken = isExpiredToken(jwtData.exp);
      if (expiredToken) {
        previousAccessToken = null;
        previousRefreshToken = null;
      }
    }
  }
  if (ctx.asPath !== '/') {
    const { result, error } = await useCommunityOwnerCheckFetcher(
      `${process.env.NEXT_PUBLIC_BASE_URL_API!}/${coName}`,
      {
        code: coName,
        key: 'RhrWFbgYA9m96sqDdKmheUCuMjEmX7bu',
      },
    );
    if (result && !error) {
      coDetail = result;
    }
  }
  return {
    pageProps,
    theme: defaultTheme,
    previousAccessToken,
    previousRefreshToken,
    coName,
    coDetail,
  };
};

export default appWithTranslation(App);
