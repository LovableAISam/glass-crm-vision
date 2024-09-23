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
  Autocomplete,
} from '@mui/material';
import { Button, FormDatePicker, PasswordInput, useConfirmationDialog } from '@woi/web-component';
import { useSnackbar } from 'notistack';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import { OptionMap } from '@woi/option';
import { BillerData } from '../BillerManagementList';
import { useTranslation } from 'react-i18next';

type CreateBillerModalProps = {
  selectedData: BillerData | null;
  isActive: boolean;
  onHide: () => void;
}

const CreateBillerModal = (props: CreateBillerModalProps) => {
  const { t: tCO } = useTranslation('co');
  const { t: tCommon } = useTranslation('common');
  const {
    selectedData,
    isActive,
    onHide,
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const statusOptions: OptionMap<string>[] = [
    {
      label: tCO('active'),
      value: 'Active',
    },
    {
      label: tCO('inactive'),
      value: 'Inactive',
    },
  ]
  const isUpdate = Boolean(selectedData);

  const handleDelete = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationDeleteTitle', { text: 'Biller' }),
      message: tCommon('confirmationDeleteDescription', { text: 'Biller' }),
      primaryText: tCommon('confirmationDeleteYes'),
      secondaryText: tCommon('confirmationDeleteNo'),
    });

    if (confirmed) {
      enqueueSnackbar(tCommon('successDelete', { text: 'Biller' }), { variant: 'info' });
      onHide();
    }
  }

  const handleSave = () => {
    enqueueSnackbar(tCommon('failedDelete', { text: 'Biller' }), { variant: 'success' });
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
          <Typography variant="h5">{isUpdate ? 'Biller Details' : 'Add Biller'}</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tCO('billerName')}</Typography>
            <TextField
              fullWidth
              placeholder={tCO('typeBillerName')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tCO('username')}</Typography>
            <TextField
              fullWidth
              placeholder={tCO('typeUsername')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
          </Grid>
          <Grid item md={6}>
            <Stack direction="column" spacing={1} alignItems="flex-start">
              <Typography variant="subtitle2">{tCO('password')}</Typography>
              <PasswordInput
                fullWidth
                placeholder={tCO('inputPassword')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
              />
            </Stack>
          </Grid>
          <Grid item md={6}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('confirmPassword')}</Typography>
              <PasswordInput
                fullWidth
                placeholder={tCO('inputConfirmPassword')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
              />
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>Status</Typography>
            <Autocomplete
              options={statusOptions}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={tCO('selectStatus')}
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
            <Typography variant="subtitle2" gutterBottom>{tCO('effectiveDate')}</Typography>
            <FormDatePicker
              placeholder="select date"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
              }}
              dateRangeProps={{
                minDate: new Date(),
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" alignItems="center" justifyContent={isUpdate ? 'space-between' : 'flex-end'} sx={{ p: 2, flex: 1 }}>
          {isUpdate && (
            <Button variant="text" onClick={handleDelete} sx={{ py: 1, borderRadius: 2 }}>{tCO('deleteBiller')}</Button>
          )}
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
            <Button variant="outlined" onClick={onHide} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tCommon('actionCancel')}</Button>
            <Button variant="contained" onClick={handleSave} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tCommon('actionSave')}</Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default CreateBillerModal;