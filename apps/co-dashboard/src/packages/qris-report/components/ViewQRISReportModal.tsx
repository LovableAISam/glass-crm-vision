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
  Button,
  Datatable,
  EmptyList,
  LoadingPage,
  PriceCell,
  Token,
} from '@woi/web-component';
import useQRISReportDetail from '../hooks/useQRISReportDetail';
import { useRouter } from 'next/router';
import { Column } from 'react-table';
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';
import { QRISReport } from '@woi/service/co/admin/report/qrisReport';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { QRISReportData } from "@woi/service/co/admin/report/qrisReportDetail";

type ViewQRISReportModalProps = {
  isActive: boolean;
  onHide: () => void;
  selectedData: QRISReport;
};

const ViewQRISReportModal = (props: ViewQRISReportModalProps) => {
  const { isActive, onHide, selectedData } = props;

  const router = useRouter();
  const { t: tReport } = useTranslation('report');
  const { t: tCommon } = useTranslation('common');

  const {
    sortBy,
    direction,
    handleSort,
    qrisReportDetailData,
    qrisReportDetailStatus,
    //transactionSummaryDetail,
  } = useQRISReportDetail({ selectedData });

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
      CASHOUT_TO_BPI: tReport('optionCashoutToBpi'),
      PAYBILLS_ECPAY: tReport('optionPaybills'),
      CARDLESS_WITHDRAWAL: tReport('optionCardLessWithdrawal'),
      BALANCE_CORRECTION: tReport('optionBalanceCorrection'),
    };
    return typeMapping[transactionType] || transactionType;
  };

  const columns: Array<Column<QRISReportData>> = useMemo(
    () => [
      {
        Header: tReport('tableHeaderDate'),
        accessor: 'date',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="date">
            {value
              ? DateConvert.stringToDateFormat(value, LONG_DATE_TIME_FORMAT)
              : '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderTransactionType'),
        accessor: 'transactionType',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="transactionType">
            {value ? getTransactionTypeString(value) : '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderPaymentMethod'),
        accessor: 'balance',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tReport('tableHeaderVASource'),
        accessor: 'vaSource',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="vaSource">
            {value ? value : '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderVADest'),
        accessor: 'vaDestination',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="vaDestination">
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
        Header: tReport('tableHeaderDrCr'),
        accessor: 'drCr',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="drCr">
            {value || '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderStatus'),
        accessor: 'status',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="status">
            {value ? capitalizeWords(value) : '-'}
          </Typography>
        ),
      },

      // {
      //   Header: tReport('tableHeaderReferenceNo'),
      //   accessor: 'referenceNo',
      //   Cell: ({ value }) => (
      //     <Typography variant="inherit" key="referenceNo">
      //       {value || '-'}
      //     </Typography>
      //   ),
      // },
      // {
      //   Header: tReport('tableHeaderReferralNumber'),
      //   accessor: 'referralNumber',
      //   Cell: ({ value }) => (
      //     <Typography variant="inherit" key="referralNumber">
      //       {value || '-'}
      //     </Typography>
      //   ),
      // },
      // {
      //   Header: tReport('tableHeaderBeneficiaryAccount'),
      //   accessor: 'beneficiaryAccount',
      //   Cell: ({ value }) => (
      //     <Typography variant="inherit" key="beneficiaryAccount">
      //       {value || '-'}
      //     </Typography>
      //   ),
      // },
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
                  selectedData?.date,
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
                {tReport('detailVASource')}
              </Typography>
              <Typography variant="subtitle2">
                {selectedData?.vaSource || '-'}
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
                {selectedData?.vaDestination || '-'}
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
                {tReport('detailAmount')}
              </Typography>
              <Typography variant="subtitle2">
                {PriceConverter.formatPrice(
                  selectedData?.amount || 0,
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
              <Typography variant="subtitle2">
                {selectedData?.status || '-'}
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
                  selectedData?.feeCommission || 0,
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
                {tReport('detailReferralNumber')}
              </Typography>
              <Typography variant="subtitle2">
                {selectedData?.referralNumber || '-'}
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
                {selectedData?.transactionNumber || '-'}
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
                {selectedData?.paymentMethod || '-'}
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
                {tReport('detailRrn')}
              </Typography>
              <Typography variant="subtitle2">
                {selectedData?.rrn || '-'}
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
                {tReport('detailQrisMerchantName')}
              </Typography>
              <Typography variant="subtitle2">
                {selectedData?.merchantName || '-'}
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
                {tReport('detailQrisMerchantLocation')}
              </Typography>
              <Typography variant="subtitle2">
                {selectedData?.merchantLocation || '-'}
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
                {tReport('detailAcquirerName')}
              </Typography>
              <Typography variant="subtitle2">
                {selectedData?.acquirerName || '-'}
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
                {tReport('detailMerchantPan')}
              </Typography>
              <Typography variant="subtitle2">
                {selectedData?.merchantPan || '-'}
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
                {tReport('detailTerminalId')}
              </Typography>
              <Typography variant="subtitle2">
                {selectedData?.terminalId || '-'}
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
                {tReport('detailCustomerPan')}
              </Typography>
              <Typography variant="subtitle2">
                {selectedData?.customerPan || '-'}
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
                {tReport('detailTransactionAmount')}
              </Typography>
              <Typography variant="subtitle2">
                {selectedData?.transactionAmount || '-'}
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
                {tReport('detailTips')}
              </Typography>
              <Typography variant="subtitle2">
                {selectedData?.tips || '-'}
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
                {tReport('detailMerchantCategory')}
              </Typography>
              <Typography variant="subtitle2">
                {selectedData?.merchantCategory || '-'}
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
                {tReport('detailMerchantCriteria')}
              </Typography>
              <Typography variant="subtitle2">
                {selectedData?.merchantCriteria || '-'}
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
                {tReport('detailKycLocation')}
              </Typography>
              <Typography variant="subtitle2">
                {selectedData?.kycLocation || '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
        </Grid>

        <Stack direction="column" spacing={2} sx={{ mt: 4 }}>
          {qrisReportDetailStatus === 'loading' && <LoadingPage />}
          {qrisReportDetailStatus === 'success' &&
            qrisReportDetailData.length === 0 && (
              <EmptyList
                title={tCommon('tableEmptyTitle')}
                // description={tCommon('tableEmptyDescription', {
                //   text: 'activity history request',
                // })}
                description=''
              />
            )}
          {qrisReportDetailStatus === 'success' &&
            qrisReportDetailData.length > 0 && (
              <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
                <Stack direction="column" spacing={2}>
                  <Datatable
                    columns={columns as Column<object>[]}
                    data={qrisReportDetailData}
                    sortBy={sortBy}
                    direction={direction}
                    onSort={handleSort}
                    hideHeaderSort={['description']}
                  />
                </Stack>
              </Card>
            )}
        </Stack>

        {qrisReportDetailStatus === 'success' &&
          qrisReportDetailData.length > 0 && (
            <Stack>
              <Stack
                direction="row"
                spacing={3}
                justifyContent="flex-end"
                alignItems="center"
              >
                {/** @ts-ignore */}
                <Typography variant="subtitle3">{tCommon('exportAs')}</Typography>
                {/* {fileFormats.map(option => (
              <Grid key={option.name}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={option.name}
                      //checked={formatOption === option.name}
                      //onChange={handleCheckboxChange}
                    />
                  }
                  label={
                    <Typography variant="button">{option.label}</Typography>
                  }
                />
              </Grid>
            ))} */}
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  sx={{ borderRadius: 2 }}
                  //onClick={handleExport}
                  //disabled={isLoadingDownload}
                  //loading={isLoadingDownload}
                  loadingPosition="start"
                >
                  {tCommon('actionDownload')}
                </Button>
              </Stack>

              <Typography
                variant="caption"
                textAlign="end"
                sx={{ mt: '0px !important' }}
              //color={errors.effectiveDate ? Token.color.redDark : 'initial'}
              >
                {/* {errors.effectiveDate
              ? errors.effectiveDate?.message
              : tCommon('labelMaxDownload')} */}
              </Typography>
            </Stack>
          )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewQRISReportModal;
