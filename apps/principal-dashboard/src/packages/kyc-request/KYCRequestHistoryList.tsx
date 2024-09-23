// Cores
import React, { useMemo, useState } from 'react';
import { batch, DateConvert } from '@woi/core';

// Components
import { Typography, Stack, Card, TextField, Autocomplete, Pagination, Grid } from '@mui/material';
import { Button, Token, Datatable, FormDatePicker, LoadingPage, EmptyList, renderOptionCheckbox } from '@woi/web-component';
import DownloadIcon from '@mui/icons-material/Download';
import ViewKYCRequestModal from './components/ViewKYCRequestModal';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import useKycRequestHistoryList from './hooks/useKycRequestHistoryList';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { Column } from 'react-table';
import { KycPremiumMemberHistoryData, KycPremiumMemberStatus } from '@woi/service/principal/kyc/premiumMember/premiumMemberHistoryList';
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';
import { OptionMap } from '../content-management/hooks/useContentManagementUpsert';

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
    kycRequestData,
    kycRequestStatus,
    fetchKycRequestList,
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
        accessor: 'premiumMember',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="requestDate">
            {DateConvert.stringToDateFormat(value?.createdDate, LONG_DATE_TIME_FORMAT)}
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
          if (value === 'UNREGISTERED')
            return (
              <Typography variant="inherit">{tKYC('statusUnregistered')}</Typography>
            );
          if (value === 'WAITING_TO_REVIEW')
            return (
              <Typography variant="inherit">
                {tKYC('statusWaitingToVerify')}
              </Typography>
            );
          if (value === 'PREMIUM')
            return <Typography variant="inherit">{tKYC('statusApproved')}</Typography>;
          if (value === 'REJECTED')
            return <Typography variant="inherit">{tKYC('statusRejected')}</Typography>;
          return <Typography variant="inherit">-</Typography>;
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
                  placeholder={tForm('placeholderType', { fieldName: 'phone number' })}
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
                <Typography variant="subtitle2">{tKYC('filterMemberName')}</Typography>
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
                  placeholder={tForm('placeholderType', { fieldName: 'member name' })}
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
                <Typography variant="subtitle2">{tKYC('filterKYCStatus')}</Typography>
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
                      placeholder={tForm('placeholderSelect', { fieldName: 'KYC status' })}
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
        {kycRequestStatus === 'loading' && <LoadingPage />}
        {kycRequestStatus === 'success' && kycRequestData.length === 0 && (
          <EmptyList
            title={tCommon('tableEmptyTitle')}
            description={tCommon('tableEmptyDescription', {
              text: 'KYC History',
            })}
          />
        )}
        {kycRequestStatus === 'success' && kycRequestData.length > 0 && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={kycRequestData}
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
                    totalShowing: kycRequestData.length,
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
          fetchKycRequestList={fetchKycRequestList}
        />
      )}
    </Stack>
  );
}

export default KYCRequestHistoryList;