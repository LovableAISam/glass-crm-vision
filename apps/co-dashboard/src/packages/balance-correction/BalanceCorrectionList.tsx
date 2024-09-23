// Cores
import React, { useMemo, useState } from 'react';

// Components
import {
  Typography,
  Stack,
  Card,
  Pagination,
  Grid,
  TextField,
} from '@mui/material';
import {
  Button,
  Token,
  Datatable,
  EmptyList,
  LoadingPage,
  PriceCell,
} from '@woi/web-component';
import { useRouter } from 'next/router';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import useBalanceCorrectionList from './hooks/useBalanceCorrectionList';
import { batch } from '@woi/core';
import { useTranslation } from 'react-i18next';
import ViewBalanceCorrectionModal from './components/ViewBalanceCorrectionModal';

// Types & Consts
import { Column } from 'react-table';
import { MemberLockData } from '@woi/service/co/admin/member/memberLockList';

const BalanceCorrectionList = () => {
  const router = useRouter();

  const {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    memberLockData,
    memberLockStatus,
    privilegeType,
    fetchMemberList,
  } = useBalanceCorrectionList();
  const [isActive, showModal, hideModal] = useModal();
  const { t: tCommon } = useTranslation('common');
  const { t: tBalanceCorrection } = useTranslation('balanceCorrection');
  const { t: tForm } = useTranslation('form');
  const [selectedData, setSelectedData] = useState<MemberLockData | null>(null);

  const columns: Array<Column<MemberLockData & { action: string }>> = useMemo(
    () => [
      {
        Header: tBalanceCorrection('tableAccountName'),
        accessor: 'name',
      },
      {
        Header: tBalanceCorrection('tableHeaderAccountPhoneNumber'),
        accessor: 'phoneNumber',
      },
      {
        Header: tBalanceCorrection('tableHeaderRmNumber'),
        accessor: 'rmNumber',
      },
      {
        Header: tBalanceCorrection('tableHeaderAccountBalance'),
        accessor: 'balance',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
      },
      {
        Header: tBalanceCorrection('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="correction">
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setSelectedData(row.original);
                showModal();
              }}
            >
              {tBalanceCorrection('tableHeaderCorrection')}
            </Button>
          </Stack>
        ),
      },
    ],
    [showModal],
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
            {tBalanceCorrection('pageTitleBalanceCorrection')}
          </Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={6} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tBalanceCorrection('filterPhoneNumber')}
                </Typography>
                <TextField
                  value={filterForm.filterPhoneNumber}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        filterPhoneNumber: e.target.value,
                      }));
                    });
                  }}
                  fullWidth
                  autoComplete="off"
                  type="search"
                  placeholder={tForm('placeholderType', {
                    fieldName: tBalanceCorrection('typePhoneNumber'),
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
            <Grid item xl={6} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tBalanceCorrection('filterMemberName')}
                </Typography>
                <TextField
                  value={filterForm.filterName}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        filterName: e.target.value,
                      }));
                    });
                  }}
                  autoComplete="off"
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', {
                    fieldName: tBalanceCorrection('typeMemberName'),
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
          </Grid>
        </Card>

        {memberLockStatus === 'loading' && <LoadingPage />}

        {memberLockStatus === 'success' && memberLockData.length === 0 && (
          <EmptyList
            title={tCommon('tableEmptyNotFound')}
            description=""
            grayscale
          />
        )}

        {memberLockStatus === 'success' && memberLockData.length > 0 && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={memberLockData}
                sortBy={sortBy}
                direction={direction}
                onSort={handleSort}
                hideHeaderSort={['action', 'rmNumber']}
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
                    totalShowing: memberLockData.length,
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
      {selectedData && isActive && (
        <ViewBalanceCorrectionModal
          isActive={isActive}
          onHide={hideModal}
          selectedData={selectedData}
          privilegeType={privilegeType}
          fetchMemberList={fetchMemberList}
        />
      )}
    </Stack>
  );
};

export default BalanceCorrectionList;
