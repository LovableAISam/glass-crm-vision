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
  Autocomplete,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Button } from '@woi/web-component';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

type CreateMerchantModalProps = {
  isActive: boolean;
  onHide: () => void;
}

const CreateMerchantModal = (props: CreateMerchantModalProps) => {
  const {
    isActive,
    onHide,
  } = props;
  const [statusOptions] = useState([
    { label: 'Active', value: '' },
    { label: 'Inactive', value: '' },
    { label: 'Disabled', value: '' },
    { label: 'Please Verify', value: '' },
  ]);
  const [useLoyaltyOptions] = useState([
    { label: 'Yes', value: '' },
    { label: 'No', value: '' },
  ]);
  const [period, setPeriod] = useState<Date | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { t: tCommon } = useTranslation('common');

  const handleSave = () => {
    enqueueSnackbar(tCommon('successAdd', { text: 'Merchant' }), {
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
          <Typography variant="h5">Register New Merchant</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>Merchant Name</Typography>
            <TextField
              fullWidth
              placeholder="type merchant name"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>Email</Typography>
            <TextField
              fullWidth
              placeholder="type email"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>Merchant URL Notif</Typography>
            <TextField
              fullWidth
              placeholder="type merchant url notif"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControlLabel
              control={
                <Checkbox name="timeout" />
              }
              label={<Typography variant="subtitle2">Timeout</Typography>}
            />
            <TextField
              fullWidth
              placeholder="type timeout"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControlLabel
              control={
                <Checkbox name="cutoftime" />
              }
              label={<Typography variant="subtitle2">Cut of Time Limit</Typography>}
            />
            <TextField
              fullWidth
              placeholder="type cut of time limit"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>Status</Typography>
            <Autocomplete
              options={statusOptions}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="select status"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3
                    }
                  }}
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>Use Loyalty</Typography>
            <Autocomplete
              options={useLoyaltyOptions}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="select use loyalty"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3
                    }
                  }}
                />
              )}
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

export default CreateMerchantModal;