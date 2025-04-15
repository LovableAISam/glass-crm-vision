// Cores
import React, { useMemo, useState } from 'react';

// Components
import {
  Typography,
  Stack,
  Card,
  Pagination,
  Grid,
  Autocomplete,
  TextField,
  Chip,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Button,
  Token,
  Datatable,
  EmptyList,
  LoadingPage,
  FormDatePicker,
  renderOptionCheckbox,
  PriceCell,
} from '@woi/web-component';
import ViewQRISReportModal from './components/ViewQRISReportModal';
import { Column } from 'react-table';
import { useRouter } from 'next/router';
import { OptionMap } from '@woi/option';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import useQRISReportList from './hooks/useQRISReportList';
import { batch, DateConvert, fileFormats } from '@woi/core';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { QRISReport } from '@woi/service/co/admin/report/qrisReport';
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';
import {
  calculateDateRangeDays,
  stringToDateFormat,
} from '@woi/core/utils/date/dateConvert';
import { useController } from 'react-hook-form';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';

const QRISReportList = () => {
  const router = useRouter();

  const [formatOption, setFormatOption] = useState<string>('PDF');

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormatOption(event.target.name);
  };

  const {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    qrisReportData,
    qrisReportStatus,
    handleExport,
    kycTypeOptions,
    merchantCriteriaTypeOptions,
    qrTypeOptions,
    qrisTypeOptions,
    //qrLocationTypeOptions,
    merchantCategoryTypeOptions,
    handleDeleteFilter,
    isLoadingDownload,
    formData,
  } = useQRISReportList({ formatOption });
  const [isActive, showModal, hideModal] = useModal();
  const { t: tCommon } = useTranslation('common');
  const { t: tReport } = useTranslation('report');
  const { t: tForm } = useTranslation('form');
  const [selectedData, setSelectedData] = useState<QRISReport | null>(null);

  // const getTransactionTypeString = (transactionType: string): string => {
  //   const typeMapping: Record<string, string> = {
  //     ADD_MONEY_VIA_NG: tReport('optionAddMoneyViaNG'),
  //     ADD_MONEY_VIA_SAVING_ACCOUNT: tReport('optionAddMoneySaving'),
  //     SEND_MONEY: tReport('optionSendMoney'),
  //     REQUEST_MONEY: tReport('optionRequestMoney'),
  //     ADD_MONEY_P2P: tReport('optionP2PIncoming'),
  //     P2M_SCAN_TO_PAY: tReport('optionPaytoMerchant'),
  //     P2P_OUTGOING_SEND_TO_BANK: tReport('optionP2POutgoing'),
  //     CASHOUT_TO_BPI: tReport('optionCashoutToBpi'),
  //     PAYBILLS_ECPAY: tReport('optionPaybills'),
  //     CARDLESS_WITHDRAWAL: tReport('optionCardLessWithdrawal'),
  //     BALANCE_CORRECTION: tReport('optionBalanceCorrection'),
  //   };
  //   return typeMapping[transactionType] || transactionType;
  // };

  const {
    formState: { errors },
    control,
    clearErrors,
    trigger,
    setValue,
    reset,
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

  const columns: Array<Column<QRISReport & { action: string; }>> = useMemo(
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
        Header: tReport('tableHeaderQrType'),
        accessor: 'qrType',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="qrType">
            {value || '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderIssuer'),
        accessor: 'issuer',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="issuer">
            {value || '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderFrom'),
        accessor: 'vaSource',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="vaSource">
            {value || '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderTo'),
        accessor: 'vaDestination',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="vaDestination">
            {value || '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderMerchantName'),
        accessor: 'merchantName',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="merchantName">
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
        Header: tReport('tableHeaderStatus'),
        accessor: 'status',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="status">
            {value || '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderTransactionNumber'),
        accessor: 'transactionNumber',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="transactionNumber">
            {value || '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderQrisLocation'),
        accessor: 'qrisLocation',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="qrisLocation">
            {value || '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderKycLocation'),
        accessor: 'kycLocation',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="kycLocation">
            {value || '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderMerchantCategory'),
        accessor: 'merchantCategory',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="merchantCategory">
            {value || '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderMerchantCriteria'),
        accessor: 'merchantCriteria',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="merchantCriteria">
            {value || '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="userAction">
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setSelectedData(row.original);
                showModal();
              }}
            >
              {tCommon('tableActionDetail')}
            </Button>
          </Stack>
        ),
      },
    ],
    [showModal],
  );

  const renderFilter = () => {
    return Object.entries(filterForm).map(([key, value]) => {
      switch (key as keyof typeof filterForm) {
        case 'endAt': {
          const filterValue = value as typeof filterForm.endAt;
          if (!filterValue.startDate || !filterValue.endDate) return null;
          return (
            <Chip
              variant="outlined"
              key={key}
              label={`${key}: ${stringToDateFormat(
                filterValue.startDate,
              )} - ${stringToDateFormat(filterValue.endDate)}`}
              color="primary"
              deleteIcon={<CloseIcon />}
              onDelete={() => {
                reset();
                handleDeleteFilter(key, []);
              }}
              sx={{
                '& .MuiChip-label': {
                  textTransform: 'uppercase',
                },
              }}
            />
          );
        }
        case 'merchantName': {
          const filterValue = value as string;
          if (!filterValue) return null;
          return (
            <Chip
              variant="outlined"
              label={`${key}: ${filterValue}`}
              color="primary"
              deleteIcon={<CloseIcon />}
              onDelete={() => handleDeleteFilter(key, '')}
              sx={{
                '& .MuiChip-label': {
                  textTransform: 'uppercase',
                },
              }}
            />
          );
        }
        case 'transactionType':
        case 'qrisType':
        case 'qrType':
        case 'qrisLocation':
        case 'kycLocation':
        case 'merchantCategoryCode':
        case 'merchantCriteria': {
          const filterValue = value as typeof merchantCriteriaTypeOptions;
          if (filterValue.length === 0) return null;
          return (
            <Chip
              variant="outlined"
              label={`${key}: ${filterValue
                .map(filter => filter.label)
                .join(', ')}`}
              color="primary"
              deleteIcon={<CloseIcon />}
              onDelete={() => handleDeleteFilter(key, [])}
              sx={{
                '& .MuiChip-label': {
                  textTransform: 'uppercase',
                },
              }}
            />
          );
        }
      }
    });
  };

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">{tReport('pageTitleQrisReport')}</Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <FormDatePicker
                {...fieldEffectiveDate}
                title={tForm('dateFieldLabel')}
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
                        endAt: value,
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
            </Grid>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tReport('filterQrType')}
                </Typography>
                <Autocomplete
                  value={qrTypeOptions?.filter(data =>
                    filterForm?.qrType.some(
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
                        qrType: value as OptionMap<string>[],
                      }));
                    });
                  }}
                  options={qrTypeOptions || []}
                  fullWidth
                  size="small"
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'QR Type',
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
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tReport('filterQrisType')}
                </Typography>
                <Autocomplete
                  value={qrisTypeOptions?.filter(data =>
                    filterForm?.qrisType.some(
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
                        qrisType: value as OptionMap<string>[],
                      }));
                    });
                  }}
                  options={qrisTypeOptions || []}
                  fullWidth
                  size="small"
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'QRIS Type',
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
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tReport('qrisLocation')}
                </Typography>
                <Autocomplete
                  value={kycTypeOptions.filter(data =>
                    filterForm.qrisLocation.some(
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
                        qrisLocation: value as OptionMap<string>[],
                      }));
                    });
                  }}
                  options={kycTypeOptions}
                  fullWidth
                  size="small"
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'QRIS Location',
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
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tReport('filterKycLocation')}
                </Typography>
                <Autocomplete
                  value={kycTypeOptions.filter(data =>
                    filterForm.kycLocation.some(
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
                        kycLocation: value as OptionMap<string>[],
                      }));
                    });
                  }}
                  options={kycTypeOptions}
                  fullWidth
                  size="small"
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'KYC Location',
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
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tReport('filterMerchantName')}
                </Typography>
                <TextField
                  value={filterForm.merchantName}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        merchantName: e.target.value,
                      }));
                    });
                  }}
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', {
                    fieldName: tReport('typeMerchantName'),
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  size="small"
                />
              </Stack>
            </Grid>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tReport('filterMerchantCategoryCode')}
                </Typography>
                <Autocomplete
                  value={merchantCategoryTypeOptions.filter(data =>
                    filterForm.merchantCategoryCode.some(
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
                        merchantCategoryCode: value as OptionMap<string>[],
                      }));
                    });
                  }}
                  options={merchantCategoryTypeOptions}
                  fullWidth
                  size="small"
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'Merchant Category Code',
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
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tReport('filterMerchantCriteria')}
                </Typography>
                <Autocomplete
                  value={merchantCriteriaTypeOptions.filter(data =>
                    filterForm.merchantCriteria.some(
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
                        merchantCriteria: value as OptionMap<string>[],
                      }));
                    });
                  }}
                  options={merchantCriteriaTypeOptions}
                  fullWidth
                  size="small"
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'Merchant Criteria',
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

        <Stack direction="row" spacing={2}>
          {renderFilter()}
        </Stack>

        {qrisReportStatus === 'loading' && <LoadingPage />}

        {qrisReportStatus === 'success' && qrisReportData.length === 0 && (
          <EmptyList
            title={tCommon('tableEmptyTitle')}
            description={tCommon('tableEmptyDescription', {
              text: 'CO Transaction Summary',
            })}
            grayscale
          />
        )}

        {qrisReportStatus === 'success' && qrisReportData.length > 0 && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={qrisReportData}
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
                    totalShowing: qrisReportData.length,
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
      {selectedData && isActive && (
        <ViewQRISReportModal
          isActive={isActive}
          onHide={hideModal}
          selectedData={selectedData}
        />
      )}
    </Stack>
  );
};

export default QRISReportList;
