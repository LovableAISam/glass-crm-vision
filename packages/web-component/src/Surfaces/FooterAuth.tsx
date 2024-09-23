import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import Token from '../Token';

export default function FooterAuth() {
  return (
    <Box
      position="absolute"
      color="default"
      bottom={0}
      sx={{
        position: 'relative',
        borderTop: t => `1px solid ${t.palette.divider}`,
        py: 4,
        px: 12,
        mt: 'auto',
      }}
      style={{ background: Token.color.secondaryBlueTintLight }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Stack direction="row" spacing={2}>
          <Link href="">
            <Typography
              variant="body2"
              color={theme => theme.palette.primary.main}
              style={{ cursor: 'pointer' }}
              component={'span'}
            >
              Term of Use
            </Typography>
          </Link>
          <Link href="">
            <Typography
              variant="body2"
              color={theme => theme.palette.primary.main}
              style={{ cursor: 'pointer' }}
              component={'span'}
            >
              Privacy Policy
            </Typography>
          </Link>
        </Stack>
        <Typography variant="body2" color={Token.color.greyscaleGreyDarkest}>
          Copyright © 2021 WOI. All Rights Reserved
        </Typography>
      </Stack>
    </Box>
  );
}
