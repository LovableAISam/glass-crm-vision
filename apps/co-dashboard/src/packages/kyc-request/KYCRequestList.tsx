// Cores
import React, { useEffect, useMemo, useState } from 'react';

// Components
import {
  Typography,
  Stack,
  Card,
  TextField,
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
} from '@woi/web-component';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import useKycRequestList from './hooks/useKycRequestList';
import { batch, DateConvert } from '@woi/core';
import useMenuPrivilege from '@src/shared/hooks/useMenuPrivilege';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { Column } from 'react-table';
import ViewKYCRequestModal from './components/ViewKYCRequestModal';
import { KycPremiumMemberData } from '@woi/service/co/kyc/premiumMember/premiumMemberList';
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';

const KYCRequestList = () => {
  const [isActive, showModal, hideModal] = useModal();
  const [selectedData, setSelectedData] = useState<KycPremiumMemberData | null>(
    null,
  );
  const { checkAuthority } = useMenuPrivilege();
  const {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    kycRequestData,
    kycRequestStatus,
    fetchKycRequestList,
  } = useKycRequestList();
  const { t: tCommon } = useTranslation('common');
  const { t: tKYC } = useTranslation('kyc');
  const { t: tForm } = useTranslation('form');

  const columns: Array<Column<KycPremiumMemberData & { action: string; }>> =
    useMemo(
      () => [
        {
          Header: tKYC('tableHeaderPhoneNumber'),
          accessor: 'phoneNumber',
        },
        {
          Header: tKYC('detailMemberName'),
          accessor: 'firstName',
          Cell: ({ row }) => (
            <Typography variant="inherit" key="firstName">
              {`${row.original.firstName} ${row.original.middleName} ${row.original.lastName}`}
            </Typography>
          ),
        },
        {
          Header: tKYC('tableHeaderRequestDate'),
          accessor: 'createdDate',
          Cell: ({ value }) => (
            <Typography variant="inherit" key="createdDate">
              {DateConvert.stringToDateFormat(value, LONG_DATE_TIME_FORMAT)}
            </Typography>
          ),
        },
        {
          Header: tKYC('tableHeaderIDType'),
          accessor: 'identityType',
        },
        {
          Header: tKYC('tableHeaderIDNumber'),
          accessor: 'identityNumber',
        },
        {
          Header: tKYC('detailKYCStatus'),
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
                <Typography
                  variant="inherit"
                  color={Token.color.greenDark}
                  key="status"
                >
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
            <Stack direction="row" spacing={2} key="kycPremiumMemberAction">
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
      [showModal],
    );

  const handleCloseModal = () => {
    hideModal();
    setSelectedData(null);
  };

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">{tKYC('pageTitle')}</Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
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
                  placeholder={tKYC('placeholderTypePhoneNumber')}
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
                  {tKYC('filterMemberName')}
                </Typography>
                <TextField
                  value={filterForm.memberName}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        memberName: e.target.value,
                      }));
                    });
                  }}
                  fullWidth
                  type="search"
                  placeholder={tKYC('placeholderTypeMemberName')}
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
              <FormDatePicker
                value={filterForm.requestDate}
                onChange={value => {
                  batch(() => {
                    setPagination(oldPagination => ({
                      ...oldPagination,
                      currentPage: 0,
                    }));
                    setFilterForm(oldForm => ({
                      ...oldForm,
                      requestDate: value,
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
          </Grid>
        </Card>
        {kycRequestStatus === 'loading' && <LoadingPage />}
        {kycRequestStatus === 'success' && kycRequestData.length === 0 && (
          <EmptyList
            title={tCommon('tableEmptyTitle')}
            description={tCommon('tableEmptyDescription', {
              text: 'KYC Request',
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
      <ViewKYCRequestModal
        // isHistory={!checkAuthority('kyc', ['create', 'update'])}
        isHistory={false}
        isActive={isActive}
        onHide={handleCloseModal}
        selectedId={selectedData?.id || null}
        fetchKycRequestList={fetchKycRequestList}
        phoneNumber={selectedData?.phoneNumber || null}
        memberSecureId={selectedData?.id || null}
      />
    </Stack>
  );
};

export default KYCRequestList;
