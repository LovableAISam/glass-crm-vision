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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';

// Hooks & Utils
import { batch, DateConvert, PriceConverter } from '@woi/core';
import useActivityMemberHistoryList from '@src/packages/member-management/hooks/useActivityMemberHistoryList';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { calculateDateRangeDays } from '@woi/core/utils/date/dateConvert';

// Types & Consts
import { Column } from 'react-table';
import { ViewManageMemberTabProps } from '../ViewManageMemberTab';
import {
  LONG_DATE_FORMAT,
  LONG_DATE_TIME_FORMAT,
} from '@woi/core/utils/date/constants';
import { MemberTransactionHistoryData } from '@woi/service/co/transaction/transactionHistory/memberTransactionHistoryList';
import { fileFormats } from '@woi/service/co/transaction/transactionHistory/memberTransactionHistoryExport';

function AccountInformation(props: ViewManageMemberTabProps) {
  const { memberDetail } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [show, setShow] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>('PDF');
  const router = useRouter();
  const {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    handleExport,
    activityMemberHistoryData,
    activityMemberHistoryStatus,
  } = useActivityMemberHistoryList({
    phoneNumber: memberDetail?.phoneNumber,
    selectedOption,
  });
  const { t: tCommon } = useTranslation('common');
  const { t: tKYC } = useTranslation('kyc');
  const { t: tForm } = useTranslation('form');
  const { t: tReport } = useTranslation('report');

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

  const getFormattedAmount = (amount: number, locale: string | undefined) => {
    if (amount > 0) {
      return `+${PriceConverter.formatPrice(amount, locale)}`;
    } else if (amount === 0) {
      return `-${PriceConverter.formatPrice(amount, locale)}`;
    } else {
      return PriceConverter.formatPrice(amount, locale);
    }
  };

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
        Header: tKYC('accountInformationTableHeaderMethod'),
        accessor: 'method',
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
                : Token.color.redDark
            }
          >
            {getFormattedAmount(row.original.amount, router.locale)}
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
                  {memberDetail?.accountNumber || '-'}
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
                  {tKYC('accountInformationEmail')}
                </Typography>
                <Typography variant="subtitle2" textTransform="none">
                  {capitalizeWords(memberDetail?.email || '')}
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
                    LONG_DATE_FORMAT,
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
            <Grid item md={4} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  {tKYC('accountInformationUpgradeDate')}
                </Typography>
                <Typography variant="subtitle2">
                  {memberDetail?.upgradeDate || '-'}
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
                  {tKYC('accountInformationMemberType')}
                </Typography>
                <Typography variant="subtitle2">
                  {capitalizeWords(memberDetail?.vybeMember || '')}
                </Typography>
                <Divider />
              </Stack>
            </Grid>
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
            {`${
              show
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
                value={filterForm.transactionDate}
                onChange={value => {
                  batch(() => {
                    setPagination(oldPagination => ({
                      ...oldPagination,
                      currentPage: 0,
                    }));
                    const { startDate, endDate } = value;
                    if (calculateDateRangeDays(startDate, endDate) > 730) {
                      enqueueSnackbar(
                        'Effective date to cannot be greater than 730 days from effective date from.',
                        {
                          variant: 'error',
                        },
                      );
                    } else {
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        transactionDate: value,
                      }));
                    }
                  });
                }}
                title={tKYC('activityMemberHistoryFilterTransactionDate')}
                size="small"
                placeholder={tForm('placeholderSelect', {
                  fieldName: 'transaction date',
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
            </Grid>
          </Grid>
          {activityMemberHistoryStatus === 'loading' && <LoadingPage />}
          {activityMemberHistoryStatus === 'success' &&
            activityMemberHistoryData.length === 0 && (
              <EmptyList
                title={tCommon('tableEmptyNotFound')}
                description=""
                grayscale
              />
            )}
          {activityMemberHistoryStatus === 'success' &&
            activityMemberHistoryData.length > 0 && (
              <React.Fragment>
                <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
                  <Stack direction="column" spacing={2}>
                    <Datatable
                      columns={columns as Column<object>[]}
                      data={activityMemberHistoryData}
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
                          totalShowing: activityMemberHistoryData.length,
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
              </React.Fragment>
            )}
        </Stack>
      )}
    </Box>
  );
}

export default AccountInformation;
