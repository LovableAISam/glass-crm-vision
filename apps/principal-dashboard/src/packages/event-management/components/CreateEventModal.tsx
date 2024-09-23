import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  IconButton,
  TextField,
  Grid,
} from '@mui/material';
import { Button, FormDatePicker } from '@woi/web-component';
import { useSnackbar } from 'notistack';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

type CreateEventModalProps = {
  isActive: boolean;
  onHide: () => void;
}

const CreateEventModal = (props: CreateEventModalProps) => {
  const {
    isActive,
    onHide,
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { t: tCommon } = useTranslation('common');

  const handleSave = () => {
    enqueueSnackbar(tCommon('successAdd', { text: 'Event' }), {
      variant: 'success',
    });
    onHide();
  }

  return (
    <Dialog
      open={isActive}
      onClose={onHide}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        }
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Add Event</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>Event Code</Typography>
            <TextField
              fullWidth
              placeholder="type event code"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>Event Name</Typography>
            <TextField
              fullWidth
              placeholder="type event name"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <FormDatePicker
              title="Event Date"
              size="small"
              placeholder="choose event date"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end" sx={{ p: 2 }}>
          <Button variant="outlined" onClick={onHide} sx={{ py: 1, px: 5, borderRadius: 2 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ py: 1, px: 5, borderRadius: 2 }}>Save</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default CreateEventModal;