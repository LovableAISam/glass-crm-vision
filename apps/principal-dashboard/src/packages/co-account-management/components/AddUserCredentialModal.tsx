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
} from '@mui/material';

// Components
import CloseIcon from '@mui/icons-material/Close';
import { Button, PasswordInput } from '@woi/web-component';

// Types
import useUserCredentialUpsert from '../hooks/useUserCredentialUpsert';
import { CommunityOwnerUserOTP } from '@woi/communityOwner';
import { useController } from 'react-hook-form';
import { TextValidation } from '@woi/core';
import { useTranslation } from 'react-i18next';

type AddUserCredentialModalProps = {
  isActive: boolean;
  selectedData: CommunityOwnerUserOTP | null;
  onHide: () => void;
  onSubmit: (form: CommunityOwnerUserOTP) => void;
  onDelete: (form: CommunityOwnerUserOTP) => void;
}

const AddUserCredentialModal = (props: AddUserCredentialModalProps) => {
  const {
    isActive,
    onHide,
    selectedData,
    onSubmit,
    onDelete,
  } = props;
  const { 
    formData,
    handleSave,
    handleCancel,
  } = useUserCredentialUpsert({ selectedData, onHide, onSubmit });
  const { t: tCommon } = useTranslation('common');
  const { t: tCO } = useTranslation('co');
  const { t: tForm } = useTranslation('form');

  const { control, getValues, formState: { errors } } = formData;

  const { field: fieldUsername } = useController({
    name: 'username',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Username' }),
    }
  });

  const { field: fieldPassword } = useController({
    name: 'password',
    control,
    rules: {
      required: 'Password must be filled.',
      validate: value => {
        if (!TextValidation.minChar(value, 8)) return tForm('generalErrorMinChar', { number: 8 });
        else if (!TextValidation.maxChar(value, 20)) return tForm('generalErrorMaxChar', { number: 20 });
        else if (!TextValidation.containsUppercase(value)) return tForm('generalErrorContainsUppercase');
        else if (!TextValidation.containsSpecialChars(value)) return tForm('generalErrorContainsSpecialChars');
        else if (!TextValidation.containsNumber(value)) return tForm('generalErrorContainsNumber');
      }
    }
  });

  const { field: fieldPasswordConfirm } = useController({
    name: 'passwordConfirm',
    control,
    rules: {
      required: 'Password confirm must be filled.',
      validate: value => {
        if (value !== getValues('password')) return tForm('generalErrorMissMatching', { fieldName: 'Password' })
        return undefined;
      }
    }
  });

  const { field: fieldSender } = useController({
    name: 'sender',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Sender' }),
    }
  });


  const { field: fieldDivision } = useController({
    name: 'division',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Division' }),
    }
  });

  const { field: fieldChannel } = useController({
    name: 'channel',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Channel' }),
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
          <Typography variant="h5">{tCO('userCredentialActionAdd')}</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers={true}>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('userCredentialFormUser')}</Typography>
              <TextField
                {...fieldUsername}
                fullWidth
                placeholder={tForm('placeholderType', { fieldName: 'user' })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
                error={Boolean(errors.username)}
                helperText={errors.username?.message}
              />
            </Stack>
          </Grid>
          <Grid item md={6}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('userCredentialFormPassword')}</Typography>
              <PasswordInput 
                {...fieldPassword}
                fullWidth
                placeholder={tForm('placeholderType', { fieldName: 'password' })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />
            </Stack>
          </Grid>
          <Grid item md={6}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('userCredentialFormConfirmPassword')}</Typography>
              <PasswordInput 
                {...fieldPasswordConfirm}
                fullWidth
                placeholder={tForm('placeholderType', { fieldName: 'confirm password' })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
                error={Boolean(errors.passwordConfirm)}
                helperText={errors.passwordConfirm?.message}
              />
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('userCredentialFormSender')}</Typography>
              <TextField
                {...fieldSender}
                fullWidth
                placeholder={tForm('placeholderType', { fieldName: 'sender' })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
                error={Boolean(errors.sender)}
                helperText={errors.sender?.message}
              />
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('userCredentialFormDivision')}</Typography>
              <TextField
                {...fieldDivision}
                fullWidth
                placeholder={tForm('placeholderType', { fieldName: 'division' })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
                error={Boolean(errors.division)}
                helperText={errors.division?.message}
              />
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('userCredentialFormChannel')}</Typography>
              <TextField
                {...fieldChannel}
                fullWidth
                placeholder={tForm('placeholderType', { fieldName: 'channel' })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
                error={Boolean(errors.channel)}
                helperText={errors.channel?.message}
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
          >{tCO('userCredentialActionDelete')}</Button>
        )}
        <Stack direction="row" spacing={2} alignItems="center">
          <Button size="large" variant="outlined" onClick={handleCancel} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tCommon('actionCancel')}</Button>
          <Button size="large" variant="contained" onClick={handleSave} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tCommon('actionSave')}</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default AddUserCredentialModal;