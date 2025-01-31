import React, { useEffect, useMemo, useState } from 'react';

import {
  Stack,
  Popover,
  Typography,
  TextField,
  TextFieldProps,
  InputAdornment,
  Grid,
  Radio,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  Divider,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { Button } from '@woi/web-component';
import EventIcon from '@mui/icons-material/Event';
import { OptionMap } from '@woi/option';
import { DateRange, DateRangeProps } from 'react-date-range';
import { css } from '@emotion/css';
import { addDays } from 'date-fns';
import DateConvert from '@woi/core/utils/date/dateConvert';
import { LONG_DATE_FORMAT } from '@woi/core/utils/date/constants';
import { DatePeriod } from '@woi/core/utils/date/types';
import ClearIcon from '@mui/icons-material/Clear';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

type DateType =
  | 'SPECIFIC_DATE'
  | 'LAST_7_DAYS'
  | 'LAST_30_DAYS'
  | 'LAST_90_DAYS'
  | '7_DAYS'
  | '30_DAYS'
  | '90_DAYS';

type FormDatePickerProps = Omit<TextFieldProps, 'onChange' | 'value'> & {
  title?: string;
  value?: DatePeriod;
  onChange?: (value: DatePeriod) => void;
  dateRangeProps?: DateRangeProps;
  upcomingDate?: boolean;
  noShortcuts?: boolean;
};

const initialDateData: DatePeriod = {
  startDate: null,
  endDate: null,
};

const FormDatePicker = React.forwardRef(
  (props: FormDatePickerProps, ref: any) => {
    const {
      title,
      upcomingDate = false,
      noShortcuts = false,
      value,
      onChange,
      dateRangeProps = {},
      ...textFieldProps
    } = props;
    const [dateType, setDateType] = useState<DateType>('SPECIFIC_DATE');
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
    let dateTypeLists: OptionMap<DateType>[] = [];

    if (noShortcuts) {
      dateTypeLists = [
        { label: 'Choose Specific Date', value: 'SPECIFIC_DATE' },
      ];
    } else {
      if (upcomingDate) {
        dateTypeLists = [
          { label: 'Choose Specific Date', value: 'SPECIFIC_DATE' },
          { label: '7 Days', value: '7_DAYS' },
          { label: '30 Days', value: '30_DAYS' },
          { label: '90 Days', value: '90_DAYS' },
        ];
      } else {
        dateTypeLists = [
          { label: 'Choose Specific Date', value: 'SPECIFIC_DATE' },
          { label: 'Last 7 Days', value: 'LAST_7_DAYS' },
          { label: 'Last 30 Days', value: 'LAST_30_DAYS' },
          { label: 'Last 90 Days', value: 'LAST_90_DAYS' },
        ];
      }
    }
    const theme = useTheme();
    const [selectedDateTemp, setSelectedDateTemp] = useState<DatePeriod>(
      value || initialDateData,
    );
    const [selectedDate, setSelectedDate] = useState<DatePeriod>(
      value || initialDateData,
    );
    const showHorizontal = useMediaQuery(theme.breakpoints.up('sm'));
    const isNotEmpty =
      selectedDate.startDate !== null && selectedDate.endDate !== null;

    useEffect(() => {
      if (value) {
        setSelectedDate(value);
      }
    }, [value]);

    const handleChangeDateType = (dateType: DateType) => {
      let startDate = new Date();
      let endDate = new Date();
      if (dateType === 'LAST_7_DAYS') {
        startDate = addDays(new Date(), -6);
      } else if (dateType === 'LAST_30_DAYS') {
        startDate = addDays(new Date(), -29);
      } else if (dateType === 'LAST_90_DAYS') {
        startDate = addDays(new Date(), -89);
      } else if (dateType === '7_DAYS') {
        endDate = addDays(new Date(), +7);
      } else if (dateType === '30_DAYS') {
        endDate = addDays(new Date(), +30);
      } else if (dateType === '90_DAYS') {
        endDate = addDays(new Date(), +90);
      }
      setDateType(dateType);
      if (upcomingDate) {
        setSelectedDateTemp(oldForm => ({
          ...oldForm,
          startDate: new Date(),
          endDate,
        }));
      } else {
        setSelectedDateTemp(oldForm => ({
          ...oldForm,
          startDate,
          endDate: new Date(),
        }));
      }
    };

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      setSelectedDateTemp(selectedDate);
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setSelectedDateTemp(selectedDate);
      setAnchorEl(null);
    };

    const handleReset = () => {
      setSelectedDateTemp(initialDateData);
    };

    const handleChoose = () => {
      setSelectedDate(selectedDateTemp);
      onChange?.(selectedDateTemp);
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const dateText = useMemo(() => {
      const { startDate, endDate } = selectedDate;
      return `${DateConvert.stringToDateFormat(
        startDate,
        LONG_DATE_FORMAT,
      )} - ${DateConvert.stringToDateFormat(endDate, LONG_DATE_FORMAT)}`;
    }, [selectedDate]);

    return (
      <Stack direction="column" spacing={1}>
        {title && <Typography variant="subtitle2">{title}</Typography>}
        <TextField
          ref={ref}
          {...textFieldProps}
          inputProps={{ 'data-testid': 'filterDateRange' }}
          value={selectedDate.startDate && selectedDate.endDate ? dateText : ''}
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
            <Grid item md={4} xs={12}>
              <List sx={{ width: '100%' }}>
                {dateTypeLists.map((dateTypeData, index) => {
                  const selectedList = dateTypeData.value === dateType;
                  return (
                    <React.Fragment key={index}>
                      <ListItem key={index} disablePadding>
                        <ListItemButton
                          role={'radio'}
                          onClick={() =>
                            handleChangeDateType(dateTypeData.value)
                          }
                        >
                          <ListItemText
                            primary={
                              <Typography
                                variant={selectedList ? 'subtitle2' : 'body2'}
                                color={
                                  selectedList
                                    ? theme.palette.primary.main
                                    : theme.palette.text.primary
                                }
                              >
                                {dateTypeData.label}
                              </Typography>
                            }
                          />
                          <Radio
                            edge="start"
                            checked={selectedList}
                            tabIndex={-1}
                            disableRipple
                          />
                        </ListItemButton>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  );
                })}
              </List>
            </Grid>
            <Grid item md={8} xs={12}>
              {/* @ts-ignore */}
              <DateRange
                {...dateRangeProps}
                onChange={item => {
                  const { startDate, endDate } = item.selection;
                  if (startDate && endDate) {
                    setSelectedDateTemp(oldForm => ({
                      ...oldForm,
                      startDate,
                      endDate,
                    }));
                  }
                }}
                moveRangeOnFirstSelection={false}
                showDateDisplay={false}
                ranges={[
                  {
                    startDate: selectedDateTemp.startDate || new Date(),
                    endDate: selectedDateTemp.endDate || new Date(),
                    key: 'selection',
                  },
                ]}
                months={2}
                direction={showHorizontal ? 'horizontal' : 'vertical'}
                color={theme.palette.primary.main}
                className={css`
                  width: 100%;
                `}
                minDate={upcomingDate ? new Date() : undefined}
              />
              <Stack direction="column" alignItems="flex-end">
                <Stack direction="row" spacing={2}>
                  <Button
                    color="primary"
                    variant="outlined"
                    sx={{ px: 5, py: 1, borderRadius: 2 }}
                    onClick={handleReset}
                  >
                    Reset Date
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{ px: 5, py: 1, borderRadius: 2 }}
                    onClick={handleChoose}
                    data-testid="buttonConfirm"
                  >
                    Confirm
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Popover>
      </Stack>
    );
  },
);

export default FormDatePicker;
