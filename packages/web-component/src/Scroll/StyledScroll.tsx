import React, { ComponentProps } from 'react';
import { Box, BoxProps, useTheme } from '@mui/material';
import { Token } from '@woi/web-component';

export type StyledScrollProps = ComponentProps<typeof Box> & {
  horizontal?: boolean;
  children: React.ReactElement;
};

const StyledScroll = React.forwardRef<unknown, StyledScrollProps & BoxProps>((props, ref) => {
  const { horizontal = true, children } = props;
  const theme = useTheme();

  return (
    <Box
      ref={ref}
      {...props}
      sx={{
        width: '100%',
        scrollBehavior: 'smooth',
        maxHeight: horizontal ? undefined : 400,
        overflowX: horizontal ? 'scroll' : 'unset',
        overflowY: horizontal ? 'unset' : 'scroll',
        paddingBottom: horizontal ? 1 : 0,
        paddingRight: horizontal ? 0 : 1,
        // @ts-ignore
        scrollbarColor: theme.palette.primary.gradient2,
        '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
          backgroundColor: Token.color.greyscaleGreyLightest,
          height: horizontal ? 5 : undefined,
          width: horizontal ? undefined : 5,
          borderRadius: 8,
        },
        '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
          borderRadius: 8,
          // @ts-ignore
          background: theme.palette.primary.gradient2,
        },
        '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
          // @ts-ignore
          background: theme.palette.primary.gradient2,
        },
        '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
          // @ts-ignore
          background: theme.palette.primary.gradient2,
        },
        '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
          // @ts-ignore
          background: theme.palette.primary.gradient2,
        },
        '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
          backgroundColor: Token.color.greyscaleGreyLightest,
        },
        ...props.sx,
      }}
    >
      {children}
    </Box>
  );
});

export default StyledScroll;
