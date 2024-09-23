// Core
import React from 'react';

// Components
import { Stack, Box } from '@mui/material';
import Sidebar from '../Surfaces/Sidebar';
import Appbar from '../Surfaces/Appbar';
import LastOpenedTab from '../Surfaces/LastOpenedTab';
import ErrorBoundaryContainer from './ErrorBoundaryContainer';

type DashboardContainerProps = {
  children: React.ReactNode;
};

const DashboardContainer = (props: DashboardContainerProps) => {
  const { children } = props;
  return (
    <Sidebar>
      {sidebarProps => (
        <Stack direction="column">
          <Appbar {...sidebarProps} />
          <LastOpenedTab />
          <Box
            sx={{
              px: { xs: 1, sm: 3 },
              pt: { xs: 4, sm: 0 },
            }}
          >
            <ErrorBoundaryContainer>
              {children}
            </ErrorBoundaryContainer>
          </Box>
        </Stack>
      )}
    </Sidebar>
  )
}

export default DashboardContainer;