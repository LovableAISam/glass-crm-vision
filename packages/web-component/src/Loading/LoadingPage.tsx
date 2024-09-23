// Core
import React from 'react';

// Components
import { Stack, CircularProgress } from '@mui/material';

export default function LoadingPage() {
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        width: '100%',
        height: 400
      }}
      data-testid="loading-state"
    >
      <CircularProgress />
    </Stack>
  );
}
