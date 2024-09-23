import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  IconButton,
  Grid,
  TextField,
  Autocomplete,
} from '@mui/material';

// Components
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@woi/web-component';

// Types
import { CommunityOwnerContact } from '@woi/communityOwner';
import useContactUpsert from '../hooks/useContactUpsert';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type AddContactModalProps = {
  isActive: boolean;
  selectedData: CommunityOwnerContact | null;
  onHide: () => void;
  onSubmit: (form: CommunityOwnerContact) => void;
  onDelete: (form: CommunityOwnerContact) => void;
}

const AddContactModal = (props: AddContactModalProps) => {
  const {
    isActive,
    onHide,
    selectedData,
    onSubmit,
    onDelete,
  } = props;
  const {
    contactTypeOptions,
    formData,
    handleSave,
    handleCancel,
  } = useContactUpsert({ selectedData, onHide, onSubmit });
  const { t: tCommon } = useTranslation('common');
  const { t: tCO } = useTranslation('co');
  const { t: tForm } = useTranslation('form');

  const { control, formState: { errors } } = formData;

  const { field: fieldType } = useController({
    name: 'type',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Contact type' }),
    }
  });

  const { field: fieldNumber } = useController({
    name: 'number',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Contact Number' }),
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
          <Typography variant="h5">{tCO('contactActionAdd')}</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers={true}>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('contactFormContactType')}</Typography>
              <Autocomplete
                {...fieldType}
                onChange={(_, value) => fieldType.onChange(value)}
                options={contactTypeOptions}
                fullWidth
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={tForm('placeholderSelect', { fieldName: 'contact type' })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3
                      }
                    }}
                    error={Boolean(errors.type)}
                    helperText={errors.type?.message}
                  />
                )}
              />
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('contactFormContactNumber')}</Typography>
              <TextField
                {...fieldNumber}
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                fullWidth
                placeholder={tForm('placeholderType', { fieldName: 'contact number' })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
                error={Boolean(errors.number)}
                helperText={errors.number?.message}
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: selectedData ? 'space-between' : 'flex-end', p: 2 }}>
        {selectedData && (
          <Button
            size="large"
            variant="text"
            onClick={() => onDelete(selectedData)}
            sx={{ py: 1, px: 5, borderRadius: 2 }}
          >{tCO('contactActionDelete')}</Button>
        )}
        <Stack direction="row" spacing={2} alignItems="center">
          <Button size="large" variant="outlined" onClick={handleCancel} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tCommon('actionCancel')}</Button>
          <Button size="large" variant="contained" onClick={handleSave} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tCommon('actionSave')}</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default AddContactModal;