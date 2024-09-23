// Cores
import React, { useMemo } from 'react';

// Components
import {
  Typography,
  Stack,
  Card,
  Pagination,
  Grid,
  TextField,
  TableRow,
  TableCell,
  Chip,
} from '@mui/material';
import {
  Token,
  Datatable,
  FormDatePicker,
  LoadingPage,
  EmptyList,
  PriceCell,
} from '@woi/web-component';
import { Column } from 'react-table';
import { useRouter } from 'next/router';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import useUserFundBalanceList from './hooks/useUserFundBalanceList';
import { batch, DateConvert } from '@woi/core';
import { useTranslation } from 'react-i18next';
import { UserFundBalanceData } from '@woi/service/co/admin/report/userFundBalanceList';
import { stringToDateFormat } from '@woi/core/utils/date/dateConvert';

// Types & Consts
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';

// Icon
import CloseIcon from '@mui/icons-material/Close';

const UserFundBalanceList = () => {
  const router = useRouter();

  const {
    filterForm,
    setFilterForm,
    setPagination,
    sortBy,
    direction,
    handleSort,
    pagination,
    userFundBalanceData,
    userFundBalanceStatus,
    handleDeleteFilter,
    handleChangeDate,
  } = useUserFundBalanceList();
  const [showModal] = useModal();
  const { t: tCommon } = useTranslation('common');
  const { t: tReport } = useTranslation('report');
  const { t: tForm } = useTranslation('form');

  const columns: Array<Column<UserFundBalanceData & { action: string }>> =
    useMemo(
      () => [
        {
          Header: tReport('tableHeaderUserID'),
          accessor: 'id',
        },
        {
          Header: tReport('tableHeaderRMNo'),
          accessor: 'rmNumber',
        },
        {
          Header: tReport('tableHeaderMobileNumber'),
          accessor: 'phoneNumber',
        },
        {
          Header: tReport('tableHeaderUserType'),
          accessor: 'type',
        },
        {
          Header: tReport('tableHeaderEnrollmentDate'),
          accessor: 'enrollmentDate',
          Cell: ({ value }) => (
            <Typography variant="inherit" key="dateTime">
              {DateConvert.stringToDateFormat(value, LONG_DATE_TIME_FORMAT)}
            </Typography>
          ),
        },
        {
          Header: tReport('tableHeaderNumberofLinkedBanks'),
          accessor: 'numLinkBank',
        },
        {
          Header: tReport('tableHeaderNumberofLinkedDebitCards'),
          accessor: 'numLinkDebit',
        },
        {
          Header: tReport('tableHeaderNumberofLinkedCreditCards'),
          accessor: 'numLinkCredit',
        },
        {
          Header: tReport('tableHeaderNumberofLinkedEWallet'),
          accessor: 'numLinkWallet',
        },
        {
          Header: tReport('tableHeaderTotalCashIn'),
          accessor: 'totalCashInBpi',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tReport('tableHeaderYTDCashIn'),
          accessor: 'ytdBpi',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tReport('tableHeaderLastMonthCashIn'),
          accessor: 'lastMonthCashInBpi',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tReport('tableHeaderLastWeekCashIn'),
          accessor: 'lastWeekCashInBpi',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tReport('tableHeaderThisWeekCashIn'),
          accessor: 'thisWeekCashInBpi',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tReport('tableHeaderTotalCashIn'),
          accessor: 'totalCashInNonBpi',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tReport('tableHeaderYTDCashIn'),
          accessor: 'ytdNonBpi',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tReport('tableHeaderLastMonthCashIn'),
          accessor: 'lastMonthCashInNonBpi',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tReport('tableHeaderLastWeekCashIn'),
          accessor: 'lastWeekCashInNonBpi',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tReport('tableHeaderThisWeekCashIn'),
          accessor: 'thisWeekCashInNonBpi',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tReport('tableHeaderAsofreportdateFundBalance'),
          accessor: 'reportDateFundBalance',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tReport('tableHeaderLastWeekFundBalance'),
          accessor: 'lastWeekFundBalance',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tReport('tableHeaderLastMonthFundBalance'),
          accessor: 'lastMonthFundBalance',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
        {
          Header: tReport('tableHeaderStartofYearFundBalance'),
          accessor: 'startOfYearFundBalance',
          Cell: ({ value }) => <PriceCell value={value} router={router} />,
        },
      ],
      [showModal],
    );

  const renderFilter = () => {
    return Object.entries(filterForm).map(([key, value]) => {
      switch (key as keyof typeof filterForm) {
        case 'rmNumber':
        case 'phoneNumber':
        case 'memberId': {
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
        case 'activeDate': {
          const filterValue = value as typeof filterForm.activeDate;
          if (!filterValue.startDate || !filterValue.endDate) return null;
          return (
            <Chip
              variant="outlined"
              label={`${key}: ${stringToDateFormat(
                filterValue.startDate,
              )} - ${stringToDateFormat(filterValue.endDate)}`}
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
          <Typography variant="h4">
            {tReport('pageTitleUserFundBalance')}
          </Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={6} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tReport('filterUserId')}
                </Typography>
                <TextField
                  value={filterForm.memberId}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        memberId: e.target.value,
                      }));
                    });
                  }}
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', {
                    fieldName: tReport('typeUserId'),
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
                  {tReport('filterRMNumber')}
                </Typography>
                <TextField
                  value={filterForm.rmNumber}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        rmNumber: e.target.value,
                      }));
                    });
                  }}
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', {
                    fieldName: tReport('typeRmNumber'),
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
                  {tReport('filterMobileNumber')}
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
                    fieldName: tReport('typeMobileNumber'),
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
              <FormDatePicker
                value={filterForm.activeDate}
                onChange={handleChangeDate}
                title={tReport('filterDate')}
                size="small"
                placeholder={tForm('placeholderSelect', {
                  fieldName: tReport('typeDate'),
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
            </Grid>
          </Grid>
        </Card>

        <Stack direction="row" spacing={2}>
          {renderFilter()}
        </Stack>

        {userFundBalanceStatus === 'loading' && <LoadingPage />}

        {userFundBalanceStatus === 'success' &&
          userFundBalanceData.length === 0 && (
            <EmptyList
              title={tCommon('tableEmptyNotFound')}
              description=""
              grayscale
            />
          )}

        {userFundBalanceStatus === 'success' && userFundBalanceData.length > 0 && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                tableHeaderGroup={
                  <React.Fragment>
                    <TableRow>
                      <TableCell
                        align="center"
                        colSpan={5}
                        style={{
                          borderRight: '1px solid rgba(224, 224, 224, 1)',
                          borderBottom: 'none',
                          paddingBottom: '0',
                          fontWeight: 600,
                          color: Token.color.greyscaleGreyDarkest,
                        }}
                      >
                        {tReport('tableHeaderClientInformation')}
                      </TableCell>
                      <TableCell
                        align="center"
                        colSpan={4}
                        style={{
                          borderRight: '1px solid rgba(224, 224, 224, 1)',
                          borderBottom: 'none',
                          paddingBottom: '0',
                          fontWeight: 600,
                          color: Token.color.greyscaleGreyDarkest,
                        }}
                      >
                        {tReport('tableHeaderLinkedBanksAndCards')}
                      </TableCell>
                      <TableCell
                        align="center"
                        colSpan={5}
                        style={{
                          borderRight: '1px solid rgba(224, 224, 224, 1)',
                          borderBottom: 'none',
                          paddingBottom: '0',
                          fontWeight: 600,
                          color: Token.color.greyscaleGreyDarkest,
                        }}
                      >
                        {tReport('tableHeaderTopuporCashInViaBPIOnline')}
                      </TableCell>
                      <TableCell
                        align="center"
                        colSpan={5}
                        style={{
                          borderRight: '1px solid rgba(224, 224, 224, 1)',
                          borderBottom: 'none',
                          paddingBottom: '0',
                          fontWeight: 600,
                          color: Token.color.greyscaleGreyDarkest,
                        }}
                      >
                        {tReport('tableHeaderTopuporCashInViaOtherBanks')}
                      </TableCell>
                      <TableCell
                        align="center"
                        colSpan={4}
                        style={{
                          borderBottom: 'none',
                          paddingBottom: '0',
                          fontWeight: 600,
                          color: Token.color.greyscaleGreyDarkest,
                        }}
                      >
                        {tReport('tableHeaderFundBalance')}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                }
                columns={columns as Column<object>[]}
                data={userFundBalanceData}
                sortBy={sortBy}
                direction={direction}
                onSort={handleSort}
                hideHeaderSort={['phoneNumber', 'id', 'rmNumber']}
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
                    totalShowing: userFundBalanceData.length,
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
    </Stack>
  );
};

export default UserFundBalanceList;
