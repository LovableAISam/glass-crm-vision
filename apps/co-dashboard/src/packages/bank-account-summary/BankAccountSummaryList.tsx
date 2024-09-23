// Cores
import React, { useMemo, useState } from 'react';

// Components
import {
  Typography,
  Stack,
  Card,
  Pagination,
  Grid,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';
import {
  Token,
  Datatable,
  FormDatePicker,
  LoadingPage,
  EmptyList,
  PriceCell,
} from '@woi/web-component';
import { Column } from 'react-table';

// Hooks & Utils
import { DateConvert } from '@woi/core';
import { useTranslation } from 'react-i18next';
import { fileFormats } from '@woi/service/co/transaction/transactionHistory/memberTransactionHistoryExport';
import useBankAccountSummaryList from './hooks/useBankAccountSummaryList';
import { useRouter } from 'next/router';
import { calculateDateRangeDays } from '@woi/core/utils/date/dateConvert';
import { useController } from 'react-hook-form';

// Types & Consts
import { BankAccountSummaryData } from '@woi/service/co/admin/report/bankAccountSummaryList';
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';

// Asset
import DownloadIcon from '@mui/icons-material/Download';

const BankAccountSummaryList = () => {
  const router = useRouter();

  const [formatOption, setFormatOption] = useState<string>('PDF');

  const {
    setPagination,
    sortBy,
    direction,
    handleSort,
    pagination,
    handleExport,
    bankAccountSummaryStatus,
    bankAccountSummaryData,
    bankAccountSummaryInfo,
    formData,
  } = useBankAccountSummaryList({ formatOption });
  const { t: tCommon } = useTranslation('common');
  const { t: tReport } = useTranslation('report');
  const { t: tForm } = useTranslation('form');

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

  const columns: Array<Column<BankAccountSummaryData & { action: string }>> =
    useMemo(
      () => [
        {
          Header: tReport('tableHeaderPostDate'),
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
          Cell: ({ value }) => (
            <Typography variant="inherit" key="transactionType">
              {getTransactionTypeString(value)}
            </Typography>
          ),
        },
        {
          Header: tReport('tableHeaderTransactionId'),
          accessor: 'transactionId',
        },
        {
          Header: tReport('tableHeaderDescription'),
          accessor: 'description',
        },
        {
          Header: tReport('tableHeaderAmount'),
          accessor: 'amount',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tReport('tableHeaderDebitorCredit'),
          accessor: 'category',
        },
        {
          Header: tReport('tableHeaderBalance'),
          accessor: 'balance',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
      ],
      [],
    );

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">
            {tReport('pageTitleBankAccountSummary')}
          </Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={6} md={6} xs={12}>
              <FormDatePicker
                {...fieldEffectiveDate}
                placeholder={tForm('placeholderSelect', {
                  fieldName: 'date',
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
                title={tReport('filterDate')}
                size="small"
                dateRangeProps={{
                  minDate: new Date(),
                }}
                error={Boolean(errors.effectiveDate)}
                helperText={errors.effectiveDate?.message}
                onFocus={() => clearErrors()}
              />
            </Grid>
          </Grid>
        </Card>

        {bankAccountSummaryStatus === 'success' && (
          <Card sx={{ p: 3, borderRadius: 4 }}>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item md={4} xs={12}>
                <Stack direction="column" spacing={2}>
                  <Typography
                    variant="body2"
                    color={Token.color.greyscaleGreyDarkest}
                  >
                    {tReport('detailInquiryTime')}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ py: 0.8 }}>
                    {DateConvert.stringToDateFormat(
                      bankAccountSummaryInfo?.inquiryTime,
                      LONG_DATE_TIME_FORMAT,
                    )}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item md={4} xs={12}>
                <Stack direction="column" spacing={2}>
                  <Typography
                    variant="body2"
                    color={Token.color.greyscaleGreyDarkest}
                  >
                    {tReport('detailAccount')}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ py: 0.8 }}>
                    {bankAccountSummaryInfo?.name}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item md={4} xs={12}>
                <Stack direction="column" spacing={2}>
                  <Typography
                    variant="body2"
                    color={Token.color.greyscaleGreyDarkest}
                  >
                    {tReport('detailPeriod')}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ py: 0.8 }}>
                    {bankAccountSummaryInfo?.period}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Card>
        )}

        {bankAccountSummaryStatus === 'loading' && <LoadingPage />}

        {bankAccountSummaryStatus === 'success' &&
          bankAccountSummaryData.length === 0 && (
            <EmptyList
              title={tCommon('tableEmptyNotFound')}
              description=""
              grayscale
            />
          )}

        {bankAccountSummaryStatus === 'success' &&
          bankAccountSummaryData.length > 0 && (
            <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
              <Stack direction="column" spacing={2}>
                <Datatable
                  columns={columns as Column<object>[]}
                  data={bankAccountSummaryData}
                  sortBy={sortBy}
                  direction={direction}
                  onSort={handleSort}
                  hideHeaderSort={[
                    'dateTime',
                    'transactionType',
                    'transactionId',
                    'description',
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
                      totalShowing: bankAccountSummaryData.length,
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
    </Stack>
  );
};

export default BankAccountSummaryList;
