// Core
import React from 'react';
import Image from 'next/image';
import NotFoundImage from 'asset/images/not-found.svg';

// Components
import {
  Typography,
  Stack,
  Avatar,
} from '@mui/material';
import { Button } from '@woi/web-component';

// Utils
import useRouteRedirection from '@src/shared/hooks/useRouteRedirection';

const ExpiredLink = () => {
  const { onNavigate } = useRouteRedirection();

  return (
    <Stack direction="column" spacing={5}>
      <Avatar variant="square" sx={{ background: 'transparent', width: 150, height: 110, alignSelf: 'center' }}>
        <Image src={NotFoundImage} layout="fill" objectFit="contain" /> 
      </Avatar>
      <Stack direction="column" spacing={2}>
        <Typography variant="h3" align="center">Expired Link</Typography>
        <Typography variant="body1" align="center">Your link has been expired</Typography>
      </Stack>
      <Stack direction="column" spacing={2}>
        <Button 
          fullWidth 
          variant="contained" 
          color="primary" 
          sx={{ py: 1, px: 5, borderRadius: 2 }} 
          loadingPosition="end" 
          onClick={() => onNavigate('/forgot-password')}
        >
          <Typography variant="subtitle2">Reset Password</Typography>
        </Button>
        <Button 
          fullWidth 
          variant="outlined" 
          color="inherit" 
          sx={{ py: 1, px: 5, borderRadius: 2 }} 
          loadingPosition="end" 
          onClick={() => onNavigate('/login')}
        >
          <Typography variant="subtitle2">Back to Login</Typography>
        </Button>
      </Stack>
    </Stack>
  );
}

export default ExpiredLink;