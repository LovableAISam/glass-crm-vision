// Cores
import React, { useMemo, useState } from 'react';

// Components
import {
  Box,
  Card,
  Divider,
  Grid,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import {
  Button,
  Datatable,
  FormDatePicker,
  LoadingPage,
  Token,
  EmptyList,
  PriceCell,
} from '@woi/web-component';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';

// Hooks & Utils
import { useCommunityOwner } from '@src/shared/context/CommunityOwnerContext';
import { batch, DateConvert, PriceConverter } from '@woi/core';
import useActivityMemberHistoryList from '@src/packages/kyc-request/hooks/useActivityMemberHistoryList';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { Column } from 'react-table';
import { ViewKYCRequestTabProps } from '../ViewKYCRequestHistoryTab';
import {
  LONG_DATE_FORMAT,
  LONG_DATE_TIME_FORMAT,
} from '@woi/core/utils/date/constants';
import { TransactionHistoryData } from '@woi/service/co/transaction/transactionHistory/transactionHistoryList';

function AccountInformation(props: ViewKYCRequestTabProps) {
  const { memberDetail } = props;
  const [show, setShow] = useState<boolean>(true);
  const { coDetail } = useCommunityOwner();
  const router = useRouter();
  const {
    balance,
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
  } = useActivityMemberHistoryList({ phoneNumber: memberDetail?.phoneNumber });
  const { t: tCommon } = useTranslation('common');
  const { t: tKYC } = useTranslation('kyc');
  const { t: tForm } = useTranslation('form');

  const columns: Array<Column<TransactionHistoryData>> = useMemo(
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
        Header: tKYC('accountInformationTableHeaderType'),
        accessor: 'method',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="method">
            {value || '-'}
          </Typography>
        ),
      },
      {
        Header: tKYC('accountInformationTableHeaderMethod'),
        accessor: 'dbCr',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="dbCr">
            {value || '-'}
          </Typography>
        ),
      },
      {
        Header: tKYC('accountInformationTableHeaderRefID'),
        accessor: 'transactionId',
      },
      {
        Header: tKYC('accountInformationTableHeaderDescription'),
        accessor: 'description',
      },
      {
        Header: tKYC('accountInformationTableHeaderAmount'),
        accessor: 'amount',
        Cell: ({ row }) => {
          if (row.original.amount) {
            return (
              <Typography
                variant="inherit"
                color={
                  row.original.dbCr
                    ? Token.color.redDark
                    : Token.color.greenDark
                }
                key="amount"
              >
                {PriceConverter.formatPrice(row.original.amount, router.locale)}
              </Typography>
            );
          }
          // if (row.original.withdraw) {
          //   return (
          //     <Typography
          //       variant="inherit"
          //       color={
          //         row.original.isDebit
          //           ? Token.color.redDark
          //           : Token.color.greenDark
          //       }
          //       key="amount"
          //     >
          //       {row.original.isDebit ? '-' : '+'}{' '}
          //       {PriceConverter.formatPrice(
          //         row.original.withdraw.withdrawAmount,
          //         router.locale,
          //       )}
          //     </Typography>
          //   );
          // }
          // if (row.original.deposit) {
          //   return (
          //     <Typography
          //       variant="inherit"
          //       color={
          //         row.original.isDebit
          //           ? Token.color.redDark
          //           : Token.color.greenDark
          //       }
          //     >
          //       {row.original.isDebit ? '-' : '+'}{' '}
          //       {PriceConverter.formatPrice(
          //         row.original.deposit.depositAmount,
          //         router.locale,
          //       )}
          //     </Typography>
          //   );
          // }
          // if (row.original.transfer) {
          //   return (
          //     <Typography
          //       variant="inherit"
          //       color={
          //         row.original.isDebit
          //           ? Token.color.redDark
          //           : Token.color.greenDark
          //       }
          //     >
          //       {row.original.isDebit ? '-' : '+'}{' '}
          //       {PriceConverter.formatPrice(
          //         row.original.transfer.transferAmount,
          //         router.locale,
          //       )}
          //     </Typography>
          //   );
          // }
          return <></>;
        },
      },
      {
        Header: tKYC('accountInformationTableHeaderBalance'),
        accessor: 'balance',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
    ],
    [],
  );

  return (
    <Box>
      {!show && coDetail && (
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
                  {tKYC('accountInformationCOCode')}
                </Typography>
                <Typography variant="subtitle2">{coDetail?.code || '-'}</Typography>
                <Divider />
              </Stack>
            </Grid>
            <Grid item md={4} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  {tKYC('accountInformationCOName')}
                </Typography>
                <Typography variant="subtitle2">{coDetail?.name || '-'}</Typography>
                <Divider />
              </Stack>
            </Grid>
            <Grid item md={4} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  {tKYC('accountInformationEffectiveDate')}
                </Typography>
                <Typography variant="subtitle2">
                  {coDetail?.activeDate ? `${DateConvert.stringToDateFormat(
                    coDetail?.activeDate,
                    LONG_DATE_FORMAT,
                  )} - ${DateConvert.stringToDateFormat(
                    coDetail?.inactiveDate,
                    LONG_DATE_FORMAT,
                  )}` : '-'}
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
            {PriceConverter.formatPrice(balance, router.locale)}
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
            sx={{ borderRadius: 2, display: 'none' }}
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
                value={filterForm.transactionDate}
                onChange={value => {
                  batch(() => {
                    setPagination(oldPagination => ({
                      ...oldPagination,
                      currentPage: 0,
                    }));
                    setFilterForm(oldForm => ({
                      ...oldForm,
                      transactionDate: value,
                    }));
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
                title={tCommon('tableEmptyTitle')}
                description={tCommon('tableEmptyDescription', {
                  text: 'activity history request',
                })}
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
                        'referenceId',
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
                    {tCommon('exportAsXls')}
                  </Typography>
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
