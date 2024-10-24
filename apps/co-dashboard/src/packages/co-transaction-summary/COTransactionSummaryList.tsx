// Cores
import React, { useMemo, useState } from 'react';

// Components
import DownloadIcon from '@mui/icons-material/Download';
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
import ViewTransactionSummaryModal from './components/ViewTransactionSummaryModal';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import { batch, DateConvert } from '@woi/core';
import {
  calculateDateRangeDays,
  stringToDateFormat,
} from '@woi/core/utils/date/dateConvert';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import useTransactionSummaryList from './hooks/useTransactionSummaryList';

// Types & Consts
import { fileFormats } from '@woi/service/co/transaction/transactionHistory/memberTransactionHistoryExport';
import {
  TransactionSummaryData,
  TransactionType,
  UpgradeStatus,
} from '@woi/service/co/transaction/transactionSummary/transactionSummaryList';
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';

// Icons
import CloseIcon from '@mui/icons-material/Close';

const COTransactionSummaryList = () => {
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
    transactionSummaryData,
    transactionSummaryStatus,
    transactionTypeOptions,
    upgrageStatusOptions,
    handleExport,
    handleDeleteFilter,
    formData,
  } = useTransactionSummaryList({ formatOption });
  const [isActive, showModal, hideModal] = useModal();
  const { t: tCommon } = useTranslation('common');
  const { t: tReport } = useTranslation('report');
  const { t: tForm } = useTranslation('form');
  const [selectedData, setSelectedData] =
    useState<TransactionSummaryData | null>(null);

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

  const columns: Array<Column<TransactionSummaryData & { action: string }>> =
    useMemo(
      () => [
        {
          Header: tReport('tableHeaderDate'),
          accessor: 'dateTime',
          Cell: ({ value }) => (
            <Typography variant="inherit" key="dateTime">
              {DateConvert.stringToDateFormat(value, LONG_DATE_TIME_FORMAT)}
            </Typography>
          ),
        },
        {
          Header: tReport('tableHeaderTransactionType'),
          accessor: 'transactionType',
        },
        {
          Header: tReport('tableHeaderTransactionMethod'),
          accessor: 'transactionMethod',
          Cell: ({ value }) => (
            <Typography variant="inherit" key="transactionMethod">
              {value || '-'}
            </Typography>
          ),
        },
        {
          Header: tReport('tableHeaderPaymentMethod'),
          accessor: 'paymentMethod',
          Cell: ({ value }) => (
            <Typography variant="inherit" key="paymentMethod">
              {value || '-'}
            </Typography>
          ),
        },
        {
          Header: tReport('tableHeaderFrom'),
          accessor: 'senderNumber',
          Cell: ({ value }) => (
            <Typography variant="inherit" key="senderNumber">
              {value || '-'}
            </Typography>
          ),
        },
        {
          Header: tReport('tableHeaderTo'),
          accessor: 'receiverNumber',
          Cell: ({ value }) => (
            <Typography variant="inherit" key="receiverNumber">
              {value || '-'}
            </Typography>
          ),
        },
        {
          Header: tReport('tableHeaderDestinationAccountName'),
          accessor: 'destinationName',
          Cell: ({ value }) => (
            <Typography variant="inherit" key="destinationName">
              {value || '-'}
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
          Header: tReport('tableHeaderAmount'),
          accessor: 'amount',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tReport('tableHeaderFee'),
          accessor: 'feeTransaction',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tReport('tableHeaderStatus'),
          accessor: 'status',
          Cell: ({ value }) => (
            <Typography
              variant="inherit"
              key="status"
              textTransform="capitalize"
            >
              {value.toLocaleLowerCase() || '-'}
            </Typography>
          ),
        },
        {
          Header: tReport('tableHeaderReferenceNumber'),
          accessor: 'transactionNumber',
          Cell: ({ value }) => (
            <Typography variant="inherit" key="transactionNumber">
              {value || '-'}
            </Typography>
          ),
        },
        {
          Header: tReport('tableHeaderNotes'),
          accessor: 'description',
          Cell: ({ value }) => (
            <Typography variant="inherit" key="description">
              {value || '-'}
            </Typography>
          ),
        },
        {
          Header: tReport('tableHeaderBNISORC'),
          accessor: 'bnisorc',
          Cell: ({ value }) => (
            <Typography variant="inherit" key="bnisorc">
              {value || '-'}
            </Typography>
          ),
        },
        {
          Header: tReport('tableHeaderOrderID'),
          accessor: 'orderId',
          Cell: ({ value }) => (
            <Typography variant="inherit" key="orderId">
              {value || '-'}
            </Typography>
          ),
        },
        {
          Header: tReport('tableHeaderBalance'),
          accessor: 'balance',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tReport('tableHeaderSecondaryIdentifier'),
          accessor: 'secondaryIdentifier',
          Cell: ({ value, row }) => (
            <Typography variant="inherit" key="secondaryIdentifier">
              {row.original.transactionType === 'P2P_OUTGOING_SEND_TO_BANK'
                ? '-'
                : value || '-'}
            </Typography>
          ),
        },
        {
          Header: tReport('tableHeaderTraceNumber'),
          accessor: 'traceNumber',
          Cell: ({ value }) => (
            <Typography variant="inherit" key="traceNumber">
              {value || '-'}
            </Typography>
          ),
        },
        {
          Header: tReport('tableHeaderBillerFee'),
          accessor: 'billerFee',
          Cell: ({ value }) => (
            <Typography variant="inherit" key="billerFee">
              {value || '-'}
            </Typography>
          ),
        },
        {
          Header: tReport('tableHeaderTotalAmount'),
          accessor: 'totalAmount',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tReport('tableHeaderAction'),
          accessor: 'action',
          Cell: ({ row }) => (
            <Stack direction="row" spacing={2} key="userAction">
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  setSelectedData(row.original);
                  showModal();
                }}
              >
                {tReport('tableActionDetail')}
              </Button>
            </Stack>
          ),
        },
      ],
      [showModal],
    );

  const renderFilter = () => {
    return Object.entries(filterForm).map(([key, value]) => {
      switch (key as keyof typeof filterForm) {
        case 'activeDate': {
          const filterValue = value as typeof filterForm.activeDate;
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
              onDelete={() => handleDeleteFilter(key, [])}
              sx={{
                '& .MuiChip-label': {
                  textTransform: 'uppercase',
                },
              }}
            />
          );
        }
        case 'transactionType':
        case 'upgradeStatus': {
          const filterValue = value as typeof upgrageStatusOptions;
          if (filterValue.length === 0) return null;
          return (
            <Chip
              variant="outlined"
              key={key}
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
            {tReport('pageTitleTransactionSummary')}
          </Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
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
                        activeDate: value,
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
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tReport('filterUpgradeStatus')}
                </Typography>
                <Autocomplete
                  value={upgrageStatusOptions.filter(data =>
                    filterForm.upgradeStatus.some(
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
                        upgradeStatus: value as OptionMap<UpgradeStatus>[],
                      }));
                    });
                  }}
                  options={upgrageStatusOptions}
                  fullWidth
                  size="small"
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'upgrade status',
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
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tReport('filterTransactionType')}
                </Typography>
                <Autocomplete
                  value={transactionTypeOptions.filter(data =>
                    filterForm.transactionType.some(
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
                        transactionType: value as OptionMap<TransactionType>[],
                      }));
                    });
                  }}
                  options={transactionTypeOptions}
                  fullWidth
                  size="small"
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'transaction type',
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

        {transactionSummaryStatus === 'loading' && <LoadingPage />}

        {transactionSummaryStatus === 'success' &&
          transactionSummaryData.length === 0 && (
            <EmptyList
              title={tCommon('tableEmptyNotFound')}
              description=""
              grayscale
            />
          )}

        {transactionSummaryStatus === 'success' &&
          transactionSummaryData.length > 0 && (
            <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
              <Stack direction="column" spacing={2}>
                <Datatable
                  columns={columns as Column<object>[]}
                  data={transactionSummaryData}
                  sortBy={sortBy}
                  direction={direction}
                  onSort={handleSort}
                  hideHeaderSort={[
                    'action',
                    'balance',
                    'coName',
                    'loyaltyStatus',
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
                      totalShowing: transactionSummaryData.length,
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

              <Stack mt={4}>
                {errors.effectiveDate && (
                  <Typography
                    variant="caption"
                    textAlign="end"
                    sx={{ mt: '0px !important' }}
                    color={
                      errors.effectiveDate ? Token.color.redDark : 'initial'
                    }
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
                          <Typography variant="button">
                            {option.label}
                          </Typography>
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
            </Card>
          )}
      </Stack>
      {selectedData && isActive && (
        <ViewTransactionSummaryModal
          isActive={isActive}
          onHide={hideModal}
          selectedData={selectedData}
        />
      )}
    </Stack>
  );
};

export default COTransactionSummaryList;
