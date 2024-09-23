import React, { useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  IconButton,
  Grid,
  Card,
  Pagination,
  Button,
  Divider,
  Autocomplete,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { MemberData } from '@woi/service/co/idp/member/memberList';
import { useTranslation } from 'react-i18next';
import { DateConvert, PriceConverter, batch } from '@woi/core';
import {
  Datatable,
  EmptyList,
  FormDatePicker,
  LoadingPage,
  PriceCell,
  Token,
  renderOptionCheckbox,
} from '@woi/web-component';
import useMemberSummaryDetail from '../hooks/useMemberSummaryDetail';
import { useRouter } from 'next/router';
import { Column } from 'react-table';
import {
  LONG_DATE_TIME_FORMAT,
  MEDIUM_DATE_FORMAT,
} from '@woi/core/utils/date/constants';
import { OptionMap } from '@woi/option';
import {
  MemberSummaryTransaction,
  MemberTransactionType,
} from '@woi/service/co/admin/report/membersummaryDetail';
import { fileFormats } from '@woi/service/co/transaction/transactionHistory/memberTransactionHistoryExport';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';

type ViewMemberSummaryModalProps = {
  isActive: boolean;
  onHide: () => void;
  selectedData: MemberData;
  fetchMemberList: () => void;
};

const ViewMemberSummaryModal = (props: ViewMemberSummaryModalProps) => {
  const { isActive, onHide, selectedData } = props;

  const router = useRouter();
  const { t: tReport } = useTranslation('report');
  const { t: tCommon } = useTranslation('common');
  const { t: tKYC } = useTranslation('kyc');
  const { t: tForm } = useTranslation('form');

  const [formatOption, setFormatOption] = useState<string>('PDF');

  const {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    handleExport,
    memberSummaryTransaction,
    memberSummaryTransactionStatus,
    memberSummaryDetail,
    transactionTypeOptions,
  } = useMemberSummaryDetail({ selectedData, formatOption });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormatOption(event.target.name);
  };

  const displayStatus = useMemo(() => {
    if (memberSummaryDetail?.status === 'UNREGISTER') {
      return tReport('statusUnregister');
    } else if (memberSummaryDetail?.status === 'WAITING_TO_REVIEW') {
      return tReport('statusRegister');
    }
    return '-';
  }, [memberSummaryDetail?.status]);

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

  const columns: Array<Column<MemberSummaryTransaction>> = useMemo(
    () => [
      {
        Header: tReport('tableHeaderDate'),
        accessor: 'date',
        Cell: ({ row }) => (
          <Typography variant="inherit" key="date">
            {DateConvert.stringToDateFormat(
              row.original.date,
              LONG_DATE_TIME_FORMAT,
            )}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderTransactionType'),
        accessor: 'transactionType',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="transactionType">
            {getTransactionTypeString(value)}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderVASource'),
        accessor: 'vaSource',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="vaSource">
            {value || '-'}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderRMNumber'),
        accessor: 'rmNumber',
      },
      {
        Header: tReport('tableHeaderVADest'),
        accessor: 'vaDest',
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
            {capitalizeWords(value)}
          </Typography>
        ),
      },
      {
        Header: tKYC('accountInformationTableHeaderBalance'),
        accessor: 'balance',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tReport('tableHeaderDrCr'),
        accessor: 'category',
      },
      {
        Header: tReport('tableHeaderReferralNumber'),
        accessor: 'referalNumber',
      },
      {
        Header: tReport('tableHeaderSecondaryIdentifier'),
        accessor: 'secondaryIdentifier',
      },
      {
        Header: tReport('tableHeaderTraceNumber'),
        accessor: 'traceNumber',
      },
      {
        Header: tReport('tableHeaderBillerFee'),
        accessor: 'billerFee',
      },
      {
        Header: tReport('tableHeaderTotalAmount'),
        accessor: 'totalAmount',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
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
                {tReport('detailToday')}
              </Typography>
              <Typography variant="subtitle2">
                {DateConvert.stringToDateFormat(
                  memberSummaryDetail?.today,
                  MEDIUM_DATE_FORMAT,
                ) || '-'}
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
                {tReport('detailDate')}
              </Typography>
              <Typography variant="subtitle2">
                {memberSummaryDetail?.date || '-'}
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
                {tReport('detailName')}
              </Typography>
              <Typography variant="subtitle2">
                {memberSummaryDetail?.name || '-'}
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
                {tReport('detailVANumber')}
              </Typography>
              <Typography variant="subtitle2">
                {memberSummaryDetail?.vaNumber || '-'}
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
                {tReport('detailBalance')}
              </Typography>
              <Typography variant="subtitle2">
                {PriceConverter.formatPrice(
                  memberSummaryDetail?.balance || 0,
                  router.locale,
                ) || '-'}
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
                {displayStatus || '-'}
              </Typography>
              <Divider />
            </Stack>
          </Grid>
        </Grid>

        <Stack direction="column" spacing={2} sx={{ mt: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12} sx={{ pl: '0px !important' }}>
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
                size="medium"
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
            <Grid item xl={4} md={6} xs={12} sx={{ pr: '16px' }}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tReport('filterTransactionType')}
                </Typography>
                <Autocomplete
                  value={transactionTypeOptions.filter(data =>
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
                        transactionType:
                          value as OptionMap<MemberTransactionType>[],
                      }));
                    });
                  }}
                  options={transactionTypeOptions}
                  fullWidth
                  size="medium"
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'transaction type',
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
          {memberSummaryTransactionStatus === 'loading' && <LoadingPage />}
          {memberSummaryTransactionStatus === 'success' &&
            memberSummaryTransaction.length === 0 && (
              <EmptyList
                title={tCommon('tableEmptyNotFound')}
                description=""
                grayscale
              />
            )}
          {memberSummaryTransactionStatus === 'success' &&
            memberSummaryTransaction.length > 0 && (
              <React.Fragment>
                <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
                  <Stack direction="column" spacing={2}>
                    <Datatable
                      columns={columns as Column<object>[]}
                      data={memberSummaryTransaction}
                      sortBy={sortBy}
                      direction={direction}
                      onSort={handleSort}
                      hideHeaderSort={[
                        'description',
                        'balance',
                        'action',
                        'referalNumber',
                        'billerFee',
                        'totalAmount',
                        'traceNumber',
                        'secondaryIdentifier',
                        'bnisorc',
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
                          totalShowing: memberSummaryTransaction.length,
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
                            checked={formatOption === option.name}
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
      </DialogContent>
    </Dialog>
  );
};

export default ViewMemberSummaryModal;
