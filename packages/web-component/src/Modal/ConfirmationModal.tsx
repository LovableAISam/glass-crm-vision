import { Dialog, DialogContent, DialogActions, Typography, Stack, ButtonProps } from '@mui/material';
import React from 'react';
import Token from '../Token';
import StyledButton from '../Button/StyledButton';

type ConfirmationModalProps = {
  isOpen: boolean;
  handlePrimary: () => void;
  handleSecondary: () => void;
  handleClose: () => void;
  title: string;
  subtitle: string;
  btnPrimaryText: string;
  btnSecondaryText: string;
  btnPrimaryIcon?: React.ReactNode;
  btnSecondaryIcon?: React.ReactNode;
  btnPrimaryColor?: ButtonProps['color'];
  btnSecondaryColor?: ButtonProps['color'];
  disableBtnSecondary?: boolean
};

export default function ConfirmationModal(props: ConfirmationModalProps) {
  const {
    isOpen,
    handlePrimary,
    handleSecondary,
    handleClose,
    title,
    subtitle,
    btnPrimaryText,
    btnSecondaryText,
    btnPrimaryIcon,
    btnSecondaryIcon,
    btnPrimaryColor = 'inherit',
    btnSecondaryColor = 'primary',
    disableBtnSecondary
  } = props;

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      open={isOpen}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
          p: 2,
        }
      }}
      onClose={handleClose}
    >
      <DialogContent sx={{ p: 0 }}>
        <Typography variant="subtitle1" align="center" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color={Token.color.greyscaleGreyDarkest} align="center" sx={{ mb: 1 }}>
          {subtitle}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
          <StyledButton
            variant="contained"
            color={btnPrimaryColor}
            sx={{ py: 1, px: 1, flex: 1, borderRadius: 2, display: disableBtnSecondary ? 'none' : 'inherit' }}
            onClick={handleSecondary}
            startIcon={btnSecondaryIcon}
          >
            <Typography variant="subtitle2">{btnSecondaryText}</Typography>
          </StyledButton>
          <StyledButton
            variant="contained"
            color={btnSecondaryColor}
            sx={{ py: 1, px: 1, flex: 1, borderRadius: 2 }}
            onClick={handlePrimary}
            startIcon={btnPrimaryIcon}
          >
            <Typography variant="subtitle2">{btnPrimaryText}</Typography>
          </StyledButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
