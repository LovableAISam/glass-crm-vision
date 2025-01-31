import { MuiOtpInput } from 'mui-one-time-password-input';
import { TextFieldProps } from '@mui/material';
import React from 'react';

type PasswordInputProps = TextFieldProps & {
  value: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
};

const OTPInput = React.forwardRef((props: PasswordInputProps, ref) => {
  const { value, onChange, onComplete } = props;

  return (
    // @ts-ignore
    <MuiOtpInput
      ref={ref}
      length={6}
      onComplete={onComplete}
      value={value}
      onChange={onChange}
    />
  );
});

export default OTPInput;
