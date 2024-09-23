// Core
import React from 'react';
import Image from 'next/legacy/image';
import SuccessImage from 'asset/images/success-co.svg';
import { useTranslation } from 'next-i18next';

// Components
import { Typography, Stack, Avatar } from '@mui/material';

import { Button, PasswordInput } from '@woi/web-component';
import useResetPassword from './hooks/useResetPassword';
import PasswordValidation, {
  usePasswordValidation,
} from '@src/shared/components/FormValidation/PasswordValidation';
import { useController } from 'react-hook-form';
import { TextValidation } from '@woi/core';

const ResetPassword = () => {
  const { isSuccess, formData, onSubmit, onRedirectToLogin } =
    useResetPassword();

  const {
    control,
    getValues,
    formState: { errors },
  } = formData;

  const { validatePassword, validationPasswordConfirm } = usePasswordValidation(
    {
      password: getValues('password'),
      passwordConfirm: getValues('passwordConfirm'),
    },
  );

  const { field: fieldPassword } = useController({
    name: 'password',
    control,
    rules: {
      required: 'Password must be filled.',
      validate: value => {
        if (!TextValidation.minChar(value, 8)) return 'Min. 8 characters.';
        else if (!TextValidation.maxChar(value, 20))
          return 'Max. 20 characters.';
        else if (!TextValidation.containsUppercase(value))
          return 'At least 1 uppercase letter.';
        else if (!TextValidation.containsSpecialChars(value))
          return 'At least 1 symbols.';
        else if (!TextValidation.containsNumber(value))
          return 'At least 1 number.';
      },
    },
  });

  const { field: fieldPasswordConfirm } = useController({
    name: 'passwordConfirm',
    control,
    rules: {
      validate: value => {
        if (!value) return 'Confirm Password must be filled';
        if (value !== getValues('password'))
          return 'Password doesn’t match. Please re-check';
        return undefined;
      },
    },
  });

  const { t: tAuth } = useTranslation('auth');
  const { t: tForm } = useTranslation('form');

  if (isSuccess) {
    return (
      <Stack direction="column" spacing={5}>
        <Avatar
          variant="square"
          sx={{
            background: 'transparent',
            width: 150,
            height: 110,
            alignSelf: 'center',
          }}
        >
          <Image
            alt="success-image"
            src={SuccessImage}
            layout="fill"
            style={{
              objectFit: 'contain',
            }}
          />
        </Avatar>
        <Stack direction="column" spacing={2}>
          <Typography variant="h3" align="center">
            {tAuth('resetPasswordSuccessTitle')}
          </Typography>
          <Typography variant="body1" align="center">
            {tAuth('resetPasswordSuccessDescription')}
          </Typography>
        </Stack>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ py: 1, px: 5, borderRadius: 2 }}
          loadingPosition="end"
          onClick={onRedirectToLogin}
        >
          <Typography variant="subtitle2">{tAuth('loginCTA')}</Typography>
        </Button>
      </Stack>
    );
  }

  return (
    <Stack direction="column" spacing={5}>
      <Typography variant="h3" align="center" sx={{ textAlign: 'left' }}>
        {tAuth('resetPasswordTitle')}
      </Typography>
      <Stack direction="column" spacing={2}>
        <Stack direction="column" spacing={1}>
          <Typography variant="subtitle2">
            {tForm('newPasswordFieldLabel')}
          </Typography>
          <PasswordInput
            {...fieldPassword}
            fullWidth
            placeholder={tForm('newPasswordFieldPlaceholder')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
          />
        </Stack>
        <PasswordValidation
          validatePassword={validatePassword}
          validationPasswordConfirm={validationPasswordConfirm}
        />
        <Stack direction="column" spacing={1}>
          <Typography variant="subtitle2">
            {tForm('confirmNewPasswordFieldLabel')}
          </Typography>
          <PasswordInput
            {...fieldPasswordConfirm}
            fullWidth
            placeholder={tForm('confirmNewPasswordFieldPlaceholder')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
            error={Boolean(errors.passwordConfirm)}
            helperText={errors.passwordConfirm?.message}
          />
        </Stack>
      </Stack>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ py: 1, px: 5, borderRadius: 2 }}
        loadingPosition="end"
        onClick={onSubmit}
      >
        <Typography variant="subtitle2">{tAuth('resetPasswordCTA')}</Typography>
      </Button>
    </Stack>
  );
};

export default ResetPassword;
