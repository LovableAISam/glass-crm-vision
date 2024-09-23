import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material';
import React from 'react';

type PasswordInputProps = TextFieldProps & {
  showPassword?: boolean;
};

const PasswordInput = React.forwardRef(
  (props: PasswordInputProps, ref: any) => {
    const { showPassword: _showPassword, ...textFieldProps } = props;
    const [showPassword, setShowPassword] = React.useState<boolean>(
      _showPassword || false,
    );

    const handleMouseDownPassword = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      event.preventDefault();
    };

    return (
      <TextField
        ref={ref}
        {...textFieldProps}
        type={showPassword ? 'text' : 'password'}
        role="form"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    );
  },
);

export default PasswordInput;
