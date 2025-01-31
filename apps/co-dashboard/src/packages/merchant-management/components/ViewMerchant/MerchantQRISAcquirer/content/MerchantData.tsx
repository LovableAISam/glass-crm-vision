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
  ViewPhotoModal,
} from '@woi/web-component';
import { ViewMerchantQrisAcquirerTabProps } from '../ViewMerchantQrisAcquirerTab';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import { DateConvert, fileFormats, PriceConverter } from '@woi/core';
import { calculateDateRangeDays } from '@woi/core/utils/date/dateConvert';
import { useRouter } from 'next/router';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import useTransactionHistoryList from '@src/packages/merchant-management/hooks/useTransactionHistoryList';

// Types & Consts
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';
import { MerchantTransactionHistoryData } from '@woi/service/co/merchant/merchantTransactionHistoryList';
import { Column } from 'react-table';

// Asset
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function MerchantData(props: ViewMerchantQrisAcquirerTabProps) {
  const { merchantDetail, qrContent } = props;

  const router = useRouter();
  const { t: tMerchant } = useTranslation('merchant');
  const { t: tCommon } = useTranslation('common');
  const { t: tForm } = useTranslation('form');

  const [show, setShow] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>('PDF');
  const [isActiveView, showModalView, hideModalView] = useModal();

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
        Header: tMerchant('transactionHistoryTableHeaderQRType'),
        accessor: 'qrType',
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderMembersPhoneNo'),
        accessor: 'memberPhoneNumber',
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderDestination'),
        accessor: 'destination',
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderIssuer'),
        accessor: 'issuer',
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderAmount'),
        accessor: 'amount',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderMDR'),
        accessor: 'mdr',
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderTips'),
        accessor: 'tips',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderDebitCredit'),
        accessor: 'transactionCategory',
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderCurrency'),
        accessor: 'currency',
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderBalance'),
        accessor: 'balanceAfterTransaction',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderRRN'),
        accessor: 'rrn',
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderStatus'),
        accessor: 'status',
      },
      {
        Header: tMerchant('transactionHistoryTableHeaderAction'),
        accessor: 'action',
        Cell: () => (
          <Stack direction="row" spacing={2} key="merchantAction">
            <Button variant="text" size="small">
              {tCommon('tableActionPrint')}
            </Button>
            <Box>
              <Divider orientation="vertical" />
            </Box>
            <Button variant="text" size="small">
              {tCommon('tableActionDetail')}
            </Button>
          </Stack>
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
      <Grid container spacing={2} rowSpacing={4} sx={{ pt: 4 }}> <>
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
              {tMerchant('detailMerchantBrandOrOwnerName')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.merchantBrand || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailDateOfBirth')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.birthDate || '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailAddress')}
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
              {tMerchant('detailTelephoneOrHP')}
            </Typography>
            <Typography variant="subtitle2">
              {merchantDetail?.phoneNumber ? `${merchantDetail?.countryCode}${merchantDetail?.phoneNumber}` : '-'}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body2">
              {tMerchant('detailPostCode')}
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
              {tMerchant('detailBalance')}
            </Typography>
            <Typography variant="subtitle2">
              {Boolean(merchantDetail?.balance)
                ? PriceConverter.formatPrice(merchantDetail?.balance || 0)
                : 0}
            </Typography>
            <Divider />
          </Stack>
        </Grid>

        {merchantDetail?.qrType === 'Static' && (
          <Grid item md={12} xs={12} textAlign="center">
            <Button
              size="small"
              variant="text"
              sx={{
                width: 120,
                textTransform: 'none',
                mt: '8px !important',
              }}
              onClick={() => {
                showModalView();
              }}
            >
              {tMerchant('actionShowQR')}
            </Button>
          </Grid>
        )}
      </>

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
            )}
        </Stack>
      )}

      <ViewPhotoModal
        title={tMerchant('detailQRCode')}
        isActive={isActiveView}
        onHide={hideModalView}
        selectedFile={null}
        qrData={qrContent}
      />
    </Stack>
  );
}

export default MerchantData;
