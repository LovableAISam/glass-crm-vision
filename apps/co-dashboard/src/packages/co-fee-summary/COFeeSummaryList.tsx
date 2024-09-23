// Cores
import React, { useMemo, useState } from 'react';

// Components
import {
  Typography,
  Stack,
  Card,
  Pagination,
  Grid,
  Autocomplete,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Chip,
} from '@mui/material';
import {
  Token,
  Datatable,
  EmptyList,
  LoadingPage,
  FormDatePicker,
  renderOptionCheckbox,
  PriceCell,
} from '@woi/web-component';
import { Column } from 'react-table';
import { useRouter } from 'next/router';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import useFeeSummaryList from './hooks/useFeeSummaryList';
import { batch, DateConvert } from '@woi/core';
import { useTranslation } from 'react-i18next';
import {
  calculateDateRangeDays,
  stringToDateFormat,
} from '@woi/core/utils/date/dateConvert';

// Types & Consts
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';
import { OptionMap } from '@woi/option';
import { MemberTransactionType } from '@woi/service/co/admin/report/membersummaryDetail';
import { FeeSummaryTransaction } from '@woi/service/co/admin/report/feeSummary';
import { fileFormats } from '@woi/service/co/transaction/transactionHistory/memberTransactionHistoryExport';

// Icons
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import { useController } from 'react-hook-form';

const COFeeSummaryList = () => {
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
    feeSummaryData,
    feeSummaryStatus,
    transactionTypeOptions,
    handleExport,
    formData,
  } = useFeeSummaryList({ formatOption });
  const [showModal] = useModal();
  const { t: tCommon } = useTranslation('common');
  const { t: tReport } = useTranslation('report');
  const { t: tForm } = useTranslation('form');

  const capitalizeWords = (str: string) => {
    return str.charAt(0) + str.slice(1).toLowerCase();
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
      'P2P_OUTGOING_SEND_TO_BANK - IBFT': tReport('optionOutgoingIBFT'),
      'P2P_OUTGOING_SEND_TO_BANK - BPI': tReport('optionOutgoingBPI'),
      CASHOUT_TO_BPI: tReport('optionCashoutToBpi'),
      PAYBILLS_ECPAY: tReport('optionPaybills'),
      CARDLESS_WITHDRAWAL: tReport('optionCardLessWithdrawal'),
      BALANCE_CORRECTION: tReport('optionBalanceCorrection'),
    };
    return typeMapping[transactionType] || transactionType;
  };

  const columns: Array<Column<FeeSummaryTransaction & { action: string }>> =
    useMemo(
      () => [
        {
          Header: tReport('tableHeaderDate'),
          accessor: 'dateTime',
          Cell: ({ value }) => (
            <Typography data-testid="dateTime" variant="inherit" key="dateTime">
              {DateConvert.stringToDateFormat(value, LONG_DATE_TIME_FORMAT)}
            </Typography>
          ),
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
          Header: tReport('tableHeaderVASource'),
          accessor: 'vaSource',
        },
        {
          Header: tReport('tableHeaderRMNumber'),
          accessor: 'rmNumber',
        },
        {
          Header: tReport('tableHeaderVADestination'),
          accessor: 'vaDestination',
        },
        {
          Header: tReport('tableHeaderFeeOrComision'),
          accessor: 'feeCommision',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tReport('tableHeaderDrCr'),
          accessor: 'dbCr',
          Cell: ({ value }) => (
            <Typography variant="inherit" key="dbCr">
              {capitalizeWords(value)}
            </Typography>
          ),
        },
        {
          Header: tReport('tableHeaderStatus'),
          accessor: 'status',
          Cell: ({ value }) => (
            <Typography variant="inherit" key="status">
              {capitalizeWords(value)}
            </Typography>
          ),
        },
        {
          Header: tReport('tableHeaderBalance'),
          accessor: 'balance',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tReport('tableHeaderReferenceNo'),
          accessor: 'referenceNumber',
        },
        {
          Header: tReport('tableHeaderOrderID'),
          accessor: 'orderId',
        },
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
              onDelete={() => handleDeleteFilter(key, [])}
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

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">
            {tReport('pageTitleCOFeeSummary')}
          </Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={6} md={6} xs={12}>
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
            <Grid item xl={6} md={6} xs={12}>
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
                        transactionType:
                          value as OptionMap<MemberTransactionType>[],
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

        {feeSummaryStatus === 'loading' && <LoadingPage />}

        {feeSummaryStatus === 'success' && feeSummaryData.length === 0 && (
          <EmptyList
          title={tCommon('tableEmptyNotFound')}
          description=""
          grayscale
        />
        )}

        {feeSummaryStatus === 'success' && feeSummaryData.length > 0 && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={feeSummaryData}
                sortBy={sortBy}
                direction={direction}
                onSort={handleSort}
                hideHeaderSort={[
                  'action',
                  'balance',
                  'vaSource',
                  'vaDestination',
                  'rmNumber',
                  'feeCommision',
                  'referenceNumber',
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
                    totalShowing: feeSummaryData.length,
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
          </Card>
        )}
      </Stack>
    </Stack>
  );
};

export default COFeeSummaryList;
