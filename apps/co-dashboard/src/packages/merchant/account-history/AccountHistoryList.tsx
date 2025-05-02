// Cores
import React, { useMemo } from 'react';

// Components
import DownloadIcon from '@mui/icons-material/Download';
import {
  Autocomplete,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Button,
  Datatable,
  EmptyList,
  FormDatePicker,
  LoadingPage,
  PriceCell,
  renderOptionCheckbox,
  Token,
} from '@woi/web-component';
import { useRouter } from 'next/router';
import { Column } from 'react-table';
import ViewAccountRefundDetailModal from './components/ViewAccountRefundDetailModal';
import ViewMerchantDetailTab from './components/ViewMerchantDetailTab';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import { batch, DateConvert, fileFormats } from '@woi/core';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import useAccountHistoryList from './hooks/useAccountHistoryList';
import { calculateDateRangeDays } from '@woi/core/utils/date/dateConvert';

// Types & Consts
import { LONG_DATE_TIME_FORMAT } from "@woi/core/utils/date/constants";
import { OptionMap } from '@woi/option';
import { MerchantAccountHistory } from '@woi/service/co/merchant/merchantAccountHistoryList';

const AccountHistoryList = () => {
  const router = useRouter();

  const [isActiveDetail, showModalDetail, hideModalDetail] = useModal();
  const [isActiveRefund, showModalRefund, hideModalRefund] = useModal();

  const {
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    accountHistoryData,
    accountHistoryStatus,
    qrTypeOptions,
    handleExport,
    formData,
    dbCrOptions,
    formatOption,
    setFormatOption,
    filterForm,
    setFilterForm,
    iframeRef,
    accountHistoryDetail,
    refundReasonTypeOptions,
    fetchAccountHistoryPrint,
    fetchAccountHistoryDetail,
    merchantCode,
    selectData,
    setSelectData,
    fetchAccountHistory
  } = useAccountHistoryList({ showModalDetail });
  const { t: tCommon } = useTranslation('common');
  const { t: tAccount } = useTranslation('account');
  const { t: tForm } = useTranslation('form');

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormatOption(event.target.name);
  };

  const {
    formState: { errors },
    control,
    clearErrors,
    setValue,
    trigger,
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

  const columns: Array<Column<MerchantAccountHistory & { action: string; }>> =
    useMemo(
      () => merchantCode.startsWith('ME') ? [
        {
          Header: tAccount('tableHeaderDate'),
          accessor: 'date',
          Cell: ({ value }) => (
            <Typography data-testid="dateTime" variant="inherit" key="dateTime">
              {DateConvert.stringToDateFormat(value, LONG_DATE_TIME_FORMAT)}
            </Typography>
          ),
        },
        {
          Header: tAccount('tableHeaderQRType'),
          accessor: 'qrType',
          Cell: ({ value }) => (
            <Typography variant="inherit">
              {value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : '-'}
            </Typography>
          ),
        },
        {
          Header: tAccount('tableHeaderMembersPhoneNo'),
          accessor: 'phoneNumber',
          Cell: ({ value }) => (
            <Typography variant="inherit" >
              {value === null ? '-' : value}
            </Typography>
          ),
        },
        {
          Header: tAccount('tableHeaderDestination'),
          accessor: 'destination',
          Cell: ({ value }) => (
            <Typography variant="inherit" >
              {value === null ? '-' : value}
            </Typography>
          ),
        },
        {
          Header: tAccount('tableHeaderIssuer'),
          accessor: 'issuer',
          Cell: ({ value }) => (
            <Typography variant="inherit" >
              {value === null ? '-' : value}
            </Typography>
          ),
        },
        {
          Header: tAccount('tableHeaderAmount'),
          accessor: 'amount',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tAccount('tableHeaderMDR'),
          accessor: 'mdr',
          Cell: ({ value }) => (
            <Typography variant="inherit" >
              {value === null ? '-' : value}
            </Typography>
          ),
        },
        {
          Header: tAccount('tableHeaderTips'),
          accessor: 'tips',
          Cell: ({ value }) => (
            <Typography variant="inherit" >
              {value === null ? '-' : value}
            </Typography>
          ),
        },
        {
          Header: tAccount('tableHeaderDebitCredit'),
          accessor: 'debitCredit',
          Cell: ({ value }) => (
            <Typography variant="inherit" >
              {value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : '-'}
            </Typography>
          ),
        },
        {
          Header: tAccount('tableHeaderCurrency'),
          accessor: 'currency',
          Cell: ({ value }) => (
            <Typography variant="inherit" >
              {value === null ? '-' : value}
            </Typography>
          ),
        },
        {
          Header: tAccount('tableHeaderBalance'),
          accessor: 'balance',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tAccount('tableHeaderRRN'),
          accessor: 'rrn',
          Cell: ({ value }) => (
            <Typography variant="inherit" >
              {value === null ? '-' : value}
            </Typography>
          ),
        },
        {
          Header: tAccount('tableHeaderStatus'),
          accessor: 'status',
          Cell: ({ value }) => (
            <Typography variant="inherit" >
              {value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : '-'}
            </Typography>
          ),
        },
        {
          Header: tCommon('tableHeaderAction'),
          accessor: 'action',
          Cell: ({ row }) => (
            <Stack direction="row" spacing={2} key="billerAction">
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  fetchAccountHistoryPrint(row.original);
                  const iframe = iframeRef.current;
                  if (iframe) {
                    iframe.onload = () => {
                      iframe.contentWindow?.focus();
                      iframe.contentWindow?.print();
                    };
                  }
                }}
              >
                {tCommon('tableActionPrint')}
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={() => fetchAccountHistoryDetail(row.original.id)}
              >
                {tCommon('tableActionDetail')}
              </Button>
              {new Date() <= new Date(new Date(row.original.date).setDate(new Date(row.original.date).getDate() + 1))
                && row.original.status !== "REFUNDED" && (
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      setSelectData(row.original);
                      showModalRefund();
                    }}
                  >
                    {tCommon('tableActionRefund')}
                  </Button>
                )}
            </Stack>
          ),
        },
      ] : merchantCode.startsWith('MAC') ? [{
        Header: tAccount('tableHeaderDate'),
        accessor: 'date',
        Cell: ({ value }) => (
          <Typography data-testid="dateTime" variant="inherit" key="dateTime">
            {DateConvert.stringToDateFormat(value, LONG_DATE_TIME_FORMAT)}
          </Typography>
        ),
      },
      {
        Header: tAccount('tableHeaderMembersPhoneNo'),
        accessor: 'phoneNumber',
        Cell: ({ value }) => (
          <Typography variant="inherit" >
            {value === null ? '-' : value}
          </Typography>
        ),
      },
      {
        Header: tAccount('tableHeaderDestination'),
        accessor: 'destination',
        Cell: ({ value }) => (
          <Typography variant="inherit" >
            {value === null ? '-' : value}
          </Typography>
        ),
      },
      {
        Header: tAccount('tableHeaderAmount'),
        accessor: 'amount',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tAccount('tableHeaderCOFee'),
        accessor: 'coFee',
        Cell: ({ value }) => (
          <Typography variant="inherit" >
            {value === null ? '-' : value}
          </Typography>
        ),
      },
      {
        Header: tAccount('tableHeaderFeeChargedMember'),
        accessor: 'feeChargedMember',
        Cell: ({ value }) => (
          <Typography variant="inherit" >
            {value === null ? '-' : value}
          </Typography>
        ),
      },
      {
        Header: tAccount('tableHeaderFeeChargedMerchant'),
        accessor: 'feeChargedMerchant',
        Cell: ({ value }) => (
          <Typography variant="inherit" >
            {value === null ? '-' : value}
          </Typography>
        ),
      },
      {
        Header: tAccount('tableHeaderTotalAmount'),
        accessor: 'totalAmount',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tAccount('tableHeaderBalanceGross'),
        accessor: 'balanceGross',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tAccount('tableHeaderBalanceNett'),
        accessor: 'balanceNett',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tAccount('tableHeaderDebitCredit'),
        accessor: 'debitCredit',
        Cell: ({ value }) => (
          <Typography variant="inherit" >
            {value === null ? '-' : value}
          </Typography>
        ),
      },
      {
        Header: tAccount('tableHeaderCurrency'),
        accessor: 'currency',
        Cell: ({ value }) => (
          <Typography variant="inherit" >
            {value === null ? '-' : value}
          </Typography>
        ),
      },
      {
        Header: tAccount('tableHeaderReferenceNumber'),
        accessor: 'referenceNumber',
        Cell: ({ value }) => (
          <Typography variant="inherit" >
            {value === null ? '-' : value}
          </Typography>
        ),
      },
      {
        Header: tAccount('tableHeaderPartnerReferenceNumber'),
        accessor: 'partnerReferenceNumber',
        Cell: ({ value }) => (
          <Typography variant="inherit" >
            {value === null ? '-' : value}
          </Typography>
        ),
      },
      {
        Header: tAccount('tableHeaderStatus'),
        accessor: 'status',
        Cell: ({ value }) => (
          <Typography variant="inherit" >
            {value === null ? '-' : value}
          </Typography>
        ),
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="billerAction">
            <Button
              variant="text"
              size="small"
              onClick={() => {
                fetchAccountHistoryPrint(row.original);
                const iframe = iframeRef.current;
                if (iframe) {
                  iframe.onload = () => {
                    iframe.contentWindow?.focus();
                    iframe.contentWindow?.print();
                  };
                }
              }}
            >
              {tCommon('tableActionPrint')}
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => {
                fetchAccountHistoryDetail(row.original.id);
              }}
            >
              {tCommon('tableActionDetail')}
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setSelectData(row.original);
                showModalRefund();
              }}
            >
              {tCommon('tableActionRefund')}
            </Button>
          </Stack>
        ),
      }] : [],
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
            {tAccount('pageTitleAccountHistory')}
          </Typography>
        </Stack>
        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: '0px 2px 12px rgba(137, 168, 191, 0.15)',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Stack direction="column" spacing={1}>
                  <FormDatePicker
                    {...fieldEffectiveDate}
                    title={tAccount('tableHeaderDate')}
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
                            effectiveDate: value,
                          }));
                          fieldEffectiveDate.onChange(value);
                        } else {
                          setValue('effectiveDate', value);
                          trigger('effectiveDate');
                        }
                      });
                    }}
                    size="small"
                    placeholder={tForm('placeholderSelect', {
                      fieldName: tForm('dateFieldType'),
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
                </Stack>
              </Stack>
            </Grid>
            {/* QR Type Filter only on QRIS Acquirer */}
            {merchantCode.startsWith('ME') &&
              <Grid item xl={4} md={6} xs={12}>
                <Stack direction="column" spacing={1}>
                  <Typography variant="subtitle2">
                    {tAccount('filterQrType')}
                  </Typography>
                  <Autocomplete
                    value={qrTypeOptions.filter(data =>
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
                          transactionType: value as OptionMap<string>[],
                        }));
                      });
                    }}
                    options={qrTypeOptions}
                    fullWidth
                    size="small"
                    renderInput={params => (
                      <TextField
                        {...params}
                        placeholder={tForm('placeholderSelect', {
                          fieldName: 'QR type',
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
            }
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tAccount('filterDebitOrCredit')}
                </Typography>
                <Autocomplete
                  value={dbCrOptions.filter(data =>
                    filterForm.dbCr.some(filter => filter.value === data.value),
                  )}
                  onChange={(_, value) => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        dbCr: value as OptionMap<string>[],
                      }));
                    });
                  }}
                  options={dbCrOptions}
                  fullWidth
                  size="small"
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'debit / credit',
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

        {accountHistoryStatus === 'loading' && <LoadingPage />}

        {accountHistoryStatus === 'success' &&
          accountHistoryData.length === 0 && (
            <EmptyList
              title={tCommon('tableEmptyTitle')}
              description={tAccount('emptyAccountHistoryDescription')}
              grayscale
            />
          )}

        {accountHistoryStatus === 'success' && accountHistoryData.length > 0 && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={accountHistoryData}
                sortBy={sortBy}
                direction={direction}
                onSort={handleSort}
                hideHeaderSort={[
                  'action',
                  'balance',
                  'coName',
                  'loyaltyStatus',
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
                    totalShowing: accountHistoryData.length,
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
              <Typography
                variant="caption"
                textAlign="end"
                sx={{ mt: '0px !important' }}
                color={errors.effectiveDate ? Token.color.redDark : 'initial'}
              >
                {errors.effectiveDate
                  ? errors.effectiveDate?.message
                  : tCommon('labelMaxDownload')}
              </Typography>
            </Stack>
          </Card>
        )}
      </Stack>

      {isActiveDetail && (
        <ViewMerchantDetailTab
          isActive={isActiveDetail}
          onHide={hideModalDetail}
          accountHistoryDetail={accountHistoryDetail}
          merchantCode={merchantCode}
        />
      )}

      {isActiveRefund && (
        <ViewAccountRefundDetailModal
          isActive={isActiveRefund}
          onHide={hideModalRefund}
          refundReasonOptions={refundReasonTypeOptions}
          selectData={selectData}
          fetchAccountHistory={fetchAccountHistory}
        />
      )}
    </Stack>
  );
};

export default AccountHistoryList;
