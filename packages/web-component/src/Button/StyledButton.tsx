import React from 'react';
import { styled } from '@mui/material/styles';
import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton';
import Token from '../Token';

const StyledButton = styled(({ ...props }: LoadingButtonProps) => <LoadingButton {...props} />)<LoadingButtonProps>(
  ({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.primary,
    borderColor: Token.color.greyscaleGreyDark,
    '&.MuiButton-textPrimary': {
      color: theme.palette.primary.main,
      '&:hover': {
        color: theme.palette.primary.dark,
      },
      '&.Mui-disabled': {
        color: Token.color.greyscaleGreyDarkest,
      },
    },
    '&.MuiButton-textError': {
      color: Token.color.redDark,
      '&:hover': {
        color: Token.color.redDarker,
      },
      '&.Mui-disabled': {
        color: Token.color.greyscaleGreyDarkest,
      },
    },
    '&.MuiButton-textWarning': {
      color: Token.color.orangeDark,
      '&:hover': {
        color: Token.color.orangeDarker,
      },
      '&.Mui-disabled': {
        color: Token.color.greyscaleGreyDarkest,
      },
    },
    '&.MuiButton-textSuccess': {
      color: Token.color.greenDark,
      '&:hover': {
        color: Token.color.greenDarker,
      },
      '&.Mui-disabled': {
        color: Token.color.greyscaleGreyDarkest,
      },
    },
    '&.MuiButton-containedInherit': {
      color: theme.palette.text.primary,
      backgroundColor: Token.color.greyscaleGreyWhite,
      '&:hover': {
        color: Token.color.greyscaleGreyDarkest,
        backgroundColor: Token.color.greyscaleGreyLightest,
      },
      '&.Mui-disabled': {
        color: Token.color.greyscaleGreyDarkest,
        background: Token.color.greyscaleGreyLightest,
      },
    },
    '&.MuiButton-containedError': {
      color: Token.color.greyscaleGreyWhite,
      backgroundColor: Token.color.redDark,
      '&:hover': {
        backgroundColor: Token.color.redDarker,
      },
      '&.Mui-disabled': {
        color: Token.color.greyscaleGreyDarkest,
        background: Token.color.greyscaleGreyLightest,
      },
    },
    '&.MuiButton-containedWarning': {
      color: Token.color.greyscaleGreyWhite,
      backgroundColor: Token.color.orangeDark,
      '&:hover': {
        backgroundColor: Token.color.orangeDarker,
      },
      '&.Mui-disabled': {
        color: Token.color.greyscaleGreyDarkest,
        background: Token.color.greyscaleGreyLightest,
      },
    },
    '&.MuiButton-containedPrimary': {
      color: Token.color.greyscaleGreyWhite,
      background: theme.palette.primary.main,
      '&:hover': {
        background: theme.palette.primary.dark,
      },
      '&.Mui-disabled': {
        color: Token.color.greyscaleGreyDarkest,
        background: Token.color.greyscaleGreyLightest,
      },
    },
    '&.MuiButton-containedSuccess': {
      color: Token.color.greyscaleGreyWhite,
      backgroundColor: Token.color.greenDark,
      '&:hover': {
        backgroundColor: Token.color.greenDarker,
      },
      '&.Mui-disabled': {
        color: Token.color.greyscaleGreyDarkest,
        background: Token.color.greyscaleGreyLightest,
      },
    },
    '&.MuiButton-outlinedPrimary': {
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      '&:hover': {
        color: theme.palette.primary.dark,
        borderColor: theme.palette.primary.dark,
      },
      '&.Mui-disabled': {
        color: Token.color.greyscaleGreyDarkest,
        background: Token.color.greyscaleGreyLightest,
      },
    },
  })
);

export default StyledButton;
