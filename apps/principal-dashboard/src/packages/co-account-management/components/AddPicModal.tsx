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
  Card,
  Autocomplete,
} from '@mui/material';

// Components
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Button, FormDatePicker, PasswordInput, Token } from '@woi/web-component';

// Utils
import { stringToDateFormat } from '@woi/core/utils/date/dateConvert';

// Types
import { CommunityOwnerUserPIC } from '@woi/communityOwner';
import { useController } from 'react-hook-form';
import { TextValidation } from '@woi/core';
import usePICUpsert from '../hooks/usePicUpsert';
import { useTranslation } from 'react-i18next';

type AddPICModalProps = {
  isActive: boolean;
  selectedData: CommunityOwnerUserPIC | null;
  onHide: () => void;
  onSubmit: (form: CommunityOwnerUserPIC) => void;
  onDelete: (form: CommunityOwnerUserPIC) => void;
}

const AddPICModal = (props: AddPICModalProps) => {
  const {
    isActive,
    onHide,
    selectedData,
    onSubmit,
    onDelete,
  } = props;
  const {
    roleOptions,
    formData,
    handleSave,
    handleGeneratePassword,
    handleCancel,
    handleLockUnlock,
  } = usePICUpsert({ selectedData, onHide, onSubmit });
  const { t: tCommon } = useTranslation('common');
  const { t: tCO } = useTranslation('co');
  const { t: tForm } = useTranslation('form');

  const { control, getValues, formState: { errors } } = formData;

  const { field: fieldUsername } = useController({
    name: 'username',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Email' }),
      validate: value => {
        if (!TextValidation.isEmailFormat(value)) return tForm('generalErrorEmail');
      }
    }
  });

  const { field: fieldRole } = useController({
    name: 'role',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Role' }),
    }
  });


  const { field: fieldPassword } = useController({
    name: 'password',
    control,
    rules: {
      required: !selectedData && tForm('generalErrorRequired', { fieldName: 'Password' }),
      validate: value => {
        if (selectedData) return true;
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
      required: !selectedData && 'Password confirm must be filled.',
      validate: value => {
        if (selectedData) return true;
        if (value !== getValues('password')) return tForm('generalErrorMissMatching', { fieldName: 'Password' })
        return undefined;
      }
    }
  });

  const { field: fieldActiveDate } = useController({
    name: 'activeDate',
    control,
  });

  const { field: fieldInActiveDate } = useController({
    name: 'inactiveDate',
    control,
  });

  const renderAccountStatus = () => {
    if (getValues('isLocked')) {
      return (
        <Card
          variant="elevation"
          sx={{ p: 2, borderRadius: 3, height: 100 }}
        >
          <Stack direction="column" spacing={1}>
            <Typography variant="body2">{tCO('picFormAccountStatus')}</Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle2" color={Token.color.redDark}>{'Locked'}</Typography>
              <Button variant="outlined" size="small" sx={{ py: 1, borderRadius: 2 }} onClick={handleLockUnlock}>{'Unlock'}</Button>
            </Stack>
          </Stack>
        </Card>
      )
    }

    return (
      <Card
        variant="elevation"
        sx={{ p: 2, borderRadius: 3, height: 100 }}
      >
        <Stack direction="column" spacing={1}>
          <Typography variant="body2">{tCO('picFormAccountStatus')}</Typography>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" color={Token.color.greenDark}>{'Unlocked'}</Typography>
            <Button variant="outlined" size="small" sx={{ py: 1, borderRadius: 2 }} onClick={handleLockUnlock}>{'Lock'}</Button>
          </Stack>
        </Stack>
      </Card>
    )
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
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{tCO('picActionAdd')}</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers={true}>
        {selectedData && (
          <Grid container spacing={2} sx={{ paddingBottom: 2 }}>
            <Grid item md={6} xs={12}>
              <Card
                variant="elevation"
                sx={{ p: 2, borderRadius: 3, height: 100 }}
              >
                <Stack direction="column" spacing={2}>
                  <Typography variant="body2">{tCO('picFormEffectiveDate')}</Typography>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle2">{stringToDateFormat(fieldActiveDate.value)} - {stringToDateFormat(fieldInActiveDate.value)}</Typography>
                    <CalendarTodayIcon sx={theme => ({ color: theme.palette.primary.main })} />
                  </Stack>
                </Stack>
              </Card>
            </Grid>
            <Grid item md={6} xs={12}>
              {renderAccountStatus()}
            </Grid>
          </Grid>
        )}
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('picFormEmail')}</Typography>
              <TextField
                {...fieldUsername}
                fullWidth
                placeholder={tForm('placeholderType', { fieldName: 'email' })}
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
          {selectedData ? (
            <Grid item md={12} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">{tCO('picFormRole')}</Typography>
                <Autocomplete
                  {...fieldRole}
                  onChange={(_, value) => fieldRole.onChange(value)}
                  options={roleOptions}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', { fieldName: 'role' })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3
                        }
                      }}
                      error={Boolean(errors.role)}
                      helperText={errors.role?.message}
                    />
                  )}
                  disabled
                />
              </Stack>
            </Grid>
          ) : (
            <React.Fragment>
              <Grid item md={6}>
                <Stack direction="column" spacing={1} alignItems="flex-start">
                  <Typography variant="subtitle2">{tCO('picFormPassword')}</Typography>
                  <PasswordInput
                    {...fieldPassword}
                    fullWidth
                    placeholder={tForm('placeholderType', { fieldName: 'password' })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3
                      }
                    }}
                    key="roleUpdate"
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                  />
                  <Button variant="text" color="primary" onClick={handleGeneratePassword}>{tCO('picActionGeneratePassword')}</Button>
                </Stack>
              </Grid>
              <Grid item md={6}>
                <Stack direction="column" spacing={1}>
                  <Typography variant="subtitle2">{tCO('picFormConfirmPassword')}</Typography>
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
              <Grid item md={6} xs={12}>
                <Stack direction="column" spacing={1}>
                  <Typography variant="subtitle2">{tCO('picFormRole')}</Typography>
                  <Autocomplete
                    {...fieldRole}
                    onChange={(_, value) => fieldRole.onChange(value)}
                    options={roleOptions}
                    fullWidth
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={tForm('placeholderSelect', { fieldName: 'role' })}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3
                          }
                        }}
                        key="roleCreate"
                        error={Boolean(errors.role)}
                        helperText={errors.role?.message}
                      />
                    )}
                    disabled
                  />
                </Stack>
              </Grid>
              <Grid item md={6} xs={12}>
                <Stack direction="column" spacing={1}>
                  <Typography variant="subtitle2">{tCO('picFormEffectiveDate')}</Typography>
                  <FormDatePicker
                    value={{
                      startDate: fieldActiveDate.value,
                      endDate: fieldInActiveDate.value,
                    }}
                    onChange={({ startDate, endDate }) => {
                      fieldActiveDate.onChange(startDate);
                      fieldInActiveDate.onChange(endDate);
                    }}
                    placeholder={tForm('placeholderSelect', { fieldName: 'date' })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      }
                    }}
                  />
                </Stack>
              </Grid>
            </React.Fragment>
          )}
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

export default AddPICModal;