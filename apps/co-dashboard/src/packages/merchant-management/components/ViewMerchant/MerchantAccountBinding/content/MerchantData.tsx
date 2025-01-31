// Cores
import React, { useMemo, useState } from 'react';

// Components
import {
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Pagination,
  Stack,
  Typography
} from '@mui/material';
import {
  Button,
  Datatable,
  EmptyList,
  FormDatePicker,
  LoadingPage,
  PriceCell,
  Token
} from '@woi/web-component';
import { ViewMerchantAccountBindingTabProps } from '../ViewMerchantAccountBindingTab';

// Hooks & Utils
import useTransactionHistoryList from '@src/packages/merchant-management/hooks/useTransactionHistoryList';
import { DateConvert, fileFormats, PriceConverter } from '@woi/core';
import { calculateDateRangeDays } from '@woi/core/utils/date/dateConvert';
import { useRouter } from 'next/router';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';
import { MerchantTransactionHistoryData } from '@woi/service/co/merchant/merchantTransactionHistoryList';
import { Column } from 'react-table';

// Asset
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function MerchantData(props: ViewMerchantAccountBindingTabProps) {
  const { merchantDetail } = props;

  const router = useRouter();
  const { t: tMerchant } = useTranslation('merchant');
  const { t: tCommon } = useTranslation('common');
  const { t: tForm } = useTranslation('form');

  const [show, setShow] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>('PDF');

  const {
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    handleExport,
    transactionHistoryData,
    transactionHistoryStatus,
    formData,
    isLoadingDownload,
  } = useTransactionHistoryList({
    merchantCode: merchantDetail?.merchantCode,
    selectedOption,
  });

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

  const columns: Array<
    Column<MerchantTransactionHistoryData & { action: string; }>
  > = useMemo(
    () => [
      {
        Header: tMerchant('transactionHistoryTableHeaderDate'),
        accessor: 'postDate',
        Cell: ({ row }) => (
          <Typography variant="inherit" key="postDate">
            {DateConvert.stringToDateFormat(
              row.original.postDate,
              LONG_DATE_TIME_FORMAT,
            )}
          </Typography>
        ),
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderMembersPhoneNo'),
        accessor: 'memberPhoneNumber',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="memberPhoneNumber">
            {value !== null ? value : '-'}
          </Typography>
        ),
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderDestination'),
        accessor: 'destination',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="destination">
            {value !== null ? value : '-'}
          </Typography>
        ),
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderAmount'),
        accessor: 'amount',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderCOFee'),
        accessor: 'coFee',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderFeeChargedMember'),
        accessor: 'feeChargedMember',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderFeeChargedMerchant'),
        accessor: 'feeChargedMerchant',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderBalanceGross'),
        accessor: 'balanceGross',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderBalanceNett'),
        accessor: 'balanceNett',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderDebitCredit'),
        accessor: 'dbCr',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="dbCr">
            {value !== null ? value : '-'}
          </Typography>
        ),
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderCurrency'),
        accessor: 'currency',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="currency">
            {value !== null ? value : '-'}
          </Typography>
        ),
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderReferenceNumber'),
        accessor: 'referenceNumber',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="referenceNumber">
            {value !== null ? value : '-'}
          </Typography>
        ),
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderPartnerReferenceNumber'),
        accessor: 'partnerReferenceNumber',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="transactionType">
            {value !== null ? value : '-'}
          </Typography>
        ),
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderTotalAmount'),
        accessor: 'totalAmount',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderStatus'),
        accessor: 'status',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="status">
            {value !== null ? value : '-'}
          </Typography>
        ),
      },
    ],
    [],
  );

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.name);
  };

  return (
    <Stack mb={4}>
      <Grid container spacing={2} rowSpacing={4} sx={{ pt: 4 }}>
        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailMerchantFor')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.merchantFuntionId || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailMerchantName')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.merchantCompleteName || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailNikNib')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.nikOrNib || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailEmailOfMerchant')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.email || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailMerchantAddress')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.address || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailMerchantWebsite')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.webSite || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailPaymentNotifyUrl')}
            </Typography>
            <Typography variant="subtitle2" sx={{ overflowWrap: 'anywhere' }}>
              {merchantDetail?.paymentNotificationUrl || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailSecretKeyClientSecret')}
            </Typography>
            <Typography variant="subtitle2" sx={{ overflowWrap: 'anywhere' }}>
              {merchantDetail?.secretKey || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailClientIdxClientKey')}
            </Typography>
            <Typography variant="subtitle2" sx={{ overflowWrap: 'anywhere' }}>
              {merchantDetail?.clientId || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailUrlAccessTokenB2B')}
            </Typography>
            <Typography variant="subtitle2" sx={{ overflowWrap: 'anywhere' }}>
              {merchantDetail?.authTokenRequestUrl || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailUrlPaymentDirectSuccess')}
            </Typography>
            <Typography variant="subtitle2" sx={{ overflowWrap: 'anywhere' }}>
              {merchantDetail?.urlPaymentDirectSuccess || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailUrlPaymentDirectFailed')}
            </Typography>
            <Typography variant="subtitle2" sx={{ overflowWrap: 'anywhere' }}>
              {merchantDetail?.urlPaymentDirectFailed || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailPublicKey')}
            </Typography>
            <Typography variant="subtitle2" sx={{ overflowWrap: 'anywhere' }}>
              {merchantDetail?.publicKey || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailUrlChannelId')}
            </Typography>
            <Typography variant="subtitle2" sx={{ overflowWrap: 'anywhere' }}>
              {merchantDetail?.channelId || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailMerchantCode')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.merchantCode || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailEffectiveDateFromAndTo')}
            </Typography>
            <Typography variant="subtitle2">
              {`${merchantDetail?.effectiveDateFrom} - ${merchantDetail?.effectiveDateTo}`}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailFee')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.fee || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailProvince')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.addressProvince || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailCity')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.addressCity || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailDistrict')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.addressDistrict || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailVillage')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.addressVillage || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailPostalCode')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.postalCode || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailPhoneNumber')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.phoneNumber ? `${merchantDetail?.countryCode}${merchantDetail?.phoneNumber}` : '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={12} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="body2">
              {tMerchant('detailBalance')}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="subtitle2">
                {Boolean(merchantDetail?.balance)
                  ? PriceConverter.formatPrice(merchantDetail?.balance || 0)
                  : 0}
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
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: '900',
                  alignSelf: 'start',
                }}
                onClick={() => setShow(showProps => !showProps)}
              >
                {`${show
                  ? tMerchant('ActionHideTransactionDetail')
                  : tMerchant('ActionSeeTransactionDetail')
                  }`}
              </Button>
            </Stack>
            <Divider />
          </Stack>
        </Grid>
      </Grid>

      {show && (
        <Stack direction="column" spacing={2} sx={{ mt: 4 }}>
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

          {transactionHistoryStatus === 'loading' && <LoadingPage />}
          {transactionHistoryStatus === 'success' &&
            transactionHistoryData.length === 0 && (
              <EmptyList
                title={tCommon('tableEmptyTitle')}
                description={tMerchant(
                  'emptyMerchantTransactionHistoryDescription',
                )}
              />
            )}

          {transactionHistoryStatus === 'success' &&
            transactionHistoryData.length > 0 && (
              <React.Fragment>
                <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
                  <Stack direction="column" spacing={2}>
                    <Datatable
                      columns={columns as Column<object>[]}
                      data={transactionHistoryData}
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
                          totalShowing: transactionHistoryData.length,
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
                      color={
                        errors.effectiveDate ? Token.color.redDark : 'initial'
                      }
                    >
                      {errors.effectiveDate
                        ? errors.effectiveDate?.message
                        : tCommon('labelMaxDownload')}
                    </Typography>
                  </Stack>
                </Card>
              </React.Fragment>
            )
          }
        </Stack>
      )}
    </Stack>
  );
}

export default MerchantData;
