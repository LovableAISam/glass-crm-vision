import React, { useEffect, useMemo, useState } from 'react';
import {
  Stack,
  Popover,
  Typography,
  TextField,
  TextFieldProps,
  InputAdornment,
  Grid,
  useTheme,
  IconButton,
} from '@mui/material';
import { Button } from '@woi/web-component';
import EventIcon from '@mui/icons-material/Event';
import DateConvert from '@woi/core/utils/date/dateConvert';
import { LONG_DATE_FORMAT } from '@woi/core/utils/date/constants';
import ClearIcon from '@mui/icons-material/Clear';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

type FormSingleDatePickerProps = Omit<TextFieldProps, 'onChange' | 'value'> & {
  title?: string;
  value?: Date | null;
  onChange?: (value: Date | null) => void;
};

const initialDateData: Date | null = null;

const FormSingleDatePicker = React.forwardRef(
  (props: FormSingleDatePickerProps, ref: any) => {
    const { title, value, onChange, ...textFieldProps } = props;
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
    const theme = useTheme();
    const [selectedDateTemp, setSelectedDateTemp] = useState<Date | null>(
      value || initialDateData,
    );
    const [selectedDate, setSelectedDate] = useState<Date | null>(
      value || initialDateData,
    );
    const isNotEmpty = selectedDate !== null;

    useEffect(() => {
      if (value) {
        setSelectedDate(value);
      }
    }, [value]);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      setSelectedDateTemp(selectedDate);
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setSelectedDateTemp(selectedDate);
      setAnchorEl(null);
    };

    const handleChoose = () => {
      setSelectedDate(selectedDateTemp);
      onChange?.(selectedDateTemp);
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const dateText = useMemo(() => {
      return `${DateConvert.stringToDateFormat(
        selectedDate,
        LONG_DATE_FORMAT,
      )}`;
    }, [selectedDate]);

    return (
      <Stack direction="column" spacing={1}>
        {title && <Typography variant="subtitle2">{title}</Typography>}
        <TextField
          ref={ref}
          {...textFieldProps}
          value={selectedDate ? dateText : ''}
          onClick={textFieldProps.disabled ? undefined : handleClick}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EventIcon />
              </InputAdornment>
            ),
            endAdornment:
              !isNotEmpty ? undefined : textFieldProps.disabled ? undefined : (
                <InputAdornment position="end">
                  <IconButton
                    onClick={event => {
                      event.stopPropagation();
                      setSelectedDate(initialDateData);
                      onChange?.(initialDateData);
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
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
              borderRadius: 3,
            },
          }}
        >
          <Grid
            container
            sx={{ p: 2, maxWidth: theme.breakpoints.values.lg }}
            spacing={2}
          >
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                  displayStaticWrapperAs="desktop"
                  value={selectedDateTemp}
                  onChange={date => {
                    setSelectedDateTemp(date);
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="standard"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
              <Stack direction="column" alignItems="flex-end">
                <Button
                  color="primary"
                  variant="contained"
                  sx={{ px: 5, py: 1, borderRadius: 2 }}
                  onClick={handleChoose}
                >
                  Confirm
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Popover>
      </Stack>
    );
  },
);

export default FormSingleDatePicker;
