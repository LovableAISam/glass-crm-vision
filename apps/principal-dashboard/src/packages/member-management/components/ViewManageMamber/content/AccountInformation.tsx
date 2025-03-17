// Cores
import React, { useMemo, useState } from 'react';

// Components
import {
  Box,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import {
  Button,
  Datatable,
  EmptyList,
  FormDatePicker,
  LoadingPage,
  PriceCell,
  Token,
} from '@woi/web-component';

// Hooks & Utils
import { DateConvert, fileFormats, PriceConverter } from '@woi/core';
import useMemberTransactionHistory from '@src/packages/member-management/hooks/useMemberTransactionHistory';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useController } from 'react-hook-form';

// Types & Consts
import { Column } from 'react-table';
import { ViewManageMemberTabProps } from '../ViewManageMemberTab';
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';
import { MemberTransactionHistoryData } from '@woi/service/co/transaction/transactionHistory/memberTransactionHistoryList';
import { calculateDateRangeDays } from '@woi/core/utils/date/dateConvert';

// Asset
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';

function AccountInformation(props: ViewManageMemberTabProps) {
  const { memberDetail } = props;

  const router = useRouter();

  const [show, setShow] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>('PDF');
  const {
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    handleExport,
    memberTransactionHistoryData,
    memberTransactionHistoryStatus,
    formData,
  } = useMemberTransactionHistory({
    phoneNumber: memberDetail?.phoneNumber,
    selectedOption,
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tKYC } = useTranslation('kyc');
  const { t: tForm } = useTranslation('form');
  const { t: tReport } = useTranslation('report');
  const { t: tMember } = useTranslation('member');

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

  const columns: Array<Column<MemberTransactionHistoryData>> = useMemo(
    () => [
      {
        Header: tKYC('accountInformationTableHeaderDateTime'),
        accessor: 'dateTime',
        Cell: ({ row }) => (
          <Typography variant="inherit" key="dateTime">
            {DateConvert.stringToDateFormat(
              row.original.dateTime,
              LONG_DATE_TIME_FORMAT,
            )}
          </Typography>
        ),
      },
      {
        Header: tKYC('tableHeaderTransactionType'),
        accessor: 'type',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="transactionType">
            {getTransactionTypeString(value)}
          </Typography>
        ),
      },
      {
        Header: tKYC('accountInformationTableHeaderMethod'),
        accessor: 'method',
      },
      {
        Header: tKYC('accountInformationTableHeaderReferenceID'),
        accessor: 'transactionId',
      },
      {
        Header: tKYC('accountInformationTableHeaderDescription'),
        accessor: 'description',
      },
      {
        Header: tKYC('accountInformationTableHeaderAmount'),
        accessor: 'amount',
        Cell: ({ row }) => (
          <Typography
            variant="inherit"
            key="dateTime"
            color={
              row.original.dbCr === 'CREDIT'
                ? Token.color.greenDark
                : row.original.dbCr === 'DEBIT' ? Token.color.redDark : Token.color.primaryBlack
            }
          >
            {`${row.original.dbCr === 'CREDIT' ? '+' : row.original.dbCr === 'DEBIT' ? '-' : ''
              }${PriceConverter.formatPrice(row.original.amount, router.locale)}`}
          </Typography>
        ),
      },
      {
        Header: tKYC('accountInformationTableHeaderBalance'),
        accessor: 'balance',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
    ],
    [],
  );

  const capitalizeWords = (str: string) => {
    return str.replace(/_([A-Z])/g, ' $1').toLowerCase();
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.name);
  };

  return (
    <Box>
      {!show && (
        <React.Fragment>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {tKYC('accountInformationListOfCO')}
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item md={4} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  {tKYC('accountInformationAccountNumber')}
                </Typography>
                <Typography variant="subtitle2">
                  {memberDetail?.phoneNumber || '-'}
                </Typography>
                <Divider />
              </Stack>
            </Grid>
            <Grid item md={4} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  {tKYC('accountInformationRegisterDate')}
                </Typography>
                <Typography variant="subtitle2">
                  {DateConvert.stringToDateFormat(
                    memberDetail?.createdDate,
                    LONG_DATE_TIME_FORMAT,
                  )}
                </Typography>
                <Divider />
              </Stack>
            </Grid>
            <Grid item md={4} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  {tKYC('accountInformationUpgradeStatus')}
                </Typography>
                <Typography variant="subtitle2">
                  {capitalizeWords(memberDetail?.upgradeStatus || '')}
                </Typography>
                <Divider />
              </Stack>
            </Grid>
            {memberDetail?.upgradeStatus === 'REGISTERED' && (
              <Grid item md={4} xs={12}>
                <Stack direction="column" spacing={1}>
                  <Typography
                    variant="body2"
                    color={Token.color.greyscaleGreyDarkest}
                  >
                    {tKYC('accountInformationUpgradeDate')}
                  </Typography>
                  <Typography variant="subtitle2">
                    {memberDetail?.upgradeDate ? DateConvert.stringToDateFormat(
                      memberDetail?.upgradeDate,
                      LONG_DATE_TIME_FORMAT,
                    ) : '-'}
                  </Typography>
                  <Divider />
                </Stack>
              </Grid>
            )}
          </Grid>
        </React.Fragment>
      )}
      <Stack direction="column" spacing={1}>
        <Typography variant="body2" color={Token.color.greyscaleGreyDarkest}>
          {tKYC('accountInformationBalance')}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="subtitle2">
            {PriceConverter.formatPrice(
              memberDetail?.balance || 0,
              router.locale,
            )}
          </Typography>
          <Button
            variant="text"
            endIcon={
              <ExpandMoreIcon
                sx={{
                  transform: show ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'all 0.4s linear',
                }}
              />
            }
            sx={{ borderRadius: 2 }}
            onClick={() => setShow(showProps => !showProps)}
          >
            {`${show
              ? tKYC('accountInformationActionHideTransactionDetail')
              : tKYC('accountInformationActionSeeTransactionDetail')
              }`}
          </Button>
        </Stack>
        <Divider />
      </Stack>
      {show && (
        <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <FormDatePicker
                {...fieldEffectiveDate}
                placeholder={tForm('placeholderSelect', {
                  fieldName: 'transaction date',
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
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
          {memberTransactionHistoryStatus === 'loading' && <LoadingPage />}
          {memberTransactionHistoryStatus === 'success' &&
            memberTransactionHistoryData.length === 0 && (
              <EmptyList
                title={tCommon('tableEmptyTitle')}
                description={tMember(
                  'emptyMemberTransactionHistoryDescription',
                )}
              />
            )}
          {memberTransactionHistoryStatus === 'success' &&
            memberTransactionHistoryData.length > 0 && (
              <React.Fragment>
                <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
                  <Stack direction="column" spacing={2}>
                    <Datatable
                      columns={columns as Column<object>[]}
                      data={memberTransactionHistoryData}
                      sortBy={sortBy}
                      direction={direction}
                      onSort={handleSort}
                      hideHeaderSort={[
                        'transactionId',
                        'description',
                        'amount',
                        'balance',
                        'action',
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
                          totalShowing: memberTransactionHistoryData.length,
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
                            checked={selectedOption === option.name}
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
                <Typography
                  variant="caption"
                  textAlign="end"
                  sx={{ mt: '0px !important' }}
                >
                  {tCommon('labelMaxDownload')}
                </Typography>
              </React.Fragment>
            )}
        </Stack>
      )}
    </Box>
  );
}

export default AccountInformation;
