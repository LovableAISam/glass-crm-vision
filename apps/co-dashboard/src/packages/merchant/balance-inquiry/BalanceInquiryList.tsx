// Cores
import { useMemo } from 'react';

// Components
import { Card, Grid, Pagination, Stack, Typography } from '@mui/material';
import {
  Datatable,
  EmptyList,
  LoadingPage,
  PriceCell,
  Token,
} from '@woi/web-component';
import { Column } from 'react-table';

// Hooks & Utils
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import useBalanceInquiryList from './hooks/useBalanceInquiryList';
import { DateConvert, PriceConverter } from '@woi/core';

// Types & Consts
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';
import { BalanceInquiryData } from '@woi/service/co/merchant/balanceInquiryList';

const BalanceInquiryList = () => {
  const router = useRouter();

  const {
    setPagination,
    sortBy,
    direction,
    handleSort,
    pagination,
    balanceInquiryStatus,
    balanceInquiryData,
    balanceInquiryHeader,
  } = useBalanceInquiryList();
  const { t: tCommon } = useTranslation('common');
  const { t: tAccount } = useTranslation('account');

  const columns: Array<Column<BalanceInquiryData & { action: string }>> =
    useMemo(
      () => [
        {
          Header: tAccount('tableHeaderCOCode'),
          accessor: 'coCode',
        },
        {
          Header: tAccount('tableHeaderCOName'),
          accessor: 'coName',
        },
        {
          Header: tAccount('tableHeaderBalance'),
          accessor: 'balance',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tAccount('tableHeaderLastUpdate'),
          accessor: 'lastUpdate',
          Cell: ({ value }) => (
            <Typography variant="inherit" key="dateTime">
              {DateConvert.stringToDateFormat(value, LONG_DATE_TIME_FORMAT)}
            </Typography>
          ),
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
            {tAccount('pageTitleBalanceInquiry')}
          </Typography>
        </Stack>

        {balanceInquiryStatus === 'success' && balanceInquiryHeader && (
          <Card sx={{ p: 3, borderRadius: 4 }}>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item md={3} xs={12}>
                <Stack direction="column" spacing={2}>
                  <Typography
                    variant="body2"
                    color={Token.color.greyscaleGreyDarkest}
                  >
                    {tAccount('detailAccountNumber')}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ py: 0.8 }}>
                    {balanceInquiryHeader?.accountNumber || '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item md={3} xs={12}>
                <Stack direction="column" spacing={2}>
                  <Typography
                    variant="body2"
                    color={Token.color.greyscaleGreyDarkest}
                  >
                    {tAccount('detailDate')}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ py: 0.8 }}>
                    {balanceInquiryHeader?.inquiryTime
                      ? DateConvert.stringToDateFormat(
                          balanceInquiryHeader?.inquiryTime,
                          LONG_DATE_TIME_FORMAT,
                        )
                      : '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item md={3} xs={12}>
                <Stack direction="column" spacing={2}>
                  <Typography
                    variant="body2"
                    color={Token.color.greyscaleGreyDarkest}
                  >
                    {tAccount('detailBalanceGross')}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ py: 0.8 }}>
                    {PriceConverter.formatPrice(
                      balanceInquiryHeader?.balanceGross,
                      router.locale,
                    )}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item md={3} xs={12}>
                <Stack direction="column" spacing={2}>
                  <Typography
                    variant="body2"
                    color={Token.color.greyscaleGreyDarkest}
                  >
                    {tAccount('detailBalanceNett')}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ py: 0.8 }}>
                    {PriceConverter.formatPrice(
                      balanceInquiryHeader?.balanceNett,
                      router.locale,
                    )}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Card>
        )}

        {balanceInquiryStatus === 'loading' && <LoadingPage />}

        {balanceInquiryStatus === 'success' &&
          balanceInquiryData.length === 0 && (
            <EmptyList
              title={tAccount('tableEmptyBalanceInquiryTitle')}
              description=""
              grayscale
            />
          )}

        {balanceInquiryStatus === 'success' && balanceInquiryData.length > 0 && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={balanceInquiryData}
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
                    totalShowing: balanceInquiryData.length,
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
        )}
      </Stack>
    </Stack>
  );
};

export default BalanceInquiryList;
