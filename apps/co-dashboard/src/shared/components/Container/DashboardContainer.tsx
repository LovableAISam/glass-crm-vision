// Core
import React, { useMemo } from 'react';

// Components
import { Stack, Box } from '@mui/material';
import Sidebar from '../Surfaces/Sidebar';
import Appbar from '../Surfaces/Appbar';
import LastOpenedTab from '../Surfaces/LastOpenedTab';
import NotFoundPage from '../Error/NotFoundPage';
import useMenuPrivilege from '@src/shared/hooks/useMenuPrivilege';
import { useRouter } from 'next/router';
import { generateMenu, MenuType } from '@src/shared/constants/menu';

type DashboardContainerProps = {
  children: React.ReactNode;
};

const DashboardContainer = (props: DashboardContainerProps) => {
  const { children } = props;
  const router = useRouter();
  const { checkAuthority } = useMenuPrivilege();

  function flattenMenuItems(items: MenuType[]): MenuType[] {
    return items.flatMap(item => {
      if (item.children) {
        return [...flattenMenuItems(item.children)];
      }
      return item;
    });
  }

  const path = `/${router.asPath
    .replace(/^\/[^\/]+\//, '')
    .replace(/\/$/, '')}`;

  const menuAccess = useMemo(() => {
    return flattenMenuItems(generateMenu('Admin')).find(
      el => el.menuLink === path,
    )?.privilege;
  }, [router.asPath]);

  return (menuAccess && checkAuthority(menuAccess, 'get')) || path === '/' ? (
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
            {children}
          </Box>
        </Stack>
      )}
    </Sidebar>
  ) : (
    <NotFoundPage />
  );
};

export default DashboardContainer;
