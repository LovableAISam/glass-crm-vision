// Cores
import React, { useMemo, useState } from 'react';

// Components
import {
  Autocomplete,
  Card,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { OptionMap } from '@woi/option';
import {
  Button,
  Datatable,
  EmptyList,
  FormDatePicker,
  LoadingPage,
  PriceCell,
  renderOptionCheckbox,
  Token,
} from '@woi/web-component';
import { useRouter } from 'next/router';
import { Column } from 'react-table';

// Hooks & Utils
import { batch, DateConvert, fileFormats } from '@woi/core';
import { useTranslation } from 'react-i18next';
import useDirectDebitSettlementList from './hooks/useDirectDebitSettlementList';
import { useController } from 'react-hook-form';

// Types & Consts
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';
import {
  calculateDateRangeDays,
  stringToDateFormat,
} from '@woi/core/utils/date/dateConvert';
import { DirectDebitSettlement } from "@woi/service/co/admin/report/directDebitSettlement";

// Icons
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';

const DirectDebitSettlementList = () => {
  const router = useRouter();

  const [formatOption, setFormatOption] = useState<string>('PDF');

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormatOption(event.target.name);
  };

  const {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    qrisReportData,
    qrisReportStatus,
    statusOptions,
    handleDeleteFilter,
    isLoadingDownload,
    formData,
    handleExport,
  } = useDirectDebitSettlementList({ formatOption });
  const { t: tCommon } = useTranslation('common');
  const { t: tReport } = useTranslation('report');
  const { t: tForm } = useTranslation('form');

  const {
    formState: { errors },
    control,
    clearErrors,
    trigger,
    setValue,
    reset,
  } = formData;

  const { field: fieldEffectiveDate } = useController({
    name: 'effectiveDate',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'effective date' }),
      validate: value => {
        setPagination(oldPagination => ({
          ...oldPagination,
          currentPage: 0,
        }));
        if (value.startDate === null || value.endDate === null) {
          return tCommon('errorDatePickerGeneral');
        }
        if (calculateDateRangeDays(value.startDate, value.endDate) > 730) {
          return tCommon('errorDatePickerGreater');
        }
      },
    },
  });

  const columns: Array<Column<DirectDebitSettlement & { action: string; }>> = useMemo(
    () => [
      {
        Header: tReport('tableHeaderDate'),
        accessor: 'date',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="date">
            {value
              ? DateConvert.stringToDateFormat(value, LONG_DATE_TIME_FORMAT)
              : '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderMerchantName'),
        accessor: 'merchantName',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="merchantName">
            {value || '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderBalanceGross'),
        accessor: 'grossTotalTransaction',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="grossTotalTransaction">
            {value || '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderCoFee'),
        accessor: 'coFeeTotal',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="coFeeTotal">
            {value || '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderFeeChargedMember'),
        accessor: 'feeChargedMember',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="feeChargedMember">
            {value || '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderFeeChargedMerchant'),
        accessor: 'feeChargedMerchant',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="feeChargedMerchant">
            {value || '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderBalanceNett'),
        accessor: 'nettMerchantBalance',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tReport('tableHeaderStatus'),
        accessor: 'status',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="status">
            {value || '-'}
          </Typography>
        ),
      },
    ],
    [],
  );

  const renderFilter = () => {
    return Object.entries(filterForm).map(([key, value]) => {
      switch (key as keyof typeof filterForm) {
        case 'endAt': {
          const filterValue = value as typeof filterForm.endAt;
          if (!filterValue.startDate || !filterValue.endDate) return null;
          return (
            <Chip
              variant="outlined"
              key={key}
              label={`${key}: ${stringToDateFormat(
                filterValue.startDate,
              )} - ${stringToDateFormat(filterValue.endDate)}`}
              color="primary"
              deleteIcon={<CloseIcon />}
              onDelete={() => {
                reset();
                handleDeleteFilter(key, []);
              }}
              sx={{
                '& .MuiChip-label': {
                  textTransform: 'uppercase',
                },
              }}
            />
          );
        }
        case 'merchantName': {
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
        case 'status': {
          const filterValue = value as typeof statusOptions;
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
          <Typography variant="h4">
            {tReport('pageTitleDirectDebitSettlement')}
          </Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <FormDatePicker
                {...fieldEffectiveDate}
                title={tForm('dateFieldLabel')}
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
                        endAt: value,
                      }));
                      fieldEffectiveDate.onChange(value);
                    } else {
                      setValue('effectiveDate', value);
                      trigger('effectiveDate');
                    }
                  });
                }}
                size="small"
                placeholder={tForm('placeholderSelect', {
                  fieldName: tForm('dateFieldType'),
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

            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tReport('filterMerchantName')}
                </Typography>
                <TextField
                  value={filterForm.merchantName}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        merchantName: e.target.value,
                      }));
                    });
                  }}
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', {
                    fieldName: tReport('filterMerchantName'),
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
                  {tReport('filterStatus')}
                </Typography>
                <Autocomplete
                  value={statusOptions.filter(data =>
                    filterForm.status.some(
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
                        status: value as OptionMap<string>[],
                      }));
                    });
                  }}
                  options={statusOptions}
                  fullWidth
                  size="small"
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'Status',
                      })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                    />
                  )}
                  multiple
                  limitTags={1}
                  disableCloseOnSelect
                  getOptionLabel={option => option.label}
                  renderOption={renderOptionCheckbox}
                />
              </Stack>
            </Grid>
          </Grid>
        </Card>

        <Stack direction="row" spacing={2}>
          {renderFilter()}
        </Stack>

        {qrisReportStatus === 'loading' && <LoadingPage />}

        {qrisReportStatus === 'success' && qrisReportData.length === 0 && (
          <EmptyList
            title={tCommon('tableEmptyTitle')}
            description={tCommon('tableEmptyDescription', {
              text: 'CO Transaction Summary',
            })}
            grayscale
          />
        )}

        {qrisReportStatus === 'success' && qrisReportData.length > 0 && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={qrisReportData}
                sortBy={sortBy}
                direction={direction}
                onSort={handleSort}
                hideHeaderSort={[
                  'action',
                  'grossTotalTransaction',
                  'coFeeTotal',
                  'feeChargedMember',
                  'feeChargedMerchant',
                  'nettMerchantBalance'
                ]}
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
                    totalShowing: qrisReportData.length,
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
            <Stack>
              <Stack
                direction="row"
                spacing={3}
                mt={4}
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
                  disabled={isLoadingDownload}
                  loading={isLoadingDownload}
                  loadingPosition="start"
                >
                  {tCommon('actionDownload')}
                </Button>
              </Stack>
              <Typography
                variant="caption"
                textAlign="end"
                sx={{ mt: '0px !important' }}
                color={errors.effectiveDate ? Token.color.redDark : 'initial'}
              >
                {errors.effectiveDate
                  ? errors.effectiveDate?.message
                  : tCommon('labelMaxDownload')}
              </Typography>
            </Stack>
          </Card>
        )}
      </Stack>
    </Stack>
  );
};

export default DirectDebitSettlementList;
