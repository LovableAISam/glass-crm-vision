import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { Menu, Box, Typography, Stack, useTheme } from '@mui/material';
import { Button } from '@woi/web-component';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LanguageIcon from '@mui/icons-material/Language';
import { useRouter } from 'next/router';
import { Cookie } from '@woi/core';
import { ckLocale } from "@woi/common/meta/cookieKeys";

const LocalizationMenu = () => {
  const router = useRouter();
  const { locale, locales, route, query } = router;
  const formattedRoute = route.replace('[coName]', query.coName as string || 'default')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const theme = useTheme();

  const isMenuOpen = Boolean(anchorEl);

  const handleLocalizationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
      {(locales || []).map((localeString, index) => {
        const active = localeString === locale;
        return (
          <MenuItem
            key={index}
            sx={{ textTransform: 'uppercase' }}
            onClick={() => {
              Cookie.set(ckLocale, localeString);
              router.push(formattedRoute, formattedRoute, { locale: localeString });
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant={active ? "subtitle2" : "body2"} sx={{ textTransform: 'uppercase' }}>{localeString}</Typography>
              {active && <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.success.main }} />}
            </Stack>
          </MenuItem>
        )
      })}
    </Menu>
  );

  return (
    <>
      <Box sx={{ py: 2 }}>
        <Button color="secondary" variant="text" disableElevation onClick={handleLocalizationMenuOpen}>
          <Stack direction="row" spacing={1} alignItems="center">
            <LanguageIcon />
            <Stack direction="column" alignItems="flex-start">
              <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>{locale}</Typography>
            </Stack>
            {isMenuOpen ? <ExpandLess fontSize="medium" /> : <ExpandMore fontSize="medium" />}
          </Stack>
        </Button>
      </Box>
      {renderProfile}
    </>
  );
}

export default LocalizationMenu;
