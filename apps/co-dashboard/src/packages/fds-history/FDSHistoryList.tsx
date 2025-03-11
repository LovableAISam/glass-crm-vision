// Cores
import React, { useMemo, useState } from 'react';

// Components
import {
  Typography,
  Stack,
  Card,
  TextField,
  Pagination,
  Grid,
  Chip,
  Autocomplete,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Token,
  Datatable,
  EmptyList,
  LoadingPage,
  FormDatePicker,
  PriceCell,
  renderOptionCheckbox,
  Button,
} from '@woi/web-component';
import { Column } from 'react-table';
import { useRouter } from 'next/router';

// Hooks & Utils
import useFDSHistoryList from './hooks/useFDSHistoryList';
import { batch, DateConvert, fileFormats } from '@woi/core';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';
import {
  calculateDateRangeDays,
  stringToDateFormat,
} from '@woi/core/utils/date/dateConvert';
import { OptionMap } from '@woi/option';
// import { TransactionType } from '@woi/service/co/transaction/transactionSummary/transactionSummaryList';
import { FDSHistory } from '@woi/service/co/admin/fDSHistory/fDSHistoryList';
import { useController } from 'react-hook-form';

// Icons
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';

const FDSHistoryList = () => {
  const router = useRouter();
  const [formatOption, setFormatOption] = useState<string>('PDF');
  const {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    fDSData,
    fDSStatus,
    transactionTypeOptions,
    handleExport,
    formData,
    isLoadingDownload,
  } = useFDSHistoryList({ formatOption });
  const { t: tCommon } = useTranslation('common');
  const { t: tReport } = useTranslation('report');
  const { t: tFDSHistory } = useTranslation('fDSHistory');
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

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormatOption(event.target.name);
  };

  const getTransactionTypeString = (transactionType: string): string => {
    const typeMapping: Record<string, string> = {
      ADD_MONEY_VIA_NG: tReport('optionAddMoneyViaNG'),
      ADD_MONEY_VIA_SAVING_ACCOUNT: tReport('optionAddMoneySaving'),
      SEND_MONEY: tReport('optionSendMoney'),
      REQUEST_MONEY: tReport('optionRequestMoney'),
      ADD_MONEY_P2P: tReport('optionP2PIncoming'),
      P2M_SCAN_TO_PAY: tReport('optionPaytoMerchant'),
      P2P_OUTGOING_SEND_TO_BANK: tReport('optionP2POutgoing'),
      CASHOUT_TO_BPI: tReport('optionCashoutToBpi'),
      PAYBILLS_ECPAY: tReport('optionPaybills'),
      CARDLESS_WITHDRAWAL: tReport('optionCardLessWithdrawal'),
      BALANCE_CORRECTION: tReport('optionBalanceCorrection'),
    };
    return typeMapping[transactionType] || transactionType;
  };

  const columns: Array<Column<FDSHistory & { action: string }>> = useMemo(
    () => [
      {
        Header: tFDSHistory('tableHeaderSender'),
        accessor: 'sender',
      },
      {
        Header: tFDSHistory('tableHeaderName'),
        accessor: 'name',
      },
      {
        Header: tFDSHistory('tableHeaderCreatedDate'),
        accessor: 'createdDate',
        Cell: ({ value }) => (
          <Typography
            variant="inherit"
            key="createdDate"
            sx={{
              color: Token.color.greyscaleGreyDarkest,
            }}
          >
            {DateConvert.stringToDateFormat(value, LONG_DATE_TIME_FORMAT)}
          </Typography>
        ),
      },
      {
        Header: tFDSHistory('tableHeaderRefId'),
        accessor: 'refId',
      },
      {
        Header: tFDSHistory('tableHeaderReceiver'),
        accessor: 'receiver',
      },
      {
        Header: tFDSHistory('tableHeaderAccountNo'),
        accessor: 'accountNo',
      },
      {
        Header: tReport('tableHeaderTransactionType'),
        accessor: 'transactionType',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="transactionType">
            {getTransactionTypeString(value)}
          </Typography>
        ),
      },
      {
        Header: tFDSHistory('tableHeaderAmount'),
        accessor: 'amount',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tFDSHistory('tableHeaderPaymentMethod'),
        accessor: 'paymentMethod',
      },
    ],
    [],
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
        case 'phoneNumber': {
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
        case 'transactionType': {
          const filterValue = value as typeof transactionTypeOptions;
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
          <Typography variant="h4">{tFDSHistory('pageTitleTitle')}</Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tFDSHistory('filterPhoneNumber')}
                </Typography>
                <TextField
                  value={filterForm.phoneNumber}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        phoneNumber: e.target.value,
                      }));
                    });
                  }}
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', {
                    fieldName: tFDSHistory('typePhoneNumber'),
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
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tFDSHistory('filterTransactionType')}
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
                        transactionType: value as OptionMap<string>[],
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
                        fieldName: tFDSHistory('placeholderTransactionType'),
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
        {fDSStatus === 'loading' && <LoadingPage />}
        {fDSStatus === 'success' && fDSData.length === 0 && (
          <EmptyList
            title={tCommon('tableEmptyTitle')}
            description={tCommon('tableEmptyDescription', {
              text: tFDSHistory('titleEmptyState'),
            })}
            grayscale
          />
        )}
        {fDSStatus === 'success' && fDSData.length > 0 && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={fDSData}
                sortBy={sortBy}
                direction={direction}
                onSort={handleSort}
                hideHeaderSort={['refId', 'accountNo', 'paymentMethod']}
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
                    totalShowing: fDSData.length,
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

export default FDSHistoryList;
