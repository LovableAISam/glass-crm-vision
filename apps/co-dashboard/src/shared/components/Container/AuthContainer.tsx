// Core
import React from 'react';
import Image from 'next/image';
import { Token } from '@woi/web-component'
import SideAuthImage from 'asset/images/side-auth-co.svg';
import LogoWhiteImage from 'asset/images/logo-white.svg';

// Components
import {
  Paper,
  Grid,
  Box,
  Container,
  Typography,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';

type AuthContainerProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function AuthContainer(props: AuthContainerProps) {
  const { title, description, children } = props;
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        sx={{ 
          backgroundImage: `url(${SideAuthImage.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box 
          style={{ 
            position: 'relative', 
            width: '100%', 
            height: '100%', 
            background: matches ? "transparent" : "linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))",
          }}
        >
          <Box sx={{ p: 6 }} style={{ position: 'relative' }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Image src={LogoWhiteImage} width={50} height={50} />
              <Typography variant="h3" color={Token.color.greyscaleGreyWhite}>Wallet of Indivara</Typography>
            </Stack>
            <Stack direction="column" spacing={2} sx={{ mt: 10 }}>
              <Typography variant="h3" color={Token.color.greyscaleGreyWhite} sx={{ maxWidth: 400 }}>
                {title}
              </Typography>
              <Typography variant="body2" color={Token.color.greyscaleGreyWhite} sx={{ maxWidth: 400 }}>
                {description}
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
        <Box
          sx={{
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%'
          }}
        >
          <Container component="main" maxWidth={'sm'}>
            {children}
          </Container>
        </Box>
      </Grid>
    </Grid>
  );
}
