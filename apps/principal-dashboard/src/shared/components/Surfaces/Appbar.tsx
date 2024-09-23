import React from 'react';
import { Stack, IconButton, Typography, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Token } from '@woi/web-component';
import ProfileMenu from '../Menu/ProfileMenu';
import LocalizationMenu from '../Menu/LocalizationMenu';
import { SidebarRenderMethods } from './Sidebar';
import { useTranslation } from 'react-i18next';
import { stringToDateFormat } from '@woi/core/utils/date/dateConvert';
import { LONG_DATE_FORMAT, TIME_FORMAT } from '@woi/core/utils/date/constants';

type AppbarProps = SidebarRenderMethods;

const Appbar = (props: AppbarProps) => {
  const { handleDrawerToggle } = props;
  const theme = useTheme();
  const { t: tCommon } = useTranslation('common');

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{ px: 2, background: Token.color.dashboardLightest }}
      style={{
        // @ts-ignore
        position: 'sticky',
        top: 0,
        zIndex: 5,
      }}
    >
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerToggle}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        <MenuIcon />
      </IconButton>
      <Stack direction="row" spacing={2} sx={{ display: { xs: "none", sm: "flex" } }}>
        <Typography variant="body2" color={theme.palette.text.secondary}>{tCommon('appBarlastLogin')}</Typography>
        <Typography variant="body2" color={theme.palette.success.main} sx={{ fontWeight: 'bold' }}>{stringToDateFormat(new Date(), LONG_DATE_FORMAT)} · {stringToDateFormat(new Date(), TIME_FORMAT)}</Typography>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <LocalizationMenu />
        <ProfileMenu />
      </Stack>
    </Stack>
  );
}

export default Appbar;