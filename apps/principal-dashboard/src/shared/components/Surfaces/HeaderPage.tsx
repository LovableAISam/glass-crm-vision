import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';
import ProfileMenu from '../Menu/ProfileMenu';
import Logo from '../Logo/Logo';

const HeaderPage = () => (
  <Box>
    <AppBar position="static" color="default" sx={{ px: { md: 10 } }}>
      <Toolbar>
        <Box>
          <Link href="/">
            <Logo width={200} height={70} />
          </Link>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <ProfileMenu />
      </Toolbar>
    </AppBar>
  </Box>
)

export default HeaderPage;
