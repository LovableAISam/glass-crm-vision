// Core
import React from 'react';
import {
  QueryClientProvider,
  QueryClient,
  QueryCache,
} from '@tanstack/react-query';

// Types & Constants
import { Theme } from '@mui/material/styles';
import { CacheProvider, EmotionCache } from '@emotion/react';
import idLocale from 'date-fns/locale/id';
import { theme as defaultTheme } from "@woi/core/utils/theme";

// Components
import CssBaseline from '@mui/material/CssBaseline';
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

type AppContextProps = {
  emotionCache?: EmotionCache;
  theme?: Theme;
  previousAccessToken: string | null;
  previousRefreshToken: string | null;
}

function AppContext(props: React.PropsWithChildren<AppContextProps>) {
  const {
    emotionCache = clientSideEmotionCache,
    theme,
    previousAccessToken,
    previousRefreshToken,
    children,
  } = props;

  return (
    <CacheProvider value={emotionCache}>
      <QueryClientProvider client={queryClient}>
        <GeneralInfoProvider theme={theme || defaultTheme}>
          <AppHead />
          <CssBaseline />
          <AuthenticationProvider accessToken={previousAccessToken} refreshToken={previousRefreshToken}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={idLocale}>
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
                      {children}
                      <SnackbarStatus />
                    </LastOpenedProvider>
                  </ConfirmationDialogProvider>
                </OnlineStatusProvider>
              </SnackbarProvider>
            </LocalizationProvider>
          </AuthenticationProvider>
        </GeneralInfoProvider>
      </QueryClientProvider>
    </CacheProvider>
  );
}

export default AppContext;