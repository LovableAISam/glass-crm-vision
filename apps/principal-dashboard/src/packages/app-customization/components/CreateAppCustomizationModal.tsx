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
  Card,
  useTheme,
} from '@mui/material';
import { Button } from '@woi/web-component';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import useAppCustomizationUpsert from '../hooks/useAppCustomizationUpsert';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type CreateAppCustomizationModalProps = {
  isActive: boolean;
  onHide: () => void;
}

const CreateAppCustomizationModal = (props: CreateAppCustomizationModalProps) => {
  const { isActive, onHide } = props;
  const theme = useTheme();

  const {
    coOptions,
    formData,
    handleCancel,
    handleUpsert,
  } = useAppCustomizationUpsert({ onHide });
  const { t: tCommon } = useTranslation('common');
  const { t: tAppCustomization } = useTranslation('appCustomization');
  const { t: tForm } = useTranslation('form');

  const { control, formState: { errors } } = formData;

  const { field: fieldCO } = useController({
    name: 'co',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'CO' }),
    }
  });

  return (
    <Dialog
      open={isActive}
      onClose={onHide}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        }
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{tAppCustomization('modalCreateTitle')}</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tAppCustomization('formCO')}</Typography>
            <Autocomplete
              {...fieldCO}
              onChange={(_, value) => fieldCO.onChange(value)}
              options={coOptions}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', { fieldName: 'CO' })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3
                    }
                  }}
                  error={Boolean(errors.co)}
                  helperText={errors.co?.message}
                />
              )}
            />
            <Card elevation={0} sx={{ p: 2, pr: 3, mt: 2, borderRadius: 3, backgroundColor: theme.palette.secondary.main }}>
              <Typography variant="body2">{tAppCustomization('infoCreate')}</Typography>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" alignItems="center" justifyContent={'flex-end'} sx={{ p: 2, flex: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
            <Button variant="outlined" onClick={handleCancel} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tCommon('actionCancel')}</Button>
            <Button variant="contained" onClick={handleUpsert} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tAppCustomization('actionCreate')}</Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default CreateAppCustomizationModal;