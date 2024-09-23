import React, { useEffect } from 'react';
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
} from '@mui/material';
import {
  Button,
  FormDatePicker,
  PasswordInput,
  Token,
} from '@woi/web-component';

// Hooks & Utils
import { UserData } from '@woi/service/co/idp/user/userList';
import useUserUpsert from '../hooks/useUserUpsert';
import { useController } from 'react-hook-form';
import { TextValidation } from '@woi/core';
import { useTranslation } from 'react-i18next';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';

type CreateUserModalProps = {
  selectedData: UserData | null;
  isActive: boolean;
  onHide: () => void;
  fetchUserList: () => void;
};

const CreateUserModal = (props: CreateUserModalProps) => {
  const { selectedData, isActive, onHide, fetchUserList } = props;
  const {
    roleOptions,
    formData,
    handleUpsert,
    handleGeneratePassword,
    handleActivateDeactivate,
    handleCancel,
    handleLockUnlock,
    setValue,
  } = useUserUpsert({ selectedData, onHide, fetchUserList });
  const {
    getValues,
    formState: { errors },
    control,
  } = formData;
  const { t: tCommon } = useTranslation('common');
  const { t: tUser } = useTranslation('user');
  const { t: tForm } = useTranslation('form');

  const EmailValidation = require('emailvalid');
  const ev = new EmailValidation({
    allowFreemail: true,
    blacklist: ['baddomain.com'],
  });
  const isUpdate = Boolean(selectedData);

  const { field: fieldUserEmail } = useController({
    name: 'username',
    control,
    rules: {
      required: isUpdate
        ? false
        : tForm('generalErrorRequired', { fieldName: 'Username' }),
      validate: value => {
        const validate = ev.check(value);
        if (!TextValidation.isEmailFormat(value))
          return tForm('generalErrorEmail');
        if (!isUpdate && !validate.valid)
          return tForm('generalErrorEmailDisposible');
      },
    },
  });

  const { field: fieldPassword } = useController({
    name: 'password',
    control,
    rules: isUpdate
      ? {}
      : {
          required: tForm('generalErrorRequired', { fieldName: 'Password' }),
          validate: value => {
            if (!TextValidation.minChar(value, 8))
              return tForm('generalErrorMinChar', { number: 8 });
            else if (!TextValidation.maxChar(value, 20))
              return tForm('generalErrorMaxChar', { number: 20 });
            else if (!TextValidation.containsUppercase(value))
              return tForm('generalErrorContainsUppercase');
            else if (!TextValidation.containsSpecialChars(value))
              return tForm('generalErrorContainsSpecialChars');
            else if (!TextValidation.containsNumber(value))
              return tForm('generalErrorContainsNumber');
          },
        },
  });

  const { field: fieldPasswordConfirm } = useController({
    name: 'passwordConfirm',
    control,
    rules: isUpdate
      ? {}
      : {
          validate: value => {
            if (!value)
              return tForm('generalErrorRequired', {
                fieldName: 'Password Confirm',
              });
            if (value !== getValues('password'))
              return tForm('generalErrorMissMatching', {
                fieldName: 'Password',
              });
            return undefined;
          },
        },
  });

  const { field: fieldRole } = useController({
    name: 'role',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Role' }),
    },
  });

  const { field: fieldName } = useController({
    name: 'name',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Name' }),
    },
  });

  const { field: fieldDescription } = useController({
    name: 'description',
    control,
  });

  const { field: fieldEffectiveDate } = useController({
    name: 'activeDate',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Effective date' }),
      validate: value => {
        if (value.startDate === null || value.endDate === null)
          return tForm('generalErrorRequired', { fieldName: 'Effective date' });
      },
    },
  });

  useEffect(() => {
    setValue('activeDate', {
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 6)),
    });
  }, []);

  const renderUserStatus = () => {
    if (getValues('enabled')) {
      return (
        <Card variant="elevation" sx={{ p: 2, borderRadius: 3, height: 100 }}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">{tUser('detailUserStatus')}</Typography>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="subtitle2" color={Token.color.greenDark}>
                {tUser('statusActive')}
              </Typography>
              <AuthorizeView access="principal" privileges={['update']}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleActivateDeactivate}
                  sx={{ py: 1, borderRadius: 2 }}
                >
                  {tUser('actionDeactivate')}
                </Button>
              </AuthorizeView>
            </Stack>
          </Stack>
        </Card>
      );
    }

    return (
      <Card variant="elevation" sx={{ p: 2, borderRadius: 3, height: 100 }}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2">{tUser('detailUserStatus')}</Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="subtitle2" color={Token.color.redDark}>
              {tUser('statusInactive')}
            </Typography>
            <AuthorizeView access="principal" privileges={['update']}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleActivateDeactivate}
                sx={{ py: 1, borderRadius: 2 }}
              >
                {tUser('actionActivate')}
              </Button>
            </AuthorizeView>
          </Stack>
        </Stack>
      </Card>
    );
  };

  const renderAccountStatus = () => {
    if (getValues('isLocked')) {
      return (
        <Card sx={{ borderRadius: 3, p: 2, height: 100 }}>
          <Stack direction="column" spacing={2}>
            <Typography
              variant="body2"
              color={Token.color.greyscaleGreyDarkest}
            >
              {tUser('detailAccountStatus')}
            </Typography>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle2" color={Token.color.redDark}>
                {tUser('statusLocked')}
              </Typography>
              <AuthorizeView access="principal" privileges={['update']}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ py: 1, borderRadius: 2 }}
                  onClick={handleLockUnlock}
                >
                  {tUser('actionUnlock')}
                </Button>
              </AuthorizeView>
            </Stack>
          </Stack>
        </Card>
      );
    }

    return (
      <Card sx={{ borderRadius: 3, p: 2, height: 100 }}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body2" color={Token.color.greyscaleGreyDarkest}>
            {tUser('detailAccountStatus')}
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle2" color={Token.color.greenDark}>
              {tUser('statusActive')}
            </Typography>
            <AuthorizeView access="principal" privileges={['update']}>
              <Button
                variant="outlined"
                size="small"
                sx={{ py: 1, borderRadius: 2 }}
                onClick={handleLockUnlock}
              >
                {tUser('actionLock')}
              </Button>
            </AuthorizeView>
          </Stack>
        </Stack>
      </Card>
    );
  };

  return (
    <Dialog
      open={isActive}
      onClose={onHide}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        },
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">
            {isUpdate ? tUser('modalUpdateTitle') : tUser('modalCreateTitle')}
          </Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          {isUpdate ? (
            <React.Fragment>
              <Grid item md={4} xs={12}>
                <Card
                  variant="elevation"
                  sx={{ p: 2, borderRadius: 3, height: 100 }}
                >
                  <Stack direction="column" spacing={2}>
                    <Typography variant="body2">
                      {tUser('detailUsername')}
                    </Typography>
                    <Typography variant="subtitle2">
                      {fieldUserEmail.value}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
              <Grid item md={4} xs={12}>
                {renderUserStatus()}
              </Grid>
              <Grid item md={4} xs={12}>
                {renderAccountStatus()}
              </Grid>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {tUser('formUsername')}
                </Typography>
                <TextField
                  {...fieldUserEmail}
                  fullWidth
                  placeholder={tForm('placeholderType', { fieldName: 'email' })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.username)}
                  helperText={errors.username?.message}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {tUser('formPassword')}
                </Typography>
                <PasswordInput
                  {...fieldPassword}
                  fullWidth
                  placeholder={tForm('placeholderType', {
                    fieldName: 'password',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                />
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleGeneratePassword}
                >
                  {tUser('actionGeneratePassword')}
                </Button>
              </Grid>
              <Grid item md={6} xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {tUser('formConfirmPassword')}
                </Typography>
                <PasswordInput
                  {...fieldPasswordConfirm}
                  fullWidth
                  placeholder={tForm('placeholderType', {
                    fieldName: 'confirm password',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.passwordConfirm)}
                  helperText={errors.passwordConfirm?.message}
                />
              </Grid>
            </React.Fragment>
          )}
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tUser('formName')}
            </Typography>
            <TextField
              {...fieldName}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'name' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
          </Grid>
          {isUpdate && (
            <Grid item md={12} xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                {tUser('formPassword')}
              </Typography>
              <TextField
                value="••••••••"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
                disabled
              />
            </Grid>
          )}
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tUser('formRole')}
            </Typography>
            <Autocomplete
              {...fieldRole}
              onChange={(_, value) => fieldRole.onChange(value)}
              options={roleOptions}
              fullWidth
              getOptionLabel={option => option.label}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', {
                    fieldName: 'role',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.role)}
                  helperText={errors.role?.message}
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tUser('formDescription')}
            </Typography>
            <TextField
              {...fieldDescription}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'description',
              })}
              multiline
              rows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.description)}
              helperText={errors.description?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tUser('formEffectiveDate')}
            </Typography>
            <FormDatePicker
              {...fieldEffectiveDate}
              placeholder={tForm('placeholderSelect', { fieldName: 'date' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              upcomingDate
              noShortcuts
              dateRangeProps={{
                minDate: new Date(),
              }}
              error={Boolean(errors.activeDate)}
              helperText={errors.activeDate?.message}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={'flex-end'}
          sx={{ p: 2, flex: 1 }}
        >
          <AuthorizeView access="principal" privileges={['create', 'update']}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="flex-end"
            >
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{ py: 1, px: 5, borderRadius: 2 }}
              >
                {tCommon('actionCancel')}
              </Button>
              <Button
                variant="contained"
                onClick={handleUpsert}
                sx={{ py: 1, px: 5, borderRadius: 2 }}
              >
                {tCommon('actionSave')}
              </Button>
            </Stack>
          </AuthorizeView>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserModal;
