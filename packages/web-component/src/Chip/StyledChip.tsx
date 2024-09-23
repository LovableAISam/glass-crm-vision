import { styled } from '@mui/material/styles';
import Chip, { ChipProps } from '@mui/material/Chip';
import { Token } from '@woi/web-component';

const StyledChip = styled(Chip)<ChipProps>(({ theme }) => ({
  // @ts-ignore
  ...theme.typography.subtitle3,
  color: theme.palette.text.primary,
  cursor: 'inherit',
  '&.MuiChip-disabled': {
    backgroundColor: Token.color.greyscaleGreyDark,
  },
  '&.MuiChip-filledPrimary': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.main,
  },
  '&.MuiChip-filledSecondary': {
    backgroundColor: Token.color.greenDarker,
    color: Token.color.greyscaleGreyWhite,
  },
  '&.MuiChip-filledInfo': {
    backgroundColor: theme.palette.info.light,
    color: Token.color.greyscaleGreyWhite,
  },
  '&.MuiChip-filledWarning': {
    backgroundColor: Token.color.orangeLight,
    color: Token.color.orangeDark,
  },
  '&.MuiChip-filledSuccess': {
    backgroundColor: Token.color.greenLight,
    color: Token.color.greenDark,
  },
  '&.MuiChip-filledError': {
    backgroundColor: Token.color.redLight,
    color: Token.color.redDark,
  },
  '&.MuiChip-outlinedDefault': {
    borderColor: Token.color.greyscaleGreyDarkest,
    color: Token.color.greyscaleGreyDarkest,
  },
  '&.MuiChip-outlinedPrimary': {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
  },
  '&.MuiChip-outlinedWarning': {
    borderColor: Token.color.orangeDark,
    color: Token.color.orangeDark,
  },
  '&.MuiChip-outlinedSuccess': {
    borderColor: Token.color.greenDark,
    color: Token.color.greenDark,
  },
  '&.MuiChip-outlinedError': {
    borderColor: Token.color.redDark,
    color: Token.color.redDark,
  },
}));

export default StyledChip;
