import React, { useState } from 'react';

import { Stack, Popover, Typography, Card, Box, TextField, InputAdornment, TextFieldProps } from '@mui/material';
import { HexColorPicker } from "react-colorful";
import { Button } from '@woi/web-component';
import PaletteIcon from '@mui/icons-material/Palette';

type FormColorProps = Omit<TextFieldProps, 'onChange'> & {
  title?: string;
  value: string;
  onChange: (value: string) => void;
}

const FormColor = React.forwardRef((props: FormColorProps, ref: any) => {
  const { title, value, onChange, ...textFieldProps } = props;
  const [colorTemp, setColorTemp] = useState<string>(value);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setColorTemp(value);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChoose = () => {
    onChange(colorTemp);
    handleClose();
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Stack direction="column" spacing={1}>
      {title && <Typography variant="subtitle2">{title}</Typography>}
      <TextField 
        ref={ref}
        {...textFieldProps}
        value={value}
        onClick={handleClick}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Box sx={{ background: value, width: 20, height: 20, borderRadius: 1.5 }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <PaletteIcon />
            </InputAdornment>
          )
        }}
      />
      <Popover 
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{ 
          '& .MuiPopover-paper': {
            borderRadius: 3
          }
        }}
      >
        <Stack direction="column" spacing={2} sx={{ p: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Card variant="outlined" sx={{ p: 0.3, borderRadius: 1.5 }} >
              <Box sx={{ background: colorTemp, width: 20, height: 20, borderRadius: 1.5 }} />
            </Card>
            <Typography variant="body2">Hex</Typography>
            <Card variant="outlined" sx={{ p: 2, py: 1.5, borderRadius: 3, flex: 1 }}>
              <Typography variant="body2" sx={{ textTransform: 'uppercase' }}>{value}</Typography>
            </Card>
          </Stack>
          <HexColorPicker color={colorTemp} onChange={setColorTemp} style={{ width: 300 }} />
          <Stack direction="row" spacing={2}>
            <Button color="primary" variant="outlined" sx={{ px: 2, py: 1, flex: 1, borderRadius: 2 }} onClick={handleClose}>
              Cancel
            </Button>
            <Button color="primary" variant="contained" sx={{ px: 2, py: 1, flex: 1, borderRadius: 2 }} onClick={handleChoose}>
              Choose
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </Stack>
  )
})

export default FormColor;