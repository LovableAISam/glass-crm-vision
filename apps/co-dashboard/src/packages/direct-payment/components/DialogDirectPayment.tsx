import React from 'react';
import {
  Dialog,
  DialogContent,
  Stack,
  Typography,
  IconButton,
} from '@mui/material';

// Icons
import CloseIcon from '@mui/icons-material/Close';

type DialogDirectPaymentProps = {
  isActive: boolean;
  onHide: () => void;
  word: string;
};

const DialogDirectPayment = (props: DialogDirectPaymentProps) => {
  const { isActive, onHide, word } = props;

  return (
    <Dialog
      open={isActive}
      onClose={onHide}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
          py: 2,
        },
      }}
      maxWidth="sm"
      fullWidth
    >
      <Stack
        direction="row"
        justifyContent="end"
        alignItems="center"
        sx={{ pr: 2 }}
      >
        <IconButton onClick={onHide}>
          <CloseIcon />
        </IconButton>
      </Stack>

      <DialogContent sx={{ pt: 0 }}>
        <Typography variant="inherit" textAlign="center">
          {word}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDirectPayment;
