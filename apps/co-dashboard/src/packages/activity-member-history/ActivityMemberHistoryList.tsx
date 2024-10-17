// Cores
import React, { useMemo, useState } from 'react';

// Components
import {
  Typography,
  Stack,
  Card,
  TextField,
  Autocomplete,
  Pagination,
  Grid,
  FormControlLabel,
  Checkbox,
  Chip,
} from '@mui/material';
import {
  Token,
  Datatable,
  Button,
  FormDatePicker,
  LoadingPage,
  EmptyList,
  renderOptionCheckbox,
} from '@woi/web-component';

// Hooks & Utils
import useActivityMemberHistoryList from './hooks/useActivityMemberHistoryList';
import { batch, DateConvert } from '@woi/core';
import { useTranslation } from 'react-i18next';
import { fileFormats } from '@woi/service/co/transaction/transactionHistory/memberTransactionHistoryExport';
import {
  calculateDateRangeDays,
  stringToDateFormat,
} from '@woi/core/utils/date/dateConvert';
import { useController } from 'react-hook-form';

// Types & Consts
import { Column } from 'react-table';
import { MemberActivityData } from '@woi/service/co/admin/report/memberActivityList';
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';

// Icons
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';

const ActivityMemberHistoryList = () => {
  const { t: tCommon } = useTranslation('common');
  const { t: tActivityMember } = useTranslation('activityMember');
  const { t: tForm } = useTranslation('form');
  const { t: tReport } = useTranslation('report');

  const [formatOption, setFormatOption] = useState<string>('PDF');

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormatOption(event.target.name);
  };

  const {
    activityTypeOptions,
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    handleExport,
    memberActivityData,
    memberActivityStatus,
    formData,
    handleDeleteFilter,
  } = useActivityMemberHistoryList({ formatOption });

  const {
    formState: { errors },
    control,
    clearErrors,
  } = formData;

  const { field: fieldEffectiveDate } = useController({
    name: 'effectiveDate',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'effective date' }),
      validate: value => {
        const { startDate, endDate } = value;
        const isLongRange = calculateDateRangeDays(startDate, endDate) > 730;
        if (value.startDate === null || value.endDate === null) {
          return tCommon('errorDatePickerGeneral');
        }
        if (isLongRange) {
          return tCommon('errorDatePickerGreater');
        }
      },
    },
  });

  const columns: Array<Column<MemberActivityData>> = useMemo(
    () => [
      {
        Header: tActivityMember('tableHeaderCreatedDate'),
        accessor: 'createdDate',
        Cell: ({ row }) => (
          <Typography variant="inherit" key="createdDate">
            {DateConvert.stringToDateFormat(
              row.original.createdDate,
              LONG_DATE_TIME_FORMAT,
            )}
          </Typography>
        ),
      },
      {
        Header: tActivityMember('tableHeaderRefID'),
        accessor: 'referenceId',
      },
      {
        Header: tActivityMember('tableHeaderAccountNumber'),
        accessor: 'account',
        Cell: ({ row }) => {
          if (row.original.account) {
            return (
              <Typography variant="inherit">{row.original.account}</Typography>
            );
          }
          return <></>;
        },
      },
      {
        Header: tActivityMember('tableHeaderType'),
        accessor: 'type',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="type">
            {value || '-'}
          </Typography>
        ),
      },
      {
        Header: tActivityMember('tableHeaderDescription'),
        accessor: 'description',
      },
    ],
    [],
  );

  const renderFilter = () => {
    return Object.entries(filterForm).map(([key, value]) => {
      switch (key as keyof typeof filterForm) {
        case 'account': {
          const filterValue = value as string;
          if (!filterValue) return null;
          return (
            <Chip
              variant="outlined"
              label={`${key}: ${filterValue}`}
              color="primary"
              deleteIcon={<CloseIcon />}
              onDelete={() => handleDeleteFilter(key, '')}
              sx={{
                '& .MuiChip-label': {
                  textTransform: 'uppercase',
                },
              }}
            />
          );
        }
        case 'activityType': {
          const filterValue = value as typeof activityTypeOptions;
          if (filterValue.length === 0) return null;
          return (
            <Chip
              variant="outlined"
              label={`${key}: ${filterValue
                .map(filter => filter.label)
                .join(', ')}`}
              color="primary"
              deleteIcon={<CloseIcon />}
              onDelete={() => handleDeleteFilter(key, [])}
              sx={{
                '& .MuiChip-label': {
                  textTransform: 'uppercase',
                },
              }}
            />
          );
        }
        case 'transactionDate': {
          const filterValue = value as typeof filterForm.transactionDate;
          if (!filterValue.startDate || !filterValue.endDate) return null;
          return (
            <Chip
              variant="outlined"
              label={`${key}: ${stringToDateFormat(
                filterValue.startDate,
              )} - ${stringToDateFormat(filterValue.endDate)}`}
              color="primary"
              deleteIcon={<CloseIcon />}
              onDelete={() => handleDeleteFilter(key, [])}
              sx={{
                '& .MuiChip-label': {
                  textTransform: 'uppercase',
                },
              }}
            />
          );
        }
      }
    });
  };

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">{tActivityMember('pageTitle')}</Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tActivityMember('filterAccount')}
                </Typography>
                <TextField
                  value={filterForm.account}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        account: e.target.value,
                      }));
                    });
                  }}
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', {
                    fieldName: 'account',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  size="small"
                />
              </Stack>
            </Grid>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tActivityMember('filterType')}
                </Typography>
                <Autocomplete
                  value={activityTypeOptions.filter(data =>
                    filterForm.activityType.some(
                      filter => filter.value === data.value,
                    ),
                  )}
                  onChange={(_, value) => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        activityType: value,
                      }));
                    });
                  }}
                  options={activityTypeOptions}
                  size="small"
                  fullWidth
                  multiple
                  limitTags={1}
                  disableCloseOnSelect
                  getOptionLabel={option => option.label}
                  renderOption={renderOptionCheckbox}
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderType', {
                        fieldName: 'type',
                      })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                    />
                  )}
                />
              </Stack>
            </Grid>
            <Grid item xl={4} md={6} xs={12}>
              <FormDatePicker
                {...fieldEffectiveDate}
                title={tReport('filterDate')}
                onChange={value => {
                  const isLongRange =
                    calculateDateRangeDays(value.startDate, value.endDate) >
                    730;
                  batch(() => {
                    if (!isLongRange) {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        transactionDate: value,
                      }));
                      fieldEffectiveDate.onChange(value);
                    }
                  });
                }}
                size="small"
                placeholder={tForm('placeholderSelect', {
                  fieldName: tReport('typeDate'),
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
                error={Boolean(errors.effectiveDate)}
                helperText={errors.effectiveDate?.message}
                onFocus={() => clearErrors()}
              />
            </Grid>
          </Grid>
        </Card>
        {/* <Stack direction="row" justifyContent="flex-end" alignItems="center">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<DownloadIcon />}
            sx={{ borderRadius: 2 }}
            onClick={handleExport}
          >
            {tActivityMember('actionDownloadAllData')}
          </Button>
        </Stack> */}
        <Stack direction="row" spacing={2}>
          {renderFilter()}
        </Stack>
        {memberActivityStatus === 'loading' && <LoadingPage />}
        {memberActivityStatus === 'success' &&
          memberActivityData.length === 0 && (
            <EmptyList
              title={tCommon('tableEmptyNotFound')}
              description=""
              grayscale
            />
          )}
        {memberActivityStatus === 'success' && memberActivityData.length > 0 && (
          <React.Fragment>
            <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
              <Stack direction="column" spacing={2}>
                <Datatable
                  columns={columns as Column<object>[]}
                  data={memberActivityData}
                  sortBy={sortBy}
                  direction={direction}
                  onSort={handleSort}
                  hideHeaderSort={['action', 'description']}
                />
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="caption"
                    color={Token.color.greyscaleGreyDarkest}
                  >
                    {tCommon('paginationTitle', {
                      totalShowing: memberActivityData.length,
                      totalData: pagination.totalElements,
                    })}
                  </Typography>
                  <Pagination
                    color="primary"
                    page={pagination.currentPage + 1}
                    count={pagination.totalPages}
                    onChange={(_, page) =>
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: page - 1,
                      }))
                    }
                  />
                </Stack>
              </Stack>
            </Card>
            <Stack mt={4}>
              {errors.effectiveDate && (
                <Typography
                  variant="caption"
                  textAlign="end"
                  sx={{ mt: '0px !important' }}
                  color={errors.effectiveDate ? Token.color.redDark : 'initial'}
                >
                  {errors.effectiveDate?.message}
                </Typography>
              )}
              <Stack
                direction="row"
                spacing={3}
                justifyContent="flex-end"
                alignItems="center"
              >
                {/** @ts-ignore */}
                <Typography variant="subtitle3">
                  {tCommon('exportAs')}
                </Typography>
                {fileFormats.map(option => (
                  <Grid key={option.name}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={option.name}
                          checked={formatOption === option.name}
                          onChange={handleCheckboxChange}
                        />
                      }
                      label={
                        <Typography variant="button">{option.label}</Typography>
                      }
                    />
                  </Grid>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  sx={{ borderRadius: 2 }}
                  onClick={handleExport}
                >
                  {tCommon('actionDownload')}
                </Button>
              </Stack>
            </Stack>
          </React.Fragment>
        )}
      </Stack>
    </Stack>
  );
};

export default ActivityMemberHistoryList;
