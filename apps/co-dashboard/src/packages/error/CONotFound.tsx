// Core
import * as React from 'react';
import Image from 'next/legacy/image';
import LogoImage from 'asset/images/logo.svg';

// Components
import {
  Typography,
  Grid,
  Stack,
} from '@mui/material';
import { Token } from '@woi/web-component';
import NotFoundImage from 'asset/images/not-found-co.svg';
import { useTranslation } from 'react-i18next';

export default function CONotFound() {
  const { t: tCommon } = useTranslation('common');

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Stack justifyContent="center" alignItems="center" sx={{ width: '100%', height: '100%' }}>
        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 10 }}>
          <Image src={LogoImage} width={50} height={50} />
          <Typography variant="h3">{tCommon('appName')}</Typography>
        </Stack>
        <Image src={NotFoundImage} />
        <Stack spacing={1} sx={{ mt: 10 }}>
          <Typography variant="h3" align="center" sx={{ mb: 2 }}>{tCommon('coNotFoundTitle')}</Typography>
          <Typography variant="body1" align="center" color={Token.color.greyscaleGreyDarkest} sx={{ mb: 2 }}>{tCommon('coNotFoundDescription')}</Typography>
        </Stack>
      </Stack>
    </Grid>    
  );
}