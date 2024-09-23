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
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { Button } from '@woi/web-component';
import { useSnackbar } from 'notistack';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

type CreateLookupModalProps = {
  isActive: boolean;
  onHide: () => void;
}

const CreateLookupModal = (props: CreateLookupModalProps) => {
  const {
    isActive,
    onHide,
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { t: tCommon } = useTranslation('common');

  const handleSave = () => {
    enqueueSnackbar(tCommon('successAdd', { text: 'Lookup' }), {
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
          <Typography variant="h5">Add Lookup</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>Lookup Code</Typography>
            <TextField
              fullWidth
              placeholder="type lookup code"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>Lookup Value</Typography>
            <TextField
              fullWidth
              placeholder="type lookup value"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>Status</Typography>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              defaultValue={"yes"}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
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

export default CreateLookupModal;