import React, { useState } from 'react';
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
  Divider,
} from '@mui/material';
import { Button, Token } from '@woi/web-component';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

type CreateCOBrandModalProps = {
  isActive: boolean;
  onHide: () => void;
}

const CreateCOBrandModal = (props: CreateCOBrandModalProps) => {
  const {
    isActive,
    onHide,
  } = props;
  const [period, setPeriod] = useState<Date | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { t: tCommon } = useTranslation('common');

  const handleSave = () => {
    enqueueSnackbar(tCommon('successAdd', { text: 'CO Brand' }), {
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
          <Typography variant="h5">Edit Co Brand Details</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={6} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="body2" color={Token.color.greyscaleGreyDarkest}>Co Brand Code</Typography>
              <Typography variant="subtitle2">CB.Fri.092187309019913710</Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={6} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="body2" color={Token.color.greyscaleGreyDarkest}>Merchant Name</Typography>
              <Typography variant="subtitle2">Mentimun</Typography>
              <Divider />
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>Name</Typography>
            <TextField
              fullWidth
              placeholder="type name"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>URL Notif</Typography>
            <TextField
              fullWidth
              placeholder="type url notif"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>Effective Date</Typography>
            <DesktopDatePicker
              value={period}
              onChange={(newValue) => {
                setPeriod(newValue);
              }}
              minDate={new Date()}
              inputFormat="dd/MM/yyyy"
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="select effective date"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3
                    }
                  }}
                />
              )}
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

export default CreateCOBrandModal;