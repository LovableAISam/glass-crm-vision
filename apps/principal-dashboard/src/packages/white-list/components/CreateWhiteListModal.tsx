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
} from '@mui/material';
import { Button } from '@woi/web-component';
import { useSnackbar } from 'notistack';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

type CreateWhiteListModalProps = {
  isActive: boolean;
  onHide: () => void;
}

const CreateWhiteListModal = (props: CreateWhiteListModalProps) => {
  const {
    isActive,
    onHide,
  } = props;
  const [typeOptions] = useState([
    { label: 'SCP TYPE', value: '' },
    { label: 'NON SCP TYPE', value: '' },
    { label: 'OTHER TYPE', value: '' },
  ]);
  const [coOptions] = useState([
    { label: 'WOI', value: '' },
    { label: 'Goodie', value: '' },
    { label: 'TokoBaru', value: '' },
    { label: 'MentimunPay', value: '' },
    { label: 'KFCPay', value: '' },
  ]);
  const { enqueueSnackbar } = useSnackbar();
  const { t: tCommon } = useTranslation('common');

  const handleSave = () => {
    enqueueSnackbar(tCommon('successAdd', { text: 'White List' }), {
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
          <Typography variant="h5">Add White List</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>CO</Typography>
            <Autocomplete
              options={coOptions}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="select CO"
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
            <Typography variant="subtitle2" gutterBottom>Type</Typography>
            <Autocomplete
              options={typeOptions}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="select type"
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
            <Typography variant="subtitle2" gutterBottom>IP Address</Typography>
            <TextField
              fullWidth
              placeholder="type ip address"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>Description</Typography>
            <TextField
              fullWidth
              placeholder="type description"
              multiline
              rows={3}
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

export default CreateWhiteListModal;