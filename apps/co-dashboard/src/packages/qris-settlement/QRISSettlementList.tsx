// Cores
import { useMemo } from 'react';

// Components
import {
  Autocomplete,
  Card,
  Chip,
  Grid,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
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
import useModal from '@woi/common/hooks/useModal';
import { batch, DateConvert } from '@woi/core';
import {
  calculateDateRangeDays,
  stringToDateFormat,
} from '@woi/core/utils/date/dateConvert';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import useQRISSettlementList from './hooks/useQRISSettlementList';

// Types & Consts
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';
import { OptionMap } from '@woi/option';
import { QRISSettlement } from '@woi/service/co/admin/report/qrisSettlement';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';

const QRISSettlementList = () => {
  const router = useRouter();

  const {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    qrisSettlementData,
    qrisSettlementStatus,
    merchantListOptions,
    handleExport,
    formData,
    isLoadingDownload,
    merchantCategoryCodeListOptions,
    statusOptions,
    // handleExportDetail,
  } = useQRISSettlementList();
  const [showModal] = useModal();
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

  const columns: Array<Column<QRISSettlement & { action: string }>> = useMemo(
    () => [
      {
        Header: tReport('tableHeaderDate'),
        accessor: 'date',
        Cell: ({ value }) => (
          <Typography data-testid="dateTime" variant="inherit" key="dateTime">
            {DateConvert.stringToDateFormat(value, LONG_DATE_TIME_FORMAT)}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderMerchant'),
        accessor: 'merchantShortName',
      },
      {
        Header: tReport('tableHeaderBalance'),
        accessor: 'grossTotalTransaction',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tReport('tableHeaderMcc'),
        accessor: 'mcc',
      },
      {
        Header: tReport('tableHeaderMdr'),
        accessor: 'mdrPercentage',
      },
      {
        Header: tReport('tableHeaderMdrAmount'),
        accessor: 'mdrAmount',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tReport('tableHeaderFeeAcquiringPercen'),
        accessor: 'feeAcquiringPercentage',
      },
      {
        Header: tReport('tableHeaderFeeAcquiringAmount'),
        accessor: 'feeAcquiringAmount',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tReport('tableHeaderFeeIssuingPercen'),
        accessor: 'feeIssuerPercentage',
      },
      {
        Header: tReport('tableHeaderFeeIssuingAmount'),
        accessor: 'feeIssuerAmount',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tReport('tableHeaderWOIFeeAsCO'),
        accessor: 'coFeeTotal',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tReport('tableHeaderBalanceNet'),
        accessor: 'nettMerchantBalance',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tReport('tableHeaderStatus'),
        accessor: 'status',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="currency">
            {value || '-'}
          </Typography>
        ),
      },
      // {
      //   Header: tCommon('tableHeaderAction'),
      //   accessor: 'action',
      //   Cell: ({row}) => (
      //     <Button
      //       variant="text"
      //       size="small"
      //       onClick={() => handleExportDetail(row.original.qrisSettlementId)}
      //     >
      //       {tCommon('tableActionDetail')}
      //     </Button>
      //   ),
      // },
    ],
    [showModal],
  );

  const handleDeleteFilter = (key: string, value: any) => {
    batch(() => {
      setPagination(oldPagination => ({
        ...oldPagination,
        currentPage: 0,
      }));
      setFilterForm(oldForm => ({
        ...oldForm,
        [key]: value,
      }));
    });
  };

  const renderFilter = () => {
    return Object.entries(filterForm).map(([key, value]) => {
      switch (key as keyof typeof filterForm) {
        case 'merchant': {
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
        case 'activeDate': {
          const filterValue = value as typeof filterForm.activeDate;
          if (!filterValue.startDate || !filterValue.endDate) return null;
          return (
            <Chip
              variant="outlined"
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
        case 'status':
        case 'mcc': {
          const filterValue = value as typeof merchantListOptions;
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
            {tReport('pageTitleQRISSettlement')}
          </Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={4} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tReport('filterMerchant')}
                </Typography>
                <TextField
                  value={filterForm.merchant}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        merchant: e.target.value,
                      }));
                    });
                  }}
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', {
                    fieldName: 'merchant name',
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
            <Grid item xl={4} md={4} xs={12}>
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
                        activeDate: value,
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
            <Grid item xl={4} md={4} xs={12}>
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
                        fieldName: 'status',
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
            <Grid item xl={4} md={4} xs={12} display='none'>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tReport('filterMcc')}
                </Typography>
                <Autocomplete
                  value={merchantCategoryCodeListOptions.filter(data =>
                    filterForm.mcc.some(filter => filter.value === data.value),
                  )}
                  onChange={(_, value) => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        mcc: value as OptionMap<string>[],
                      }));
                    });
                  }}
                  options={merchantCategoryCodeListOptions}
                  fullWidth
                  size="small"
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'mcc',
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

        {qrisSettlementStatus === 'loading' && <LoadingPage />}

        {qrisSettlementStatus === 'success' &&
          qrisSettlementData.length === 0 && (
            <EmptyList
              title={tCommon('tableEmptyTitle')}
              description={tCommon('tableEmptyDescriptionFiltered')}
              grayscale
            />
          )}

        {qrisSettlementStatus === 'success' && qrisSettlementData.length > 0 && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={qrisSettlementData}
                sortBy={sortBy}
                direction={direction}
                onSort={handleSort}
                hideHeaderSort={['action']}
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
                    totalShowing: qrisSettlementData.length,
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

export default QRISSettlementList;
