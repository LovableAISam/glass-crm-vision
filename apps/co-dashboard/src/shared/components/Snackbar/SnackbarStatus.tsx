import { useEffect, useState } from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';

import { useOnlineStatus } from '@woi/common/context/OnlineStatusContext';
import { useTranslation } from 'react-i18next';

function SnackbarStatusContent() {
  const enabled = useOnlineStatus();
  const { enqueueSnackbar } = useSnackbar();
  const [touch, setTouch] = useState<boolean>(false);
  const { t: tCommon } = useTranslation('common');

  useEffect(() => {
    if (!enabled) {
      setTouch(true);
      enqueueSnackbar(tCommon('noInternet'), { variant: 'error', persist: true })
    }
    if (touch && enabled) {
      enqueueSnackbar(tCommon('deviceOnline'), { variant: 'success', autoHideDuration: 2000 })
    }
  }, [enabled])

  return null;
}

function SnackbarStatus() {
  return (
    // @ts-ignore
    <SnackbarProvider
      maxSnack={1}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <SnackbarStatusContent />
    </SnackbarProvider>
  )
}

export default SnackbarStatus;
