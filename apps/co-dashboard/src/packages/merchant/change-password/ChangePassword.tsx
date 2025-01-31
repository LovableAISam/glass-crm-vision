// Cores
import React from 'react';

// Components
import { Card, Divider, Stack, Typography, useTheme } from '@mui/material';
import { PasswordInput, Button, Token } from '@woi/web-component';

// Hooks & Utils
import { useController } from 'react-hook-form';
import { TextValidation } from '@woi/core';
import useChangePassword from './hooks/useChangePassword';
import { stringToDateFormat } from '@woi/core/utils/date/dateConvert';
import { useTranslation } from 'react-i18next';

// Types & Consts
import {
  LONG_DATE_FORMAT,
  LONG_TIME_FORMAT,
} from '@woi/core/utils/date/constants';

function ChangePassword() {
  const theme = useTheme();
  const {
    formData,
    passwordChangedHistoryData,
    handleChangePassword,
    handleCancel,
  } = useChangePassword();
  const { t: tCommon } = useTranslation('common');
  const { t: tChangePassword } = useTranslation('changePassword');
  const { t: tForm } = useTranslation('form');

  const {
    control,
    getValues,
    formState: { errors },
  } = formData;

  const { field: fieldPassword } = useController({
    name: 'password',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: tChangePassword('formOldPassword'),
      }),
    },
  });

  const { field: fieldNewPassword } = useController({
    name: 'newPassword',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: tChangePassword('formNewPassword'),
      }),
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

  const { field: fieldNewPasswordConfirm } = useController({
    name: 'newPasswordConfirm',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: tChangePassword('formConfirmNewPassword'),
      }),
      validate: value => {
        if (value !== getValues('newPassword'))
          return tForm('generalErrorMissMatching', {
            fieldName: 'New password',
          });
        return undefined;
      },
    },
  });

  return (
    <Stack direction="column" spacing={3}>
      <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Typography textAlign="center" variant="h4">
          {tChangePassword('pageTitle')}
        </Typography>
        <Stack direction="column" spacing={3} sx={{ mt: 3 }}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tChangePassword('formOldPassword')}
            </Typography>
            <PasswordInput
              {...fieldPassword}
              fullWidth
              placeholder={tChangePassword('placeholderOldPassword')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />
          </Stack>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tChangePassword('formNewPassword')}
            </Typography>
            <PasswordInput
              {...fieldNewPassword}
              fullWidth
              placeholder={tChangePassword('placeholderNewPassword')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.newPassword)}
              helperText={errors.newPassword?.message}
            />
          </Stack>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tChangePassword('formConfirmNewPassword')}
            </Typography>
            <PasswordInput
              {...fieldNewPasswordConfirm}
              fullWidth
              placeholder={tChangePassword('placeholderConfirmNewPassword')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.newPasswordConfirm)}
              helperText={errors.newPasswordConfirm?.message}
            />
          </Stack>
          <Stack direction="row" justifyContent="center" spacing={2}>
            <Button
              color="primary"
              variant="outlined"
              sx={{ px: 8, py: 1, borderRadius: 2 }}
              onClick={handleCancel}
            >
              {tCommon('actionCancel')}
            </Button>
            <Button
              color="primary"
              variant="contained"
              sx={{ px: 8, py: 1, borderRadius: 2 }}
              onClick={handleChangePassword}
            >
              {tCommon('actionSave')}
            </Button>
          </Stack>
        </Stack>
      </Card>
      <Card
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: theme.palette.secondary.main,
        }}
      >
        <Typography variant="subtitle1">
          {tChangePassword('textLastSecurityActivities')}
        </Typography>
        <Stack direction="column" sx={{ mt: 2 }}>
          {passwordChangedHistoryData.map((activity, index) => (
            <Stack key={index}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ py: 2 }}
              >
                <Stack direction="row" spacing={2}>
                  <Typography variant="body2">
                    {stringToDateFormat(activity.createdDate, LONG_DATE_FORMAT)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={Token.color.greyscaleGreyDarkest}
                  >
                    ●
                  </Typography>
                  <Typography
                    variant="body2"
                    color={Token.color.greyscaleGreyDarkest}
                  >
                    {stringToDateFormat(activity.createdDate, LONG_TIME_FORMAT)}
                  </Typography>
                </Stack>
                <Typography variant="subtitle2">
                  {tChangePassword('textPasswordChanged')}
                </Typography>
              </Stack>
              <Divider
                sx={{ borderColor: Token.color.secondaryBlueTintLight }}
              />
            </Stack>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}

export default ChangePassword;
