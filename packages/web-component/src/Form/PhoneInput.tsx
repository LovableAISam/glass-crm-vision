import { MuiTelInput, MuiTelInputInfo } from 'mui-tel-input';
import { TextFieldProps } from '@mui/material';
import React from 'react';

type PasswordInputProps = TextFieldProps & {
  value: string;
  onChange?: ((newValue: string, info: MuiTelInputInfo) => void) | undefined;
  error: boolean;
  helperText?: React.ReactNode;
  textFieldProps?: {};
};

const PhoneInput = React.forwardRef((props: PasswordInputProps, ref: any) => {
  const { value, onChange, error, helperText, textFieldProps } = props;

  return (
    <MuiTelInput
      ref={ref}
      value={value}
      error={error}
      forceCallingCode
      helperText={helperText}
      {...textFieldProps}
      onChange={onChange}
      fullWidth
      defaultCountry="PH"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
        },
      }}
    />
  );
});

export default PhoneInput;
