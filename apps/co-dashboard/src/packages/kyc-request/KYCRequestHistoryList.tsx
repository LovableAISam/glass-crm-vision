// Cores
import React, { useMemo, useState } from 'react';

// Components
import {
  Typography,
  Stack,
  Card,
  TextField,
  Autocomplete,
  Pagination,
  Grid,
} from '@mui/material';
import {
  Button,
  Token,
  Datatable,
  FormDatePicker,
  LoadingPage,
  EmptyList,
  renderOptionCheckbox,
} from '@woi/web-component';
import DownloadIcon from '@mui/icons-material/Download';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import useKycRequestHistoryList from './hooks/useKycRequestHistoryList';
import { KycPremiumMemberHistoryData } from '@woi/service/co/kyc/premiumMember/premiumMemberHistoryList';
import { batch, DateConvert } from '@woi/core';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { Column } from 'react-table';
import ViewKYCRequestModal from './components/ViewKYCRequestModal';
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';
import { KycPremiumMemberStatus } from '@woi/service/co/kyc/premiumMember/premiumMemberList';
import { OptionMap } from '@woi/option';

const KYCRequestHistoryList = () => {
  const [isActive, showModal, hideModal] = useModal();
  const [selectedData, setSelectedData] =
    useState<KycPremiumMemberHistoryData | null>(null);
  const {
    statusOptions,
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    handleDownload,
    kycRequestHistoryData,
    kycRequestHistoryStatus,
    fetchKycRequestHistoryList,
  } = useKycRequestHistoryList();
  const { t: tCommon } = useTranslation('common');
  const { t: tKYC } = useTranslation('kyc');
  const { t: tForm } = useTranslation('form');

  const columns: Array<
    Column<KycPremiumMemberHistoryData & { action: string }>
  > = useMemo(
    () => [
      {
        Header: tKYC('tableHeaderPhoneNumber'),
        accessor: 'phoneNumber',
      },
      {
        Header: tKYC('detailMemberName'),
        accessor: 'fullName',
      },
      {
        Header: tKYC('tableHeaderRequestDate'),
        accessor: 'requestDate',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="requestDate">
            {DateConvert.stringToDateFormat(value, LONG_DATE_TIME_FORMAT)}
          </Typography>
        ),
      },
      {
        Header: tKYC('tableHeaderVerificationDate'),
        accessor: 'verificationDate',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="verificationDate">
            {DateConvert.stringToDateFormat(value, LONG_DATE_TIME_FORMAT)}
          </Typography>
        ),
      },
      {
        Header: tKYC('tableHeaderVerifierName'),
        accessor: 'verifierName',
      },
      {
        Header: tKYC('tableHeaderKYCStatus'),
        accessor: 'status',
        Cell: ({ value }) => {
          let componentToRender;
          if (value === 'STARTED') {
            componentToRender = (
              <Typography variant="inherit" key="status">
                {tKYC('statusStarted')}
              </Typography>
            );
          } else if (value === 'WAITING_TO_REVIEW') {
            componentToRender = (
              <Typography variant="inherit" key="status">
                {tKYC('statusWaitingToReview')}
              </Typography>
            );
          } else if (value === 'REGISTERED') {
            componentToRender = (
              <Typography
                variant="inherit"
                color={Token.color.greenDarker}
                key="status"
              >
                {tKYC('statusRegistered')}
              </Typography>
            );
          } else if (value === 'UNREGISTER') {
            componentToRender = (
              <Typography
                variant="inherit"
                color={Token.color.orangeDark}
                key="status"
              >
                {tKYC('statusUnregister')}
              </Typography>
            );
          } else if (value === 'REJECTED') {
            componentToRender = (
              <Typography
                variant="inherit"
                color={Token.color.orangeDark}
                key="status"
              >
                {tKYC('statusRejected')}
              </Typography>
            );
          } else {
            componentToRender = (
              <Typography variant="inherit" key="status">
                {tKYC('statusUnknown')}
              </Typography>
            );
          }
          return componentToRender;
        },
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack
            direction="row"
            spacing={2}
            key="kycPremiumMemberHistoryAction"
          >
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setSelectedData(row.original);
                showModal();
              }}
            >
              {tKYC('actionViewKYC')}
            </Button>
          </Stack>
        ),
      },
    ],
    [showModal, setSelectedData],
  );

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">{tKYC('pageHistoryTitle')}</Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={3} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tKYC('filterPhoneNumber')}
                </Typography>
                <TextField
                  value={filterForm.phoneNumber}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        phoneNumber: e.target.value,
                      }));
                    });
                  }}
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', {
                    fieldName: 'phone number',
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
            <Grid item xl={3} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tKYC('filterMemberName')}
                </Typography>
                <TextField
                  value={filterForm.fullName}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        fullName: e.target.value,
                      }));
                    });
                  }}
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', {
                    fieldName: 'member name',
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
            <Grid item xl={3} md={6} xs={12}>
              <FormDatePicker
                value={filterForm.verificationDate}
                onChange={value => {
                  batch(() => {
                    setPagination(oldPagination => ({
                      ...oldPagination,
                      currentPage: 0,
                    }));
                    setFilterForm(oldForm => ({
                      ...oldForm,
                      verificationDate: value,
                    }));
                  });
                }}
                title={tKYC('filterDate')}
                size="small"
                placeholder={tForm('placeholderSelect', { fieldName: 'date' })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
            </Grid>
            <Grid item xl={3} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tKYC('filterKYCStatus')}
                </Typography>
                <Autocomplete
                  value={statusOptions.filter(data =>
                    filterForm.status.some(
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
                        status: value as OptionMap<KycPremiumMemberStatus>[],
                      }));
                    });
                  }}
                  options={statusOptions}
                  fullWidth
                  size="small"
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: 'KYC status',
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
        <Stack direction="row" justifyContent="flex-end" alignItems="center">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<DownloadIcon />}
            sx={{ borderRadius: 2 }}
            onClick={handleDownload}
          >
            {tKYC('actionDownloadAllData')}
          </Button>
        </Stack>
        {kycRequestHistoryStatus === 'loading' && <LoadingPage />}
        {kycRequestHistoryStatus === 'success' &&
          kycRequestHistoryData.length === 0 && (
            <EmptyList
              title={tCommon('tableEmptyTitle')}
              description={tCommon('tableEmptyDescription', {
                text: 'KYC History',
              })}
            />
          )}
        {kycRequestHistoryStatus === 'success' &&
          kycRequestHistoryData.length > 0 && (
            <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
              <Stack direction="column" spacing={2}>
                <Datatable
                  columns={columns as Column<object>[]}
                  data={kycRequestHistoryData}
                  sortBy={sortBy}
                  direction={direction}
                  onSort={handleSort}
                  hideHeaderSort={['action']}
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
                      totalShowing: kycRequestHistoryData.length,
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
      {isActive && (
        <ViewKYCRequestModal
          isHistory={true}
          isActive={isActive}
          onHide={hideModal}
          selectedId={selectedData?.premiumMember?.secureId || null}
          fetchKycRequestList={fetchKycRequestHistoryList}
          phoneNumber={selectedData?.premiumMember?.phoneNumber || null}
          memberSecureId={selectedData?.premiumMember?.secureId || null}
        />
      )}
    </Stack>
  );
};

export default KYCRequestHistoryList;
