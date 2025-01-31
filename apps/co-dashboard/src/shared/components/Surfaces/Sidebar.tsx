import React, { useEffect } from 'react';
import {
  Box,
  Card,
  Stack,
  Drawer,
  List,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { generateMenu, MenuType } from '@src/shared/constants/menu';
import { Token } from '@woi/web-component';
import * as Icons from '@mui/icons-material/';
import StyledListItemButton, {
  StyledListItemText,
  StyledListSubheader,
  StyledListItemIcon,
} from '@woi/web-component/src/Menu/StyledListItemButton';
import {
  useLastOpenedSpec,
  useLastOpenedSpecDispatch,
} from '@src/shared/context/LastOpenedContext';
import LogoItem from '../Logo/Logo';
import useRouterWithPrefix from '@src/shared/hooks/useRouterWithPrefix';
import useRouteRedirection from '@src/shared/hooks/useRouteRedirection';
import useMenuPrivilege from '@src/shared/hooks/useMenuPrivilege';
import { useTranslation } from 'react-i18next';

const drawerWidth = 320;

export type SidebarRenderMethods = {
  handleDrawerToggle: () => void;
};

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: (methods: SidebarRenderMethods) => React.ReactElement;
}

const MenuNested = (menu: MenuType) => {
  const router = useRouter();
  const { menuType, menuName, menuIcon, menuLink, children } = menu;
  const { getRouteWithoutPrefix } = useRouterWithPrefix();
  const { onNavigate } = useRouteRedirection();
  const [open, setOpen] = React.useState(false);
  const { lastOpenedTabs } = useLastOpenedSpec();
  const dispatch = useLastOpenedSpecDispatch();
  const theme = useTheme();
  const { checkAuthority } = useMenuPrivilege();

  useEffect(() => {
    if (menu && menu.children) {
      setOpen(
        menu.children.some(menuProps => router.pathname === menuProps.menuLink),
      );
    }
  }, [menu]);

  // Validate Menu Access
  if (
    (!menu.children &&
      !(menu?.privilege && checkAuthority(menu.privilege, 'get'))) ||
    (menu.children &&
      !menu.children.some(
        menuProps =>
          menuProps.privilege && checkAuthority(menuProps.privilege, 'get'),
      ))
  )
    return null;

  const handleClickMenu = (selectedMenu: MenuType) => {
    setOpen(!open);
    if (selectedMenu.menuLink) {
      if (lastOpenedTabs.find(tab => tab.menuLink === selectedMenu.menuLink)) {
        dispatch({
          type: 'set-last-opened-tab',
          payload: {
            lastOpenedTabs: [
              ...lastOpenedTabs.filter(
                tab => tab.menuLink !== selectedMenu.menuLink,
              ),
              selectedMenu,
            ],
          },
        });
      } else {
        dispatch({
          type: 'set-last-opened-tab',
          payload: {
            lastOpenedTabs: [...lastOpenedTabs, selectedMenu],
          },
        });
      }

      onNavigate(selectedMenu.menuLink);
    }
  };

  if (menuType === 'Header') {
    return (
      <React.Fragment>
        <Divider sx={{ pt: 2 }} />
        <StyledListSubheader sx={{ px: 1, mb: 1, pt: 2 }} color="primary">
          {menuName}
        </StyledListSubheader>
      </React.Fragment>
    );
  } else if (menuType === 'Menu') {
    if (children) {
      return (
        <Box
          sx={{
            background: open
              ? Token.color.dashboardLight
              : Token.color.greyscaleGreyWhite,
            borderRadius: 3,
          }}
        >
          <StyledListItemButton
            onClick={() => handleClickMenu(menu)}
            sx={{
              px: 1,
              color: theme.palette.text.primary,
              borderRadius: 3,
            }}
            noHover
          >
            {menuIcon && (
              <StyledListItemIcon
                sx={{
                  minWidth: 0,
                  pr: 1.5,
                  color: 'inherit',
                }}
              >
                {typeof menuIcon === 'string'
                  ? // @ts-ignore
                  React.createElement(Icons[menuIcon])
                  : menuIcon}
              </StyledListItemIcon>
            )}
            <StyledListItemText>
              <Typography variant="body2">{menuName}</Typography>
            </StyledListItemText>
            {open ? (
              <ExpandLess fontSize="inherit" />
            ) : (
              <ExpandMore fontSize="inherit" />
            )}
          </StyledListItemButton>
          {open && <Divider sx={{ mx: 1, mb: 1 }} />}
          {open &&
            children.map(submenu => (
              <MenuNested key={`${submenu.menuName}`} {...submenu} />
            ))}
        </Box>
      );
    }

    return (
      <StyledListItemButton
        selected={
          menuLink ? getRouteWithoutPrefix(router.pathname) === menuLink : false
        }
        onClick={() => handleClickMenu(menu)}
        sx={{ px: 1, color: theme.palette.text.primary, borderRadius: 3 }}
        noHover
      >
        {menuIcon && (
          <StyledListItemIcon sx={{ minWidth: 0, pr: 1.5, color: 'inherit' }}>
            {typeof menuIcon === 'string'
              ? // @ts-ignore
              React.createElement(Icons[menuIcon])
              : menuIcon}
          </StyledListItemIcon>
        )}
        <StyledListItemText>
          <Typography variant="body2">{menuName}</Typography>
        </StyledListItemText>
      </StyledListItemButton>
    );
  }

  return (
    <StyledListItemButton
      selected={
        menuLink ? getRouteWithoutPrefix(router.pathname) === menuLink : false
      }
      onClick={() => handleClickMenu(menu)}
      sx={{ borderRadius: 3 }}
    >
      {menuIcon && (
        <StyledListItemIcon sx={{ minWidth: 0, pr: 1.5, color: 'inherit' }}>
          {typeof menuIcon === 'string'
            ? // @ts-ignore
            React.createElement(Icons[menuIcon])
            : menuIcon}
        </StyledListItemIcon>
      )}
      <StyledListItemText>
        <Typography variant="body2">{menuName}</Typography>
      </StyledListItemText>
    </StyledListItemButton>
  );
};

const ResponsiveDrawer = (props: Props) => {
  const { window, children } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { prefixText } = useRouterWithPrefix();
  const { t: tCommon } = useTranslation('common');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuLists = generateMenu('Admin');

  const drawer = (
    <Stack direction="column">
      <Card
        elevation={0}
        sx={{ p: 2 }}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 5,
        }}
      >
        <Stack direction="row" justifyContent="center">
          <Link
            href={`/${prefixText}`}
            style={{ textDecoration: 'none', color: Token.color.primaryBlack }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <LogoItem width={50} height={50} />
              <Typography variant="h4">{tCommon('appName')}</Typography>
            </Stack>
          </Link>
        </Stack>
      </Card>
      <List sx={{ px: 2 }}>
        <Stack direction="column" spacing={1}>
          {menuLists.map((menu, key) => (
            <MenuNested key={menu.menuName + key} {...menu} />
          ))}
        </Stack>
      </List>
    </Stack>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: { xs: 'block', sm: 'flex' } }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: '100%',
            sm: `calc(100% - ${drawerWidth}px)`,
          },
          backgroundColor: Token.color.dashboardLightest,
          minHeight: '100vh',
        }}
      >
        {children({ handleDrawerToggle })}
      </Box>
    </Box>
  );
};

export default ResponsiveDrawer;
