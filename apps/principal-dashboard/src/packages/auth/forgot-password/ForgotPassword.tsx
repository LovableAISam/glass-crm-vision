// Core
import React from 'react';
import Image from 'next/image';
import SuccessImage from 'asset/images/success.svg';
import { useTranslation } from 'next-i18next';

// Components
import {
  Typography,
  Stack,
  Avatar,
  TextField,
  Card,
} from '@mui/material';

import { Button, Token } from '@woi/web-component';
import useForgotPassword from './hooks/useForgotPassword';
import { useController } from 'react-hook-form';
import { TextValidation } from '@woi/core';

const ForgotPassword = () => {
  const {
    isSuccess,
    resend,
    countdown,
    displayCountdown,
    isLimit,
    formData,
    loadingSubmit,
    onSubmit,
  } = useForgotPassword();
  const { t: tAuth } = useTranslation('auth');
  const { t: tForm } = useTranslation('form');

  const { control, formState: { errors } } = formData;

  const { field: fieldEmail } = useController({
    name: 'email',
    control,
    rules: {
      required: 'User email must be filled.',
      validate: value => {
        if (!TextValidation.isEmailFormat(value)) return 'Invalid email format.';
      }
    }
  });

  if (isSuccess) {
    return (
      <Stack direction="column" spacing={6}>
        <Avatar variant="square" sx={{ background: 'transparent', width: 150, height: 110, alignSelf: 'center' }}>
          <Image src={SuccessImage} layout="fill" objectFit="contain" /> 
        </Avatar>
        <Stack direction="column" spacing={2}>
          <Typography variant="h3" align="center">{tAuth('forgotPasswordSuccessTitle')}</Typography>
          <Typography variant="body1" align="center">{tAuth('forgotPasswordSuccessDescription')}</Typography>
        </Stack>
        <Stack direction="column" spacing={1}>
          <Typography variant="body2" align="center">Didn’t receive the email?</Typography>
          {(resend && countdown === 0) ? (
            <Button 
              variant="text" 
              onClick={onSubmit}
              loadingPosition="end" 
              loading={loadingSubmit}
            >
              Send verification email again
            </Button>
          ) : (
            <Typography variant="subtitle2" align="center">Send verification email again in ({displayCountdown})</Typography>
          )}
        </Stack>
        {isLimit && (
          <Card elevation={0} sx={{ px: 3, py: 2, borderRadius: 3, backgroundColor: Token.color.orangeLight }}>
            <Typography>You have exceeded the limit of re-send the verification email. Please wait for 1 hour to send the verification email again. </Typography>
          </Card>
        )}
      </Stack>
    )
  }
  
  return (
    <Stack direction="column" spacing={5}>
      <Typography variant="h3" align="center" sx={{ textAlign: 'left' }}>{tAuth('forgotPasswordTitle')}</Typography>
      <Stack direction="column" spacing={2}>
        <Stack direction="column" spacing={1}>
          <Typography variant="subtitle2">{tForm('emailFieldLabel')}</Typography>
          <TextField
            {...fieldEmail}
            fullWidth
            placeholder={tForm('emailFieldPlaceholder')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3
              }
            }}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />
        </Stack>
      </Stack>
      <Card elevation={0} sx={{ px: 3, py: 2, borderRadius: 3, backgroundColor: Token.color.secondaryBlueTintLightest }}>
        <Typography variant="body1">{tAuth('verificationInfo')}</Typography>
      </Card>
      <Button 
        fullWidth 
        variant="contained" 
        color="primary" 
        sx={{ py: 1, px: 5, borderRadius: 2 }} 
        loadingPosition="end" 
        loading={loadingSubmit}
        onClick={onSubmit}
      >
        <Typography variant="subtitle2">{tAuth('forgotPasswordCTA')}</Typography>
      </Button>
    </Stack>
  );
}

export default ForgotPassword;