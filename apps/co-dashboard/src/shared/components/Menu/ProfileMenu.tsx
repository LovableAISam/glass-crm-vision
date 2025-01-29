// Core
import React from 'react';
import Image from 'next/image';
import { JWTConfig } from '@woi/core';

// Components
import MenuItem from '@mui/material/MenuItem';
import {
  Menu,
  Box,
  Typography,
  Stack,
  ListItemIcon,
  Avatar,
} from '@mui/material';
import { Button, useConfirmationDialog } from '@woi/web-component';
import { Logout, ExpandLess, ExpandMore, Settings } from '@mui/icons-material';
import PersonImg from 'asset/images/person.png';

// Utils
import { useAuthenticationSpecDispatch } from '@src/shared/context/AuthenticationContext';
import { useConfigState } from '../Surfaces/Config';
import useRouteRedirection from '@src/shared/hooks/useRouteRedirection';
import { useTranslation } from 'react-i18next';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import { useSnackbar } from 'notistack';
import { useLogoutFetcher } from '@woi/service/co';

const ProfileMenu = () => {
  const dispatch = useAuthenticationSpecDispatch();
  const { getConfirmation } = useConfirmationDialog();
  const { onNavigate } = useRouteRedirection();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const {
    actions: { openPopup },
  } = useConfigState();
  const tokenData = JWTConfig.getTokenData();
  const { t: tCommon } = useTranslation('common');
  const { baseUrl } = useBaseUrl();
  const { enqueueSnackbar } = useSnackbar();

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('logoutConfirmationTitle'),
      message: tCommon('logoutConfirmationDescription'),
      primaryText: tCommon('logoutConfirmationYes'),
      secondaryText: tCommon('logoutConfirmationNo'),
    });

    if (confirmed) {
      const { result, error, displayMessage } = await useLogoutFetcher(
        baseUrl,
        {
          username: tokenData?.user_name || '',
        },
      );
      if (result && !error) {
        dispatch({ type: 'do-logout' });
        onNavigate('/login');
      } else {
        enqueueSnackbar(displayMessage || result?.message, {
          variant: 'error',
        });
      }
    }
  };

  const menuId = 'primary-search-account-menu';
  const renderProfile = (
    <Menu
      anchorEl={anchorEl}
      open={isMenuOpen}
      id={menuId}
      onClose={handleMenuClose}
      onClick={handleMenuClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          mt: 1.5,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={openPopup}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        {tCommon('appBarMenuConfig')}
      </MenuItem>
      <MenuItem onClick={() => handleLogout()}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        {tCommon('appBarMenuLogout')}
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Box sx={{ py: 2 }}>
        <Button
          color="secondary"
          variant="text"
          disableElevation
          onClick={handleProfileMenuOpen}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ width: 24, height: 24 }}>
              <Image
                src={PersonImg}
                layout="fill"
                // style={{
                //   objectFit: 'cover',
                // }}
                alt="person"
              />
            </Avatar>
            <Stack direction="column" alignItems="flex-start">
              <Typography variant="subtitle2" style={{ textTransform: 'none' }}>
                {tCommon('appBarWelcome', { name: tokenData?.user_name })}
              </Typography>
            </Stack>
            {isMenuOpen ? (
              <ExpandLess fontSize="medium" />
            ) : (
              <ExpandMore fontSize="medium" />
            )}
          </Stack>
        </Button>
      </Box>
      {renderProfile}
    </>
  );
};

export default ProfileMenu;
