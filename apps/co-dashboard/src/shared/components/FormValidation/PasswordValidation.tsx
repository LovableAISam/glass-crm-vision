// Core
import React, { useMemo } from 'react';

// Components
import {
  Typography,
  Stack,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import { Token } from '@woi/web-component';
import { TextValidation } from '@woi/core';

type Props = {
  password: string;
  passwordConfirm: string;
}

export function usePasswordValidation(form: Props) {
  const validatePassword = useMemo(() => {
    return {
      min8Char: TextValidation.minChar(form.password, 8),
      hasUppercase: TextValidation.containsUppercase(form.password),
      hasSymbol: TextValidation.containsSpecialChars(form.password),
      hasNumber: TextValidation.containsNumber(form.password),
    }
  }, [form.password])

  const validationPasswordConfirm = useMemo(() => {
    return form.password !== form.passwordConfirm;
  }, [form])

  return {
    validatePassword,
    validationPasswordConfirm
  }
}

function PasswordValidation(props: ReturnType<typeof usePasswordValidation>) {
  const { validatePassword } = props;

  return (
    <Stack direction="column" spacing={1} sx={{ pb: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <CheckIcon 
          sx={{ color: validatePassword.min8Char ? Token.color.greenDark : Token.color.greyscaleGreyDarkest }} 
        />
        <Typography 
          variant={validatePassword.min8Char ? "subtitle2" : "body2"} 
          sx={{ color: validatePassword.min8Char ? Token.color.primaryBlack : Token.color.greyscaleGreyDarkest }}
        >
          Min. 8 characters.
        </Typography>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <CheckIcon 
          sx={{ color: validatePassword.hasUppercase ? Token.color.greenDark : Token.color.greyscaleGreyDarkest }} 
        />
        <Typography 
          variant={validatePassword.hasUppercase ? "subtitle2" : "body2"} 
          sx={{ color: validatePassword.hasUppercase ? Token.color.primaryBlack : Token.color.greyscaleGreyDarkest }}
        >
          At least 1 uppercase letter.
        </Typography>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <CheckIcon 
          sx={{ color: validatePassword.hasSymbol ? Token.color.greenDark : Token.color.greyscaleGreyDarkest }} 
        />
        <Typography 
          variant={validatePassword.hasSymbol ? "subtitle2" : "body2"} 
          sx={{ color: validatePassword.hasSymbol ? Token.color.primaryBlack : Token.color.greyscaleGreyDarkest }}
        >
          At least 1 symbols.
        </Typography>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <CheckIcon 
          sx={{ color: validatePassword.hasNumber ? Token.color.greenDark : Token.color.greyscaleGreyDarkest }} 
        />
        <Typography 
          variant={validatePassword.hasNumber ? "subtitle2" : "body2"} 
          sx={{ color: validatePassword.hasNumber ? Token.color.primaryBlack : Token.color.greyscaleGreyDarkest }}
        >
          At least 1 number.
        </Typography>
      </Stack>
    </Stack>
  )
}

export default PasswordValidation;