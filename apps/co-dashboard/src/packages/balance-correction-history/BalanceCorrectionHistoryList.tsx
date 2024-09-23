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
  Autocomplete,
} from '@mui/material';
import {
  Button,
  Token,
  Datatable,
  EmptyList,
  LoadingPage,
  renderOptionCheckbox,
  PriceCell,
} from '@woi/web-component';
import { Column } from 'react-table';
import { useRouter } from 'next/router';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import { batch } from '@woi/core';
import { useTranslation } from 'react-i18next';
import useBalanceCorrectionHistoryList from './hooks/useBalanceCorrectionHistoryList';
import { OptionMap } from '@woi/option';
import ViewBalanceCorrectionModal from './components/ViewBalanceCorrectionModal';

// Types & Consts
import {
  BalanceCorrectionHistoryData,
  StatusType,
} from '@woi/service/co/admin/balanceCorrection/balanceCorrectionHistory';

const BalanceCorrectionHistoryList = () => {
  const router = useRouter();

  const {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    balanceCorrectionHistoryData,
    balanceCorrectionHistoryStatus,
    statusOptions,
  } = useBalanceCorrectionHistoryList();
  const [isActive, showModal, hideModal] = useModal();
  const { t: tCommon } = useTranslation('common');
  const { t: tBalanceCorrection } = useTranslation('balanceCorrection');
  const { t: tForm } = useTranslation('form');
  const [selectedData, setSelectedData] =
    useState<BalanceCorrectionHistoryData | null>(null);

  const columns: Array<
    Column<BalanceCorrectionHistoryData & { action: string }>
  > = useMemo(
    () => [
      {
        Header: tBalanceCorrection('tableAccountName'),
        accessor: 'accountName',
      },
      {
        Header: tBalanceCorrection('tableHeaderRole'),
        accessor: 'role',
      },
      {
        Header: tBalanceCorrection('tableHeaderAccountPhoneNumber'),
        accessor: 'accountPhoneNumber',
      },
      {
        Header: tBalanceCorrection('tableHeaderRmNumber'),
        accessor: 'rmNumber',
      },
      {
        Header: tBalanceCorrection('tableHeaderAccountBalance'),
        accessor: 'balanceAfter',
        Cell: ({ row }) => (
          <PriceCell
            value={
              row.original.status === 'APPROVED'
                ? row.original.balanceAfter
                : row.original.balanceBefore
            }
            router={router}
          />
        ),
      },
      {
        Header: tBalanceCorrection('tableHeaderStatus'),
        accessor: 'status',
        Cell: ({ value }) => {
          let componentToRender;
          if (value === 'WAITING_APPROVAL') {
            componentToRender = (
              <Typography
                variant="inherit"
                color={Token.color.greyscaleGreyDarker}
                key="status"
              >
                {tBalanceCorrection('optionWaitingForApproval')}
              </Typography>
            );
          } else if (value === 'REJECTED') {
            componentToRender = (
              <Typography
                variant="inherit"
                color={Token.color.orangeDark}
                key="status"
              >
                {tBalanceCorrection('optionReject')}
              </Typography>
            );
          } else {
            componentToRender = (
              <Typography
                variant="inherit"
                color={Token.color.greenDark}
                key="status"
              >
                {tBalanceCorrection('optionApproved')}
              </Typography>
            );
          }
          return componentToRender;
        },
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
              {tBalanceCorrection('tableActionDetail')}
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
            {tBalanceCorrection('pageTitleBalanceCorrectionHistory')}
          </Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tBalanceCorrection('filterPhoneNumber')}
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
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tBalanceCorrection('filterMemberName')}
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
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tBalanceCorrection('filterStatus')}
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
                        status: value as OptionMap<StatusType>[],
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
                        fieldName: 'status',
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

        {balanceCorrectionHistoryStatus === 'loading' && <LoadingPage />}

        {balanceCorrectionHistoryStatus === 'success' &&
          balanceCorrectionHistoryData.length === 0 && (
            <EmptyList
              title={tCommon('tableEmptyNotFound')}
              description=""
              grayscale
            />
          )}

        {balanceCorrectionHistoryStatus === 'success' &&
          balanceCorrectionHistoryData.length > 0 && (
            <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
              <Stack direction="column" spacing={2}>
                <Datatable
                  columns={columns as Column<object>[]}
                  data={balanceCorrectionHistoryData}
                  sortBy={sortBy}
                  direction={direction}
                  onSort={handleSort}
                  hideHeaderSort={['action', 'rmNumber', 'role']}
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
                      totalShowing: balanceCorrectionHistoryData.length,
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
        />
      )}
    </Stack>
  );
};

export default BalanceCorrectionHistoryList;
