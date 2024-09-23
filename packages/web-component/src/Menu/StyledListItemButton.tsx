import { styled } from '@mui/material/styles';
import {
  ListItemButton,
  ListItemButtonProps,
  ListItemText,
  ListItemTextProps,
  ListSubheader,
  ListSubheaderProps,
  ListItemIcon,
  ListItemIconProps,
} from '@mui/material';
import Token from '../Token';

interface RootProps {
  noHover?: boolean;
}

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: prop => prop !== 'noHover',
})<RootProps>(({ noHover, theme }) => ({
  color: theme.palette.text.primary,
  '&:hover': {
    color: theme.palette.primary.main,
    background: theme.palette.secondary.main,
    cursor: 'pointer',
    textDecorationLine: noHover ? '' : 'underline',
  },
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    background: theme.palette.secondary.main,
    textDecorationLine: noHover ? '' : 'underline',
  },
}));

export const StyledListItemButtonDefault = styled(ListItemButton)<ListItemButtonProps>(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.primary,
  borderRadius: 8,
  '&:hover': {
    color: theme.palette.text.primary,
    background: Token.color.greyscaleGreyLightest,
    cursor: 'pointer',
    textDecorationLine: 'underline',
  },
  '&.Mui-selected': {
    color: theme.palette.text.primary,
    background: Token.color.greyscaleGreyLightest,
    '&:hover': {
      color: theme.palette.text.primary,
      background: Token.color.greyscaleGreyLightest,
      cursor: 'pointer',
      textDecorationLine: 'underline',
    },
  },
}));

export const StyledListItemText = styled(ListItemText)<ListItemTextProps>(({ theme }) => ({
  '& span': {
    ...theme.typography.body2,
  },
}));

export const StyledListItemIcon = styled(ListItemIcon)<ListItemIconProps>(() => ({}));

export const StyledListSubheader = styled(ListSubheader)<ListSubheaderProps>(({ theme }) => ({
  ...theme.typography.subtitle2,
}));

export default StyledListItemButton;
