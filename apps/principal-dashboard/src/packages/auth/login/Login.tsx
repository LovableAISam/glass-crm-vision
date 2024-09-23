// Core
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import ReCAPTCHA from "react-google-recaptcha";

// Components
import {
  Typography,
  Stack,
  TextField,
} from '@mui/material';
import { Button, PasswordInput } from '@woi/web-component';

// Hooks
import useLogin from './hooks/useLogin';
import useRouteRedirection from '@src/shared/hooks/useRouteRedirection';
import { useController } from 'react-hook-form';
import { TextValidation } from '@woi/core';

const Login = () => {
  const router = useRouter();
  const { recaptchaRef, isVerified, formData, loadingSubmit, onSubmit, onChange } = useLogin();
  const { locale } = router;
  const { t: tAuth } = useTranslation('auth');
  const { t: tForm } = useTranslation('form');
  const { generateRoute } = useRouteRedirection();
  const siteKey = process.env.NEXT_PUBLIC_SITE_KEY;

  const { control, formState: { errors } } = formData;

  const { field: fieldUserEmail } = useController({
    name: 'username',
    control,
    rules: {
      required: 'User email must be filled.',
      validate: value => {
        if (!TextValidation.isEmailFormat(value)) return 'Invalid email format.';
      }
    }
  });

  const { field: fieldPassword } = useController({
    name: 'password',
    control,
    rules: {
      required: 'Password must be filled.',
    }
  });

  return (
    <Stack direction="column" spacing={5}>
      <Typography variant="h3" align="center" sx={{ textAlign: 'left' }}>{tAuth('loginTitle')}</Typography>
      <Stack direction="column" spacing={2}>
        <Stack direction="column" spacing={1}>
          <Typography variant="subtitle2">{tForm('usernameFieldLabel')}</Typography>
          <TextField
            {...fieldUserEmail}
            fullWidth
            placeholder={tForm('usernameFieldPlaceholder')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3
              }
            }}
            error={Boolean(errors.username)}
            helperText={errors.username?.message}
          />
        </Stack>
        <Stack direction="column" spacing={1}>
          <Typography variant="subtitle2">{tForm('passwordFieldLabel')}</Typography>
          <PasswordInput
            {...fieldPassword}
            fullWidth
            placeholder={tForm('passwordFieldPlaceholder')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3
              }
            }}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
          />
        </Stack>
        <Typography variant="subtitle2" color={theme => theme.palette.primary.main} align="right">
          <Link href={generateRoute('/forgot-password')}>
            <Typography variant="inherit" color={theme => theme.palette.primary.main} component="span" style={{ cursor: 'pointer' }}>
              {tAuth('forgotPasswordTitle')}
            </Typography>
          </Link>
        </Typography>
        {siteKey && (
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={siteKey}
            onChange={onChange}
            hl={locale}
          />
        )}
      </Stack>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ py: 1, px: 5, borderRadius: 2 }}
        loadingPosition="end"
        loading={loadingSubmit}
        disabled={!isVerified}
        onClick={onSubmit}
      >
        <Typography variant="subtitle2">{tAuth('loginCTA')}</Typography>
      </Button>
    </Stack>
  );
}

export default Login;