import React, { useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  IconButton,
  Grid,
  Card,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DateConvert, PriceConverter } from '@woi/core';
import {
  Datatable,
  EmptyList,
  LoadingPage,
  PriceCell,
  Token,
} from '@woi/web-component';
import useTransactionSummaryDetail from '../hooks/useTransactionSummaryDetail';
import { useRouter } from 'next/router';
import { Column } from 'react-table';
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';
import { TransactionSummaryData } from '@woi/service/co/transaction/transactionSummary/transactionSummaryList';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import { DataTransactionSummary } from '@woi/service/co/admin/report/transactionSummaryDetail';

type ViewTransactionSummaryModalProps = {
  isActive: boolean;
  onHide: () => void;
  selectedData: TransactionSummaryData;
};

const ViewTransactionSummaryModal = (
  props: ViewTransactionSummaryModalProps,
) => {
  const { isActive, onHide, selectedData } = props;

  const router = useRouter();
  const { t: tReport } = useTranslation('report');
  const { t: tCommon } = useTranslation('common');

  const {
    sortBy,
    direction,
    handleSort,
    transactionSummaryData,
    transactionSummaryStatus,
    transactionSummaryDetail,
  } = useTransactionSummaryDetail({ selectedData });

  const capitalizeWords = (str: string) => {
    return str.charAt(0) + str.slice(1).toLowerCase();
  };

  const columns: Array<Column<DataTransactionSummary>> = useMemo(
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
        accessor: 'type',
      },
      {
        Header: tReport('tableHeaderVASource'),
        accessor: 'vaSource',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="vaSource">
            {value}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderVADest'),
        accessor: 'vaDestination',
      },
      {
        Header: tReport('tableHeaderAmount'),
        accessor: 'amount',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tReport('tableHeaderDrCr'),
        accessor: 'category',
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
        Header: tReport('tableHeaderReferralNumber'),
        accessor: 'referralNumber',
      },
      {
        Header: tReport('tableHeaderBeneficiaryAccount'),
        accessor: 'beneficiaryAccountNumber',
      },
    ],
    [],
  );

  return (
    <Dialog
      open={isActive}
      onClose={onHide}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        },
      }}
      maxWidth="xl"
      fullWidth
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">{tReport('detailTitle')}</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item md={4} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body2"
                color={Token.color.greyscaleGreyDarkest}
              >
                {tReport('detailDate')}
              </Typography>
              <Typography variant="subtitle2">
                {DateConvert.stringToDateFormat(
                  transactionSummaryDetail?.dateTime,
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
                {tReport('detailTransactionType')}
              </Typography>
              <Typography variant="subtitle2">
                {transactionSummaryDetail?.transactionType || '-'}
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
                {tReport('detailVASource')}
              </Typography>
              <Typography variant="subtitle2">
                {transactionSummaryDetail?.vaSource || '-'}
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
                {tReport('detailVADestination')}
              </Typography>
              <Typography variant="subtitle2">
                {transactionSummaryDetail?.vaDestination || '-'}
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
                {tReport('detailPrincipalAmount')}
              </Typography>
              <Typography variant="subtitle2">
                {PriceConverter.formatPrice(
                  transactionSummaryDetail?.principalAmount || 0,
                  router.locale,
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
                {tReport('detailStatus')}
              </Typography>
              <Typography variant="subtitle2" textTransform="capitalize">
                {transactionSummaryDetail?.status.toLocaleLowerCase() || '-'}
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
                {tReport('detailFeeComision')}
              </Typography>
              <Typography variant="subtitle2">
                {PriceConverter.formatPrice(
                  transactionSummaryDetail?.fee || 0,
                  router.locale,
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
                {tReport('detailTransactionNumber')}
              </Typography>
              <Typography variant="subtitle2">
                {transactionSummaryDetail?.referenceNumber || '-'}
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
                {tReport('detailReferenceNumber')}
              </Typography>
              <Typography variant="subtitle2">
                {transactionSummaryDetail?.transactionNumber || '-'}
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
                {tReport('detailPaymentMethod')}
              </Typography>
              <Typography variant="subtitle2">
                {transactionSummaryDetail?.paymentMethod || '-'}
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
                {tReport('detailOrderNumberRoyalty')}
              </Typography>
              <Typography variant="subtitle2">
                {transactionSummaryDetail?.orderNumberRoyalty || '-'}
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
                {tReport('detailBnisorcResponse')}
              </Typography>
              <Typography variant="subtitle2">
                {transactionSummaryDetail?.bnisorc || '-'}
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
                {tReport('detailPrimaryIdentifier')}
              </Typography>
              <Typography variant="subtitle2">
                {transactionSummaryDetail?.primaryIdentifier || '-'}
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
                {tReport('detailSecondaryIdentifier')}
              </Typography>
              <Typography variant="subtitle2">
                {transactionSummaryDetail?.secondaryIdentifier || '-'}
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
                {tReport('detailTertiaryIdentifier')}
              </Typography>
              <Typography variant="subtitle2">
                {transactionSummaryDetail?.tertiaryIdentifier || '-'}
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
                {tReport('detailBillerFee')}
              </Typography>
              <Typography variant="subtitle2">
                {transactionSummaryDetail?.billerFee || '-'}
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
                {tReport('detailBankFee')}
              </Typography>
              <Typography variant="subtitle2">
                {transactionSummaryDetail?.bankFee || '-'}
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
                {tReport('detailTraceNumber')}
              </Typography>
              <Typography variant="subtitle2">
                {transactionSummaryDetail?.traceNumber || '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
        </Grid>

        <Stack direction="column" spacing={2} sx={{ mt: 4 }}>
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
                    hideHeaderSort={['description']}
                  />
                </Stack>
              </Card>
            )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTransactionSummaryModal;
