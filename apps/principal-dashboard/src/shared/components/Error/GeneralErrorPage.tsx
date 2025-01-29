// Core
import * as React from 'react';
import Image from 'next/image';
import LogoImage from 'asset/images/logo.svg';

// Components
import {
  Typography,
  Grid,
  Stack,
} from '@mui/material';
import { Button, Token } from '@woi/web-component';
import NotFoundImage from 'asset/images/not-found-co.svg';
import { useTranslation } from 'react-i18next';

type GeneralErrorPageProps = {
  onRetry: () => void;
}

function GeneralErrorPage(props: GeneralErrorPageProps) {
  const { onRetry } = props;
  const { t: tCommon } = useTranslation('common');

  return (
    <Grid container component="main" sx={{ height: '70vh' }}>
      <Stack justifyContent="center" alignItems="center" sx={{ width: '100%', height: '100%' }}>
        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 10 }}>
          <Image src={LogoImage} width={50} height={50} />
          <Typography variant="h3">{tCommon('appName')}</Typography>
        </Stack>
        <Image src={NotFoundImage} />
        <Stack spacing={1} sx={{ mt: 10 }}>
          <Typography variant="h3" align="center" sx={{ mb: 1 }}>{'Oops. something went wrong!'}</Typography>
          <Typography variant="body1" align="center" color={Token.color.greyscaleGreyDarkest}>
            {'Hi, This page has a problem. please contact our CS!'}
          </Typography>
        </Stack>
        <Button
          variant="contained"
          color="primary"
          sx={{ py: 1, px: 5, borderRadius: 2, mt: 5 }}
          loadingPosition="end"
          onClick={onRetry}
        >
          <Typography variant="subtitle2">{'Retry'}</Typography>
        </Button>
      </Stack>
    </Grid>
  );
}

export default GeneralErrorPage;