// Cores
import { useMemo, useState } from 'react';

// Components
import {
  Card,
  Chip,
  Grid,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Button,
  EmptyList,
  Datatable,
  FormDatePicker,
  LoadingPage,
  PriceCell,
  Token,
} from '@woi/web-component';
import { useRouter } from 'next/router';
import { Column } from 'react-table';
import ViewMemberSummaryModal from './components/ViewMemberSummaryModal';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import { batch } from '@woi/core';
import {
  calculateDateRangeDays,
  stringToDateFormat,
} from '@woi/core/utils/date/dateConvert';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import useMemberSummaryList from './hooks/useMemberSummaryList';

// Types & Consts
import { MemberData } from '@woi/service/co/idp/member/memberList';

// Icons
import CloseIcon from '@mui/icons-material/Close';

const COVAMemberSummaryList = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    memberData,
    memberStatus,
    fetchMemberList,
  } = useMemberSummaryList();
  const [isActive, showModal, hideModal] = useModal();
  const { t: tCommon } = useTranslation('common');
  const { t: tReport } = useTranslation('report');
  const { t: tForm } = useTranslation('form');
  const [selectedData, setSelectedData] = useState<MemberData | null>(null);

  const columns: Array<Column<MemberData & { action: string }>> = useMemo(
    () => [
      {
        Header: tReport('tableHeaderMemberName'),
        accessor: 'name',
      },
      {
        Header: tReport('tableHeaderVANumber'),
        accessor: 'phoneNumber',
      },
      {
        Header: tReport('tableHeaderCOName'),
        accessor: 'loyaltyStatus',
        Cell: () => (
          <Typography variant="inherit" key="cartera">
            CARTERA
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderBalance'),
        accessor: 'balance',
        Cell: ({ value }) => <PriceCell value={value} router={router} />,
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
              {tReport('tableActionDetail')}
            </Button>
          </Stack>
        ),
      },
    ],
    [showModal],
  );

  const handleDeleteFilter = (key: string, value: any) => {
    batch(() => {
      setPagination(oldPagination => ({
        ...oldPagination,
        currentPage: 0,
      }));
      setFilterForm(oldForm => ({
        ...oldForm,
        [key]: value,
      }));
    });
  };

  const renderFilter = () => {
    return Object.entries(filterForm).map(([key, value]) => {
      switch (key as keyof typeof filterForm) {
        case 'name':
        case 'phoneNumber': {
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
            {tReport('pageTitleVAMemberSummary')}
          </Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tReport('filterMemberName')}
                </Typography>
                <TextField
                  value={filterForm.name}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        name: e.target.value,
                      }));
                    });
                  }}
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', {
                    fieldName: tReport('typeMemberName'),
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
                  {tReport('filterVaNumber')}
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
                    fieldName: tReport('typeVANumber'),
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
              <FormDatePicker
                value={filterForm.activeDate}
                onChange={value => {
                  batch(() => {
                    setPagination(oldPagination => ({
                      ...oldPagination,
                      currentPage: 0,
                    }));
                    const { startDate, endDate } = value;
                    if (calculateDateRangeDays(startDate, endDate) > 730) {
                      enqueueSnackbar(
                        'Effective date to cannot be greater than 730 days from effective date from.',
                        {
                          variant: 'error',
                        },
                      );
                    } else {
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        activeDate: value,
                      }));
                    }
                  });
                }}
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
        {memberStatus === 'loading' && <LoadingPage />}
        {memberStatus === 'success' && memberData.length === 0 && (
          <EmptyList
            title={tCommon('tableEmptyNotFound')}
            description=""
            grayscale
          />
        )}
        {memberStatus === 'success' && memberData.length > 0 && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={memberData}
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
                    totalShowing: memberData.length,
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
        <ViewMemberSummaryModal
          isActive={isActive}
          onHide={hideModal}
          selectedData={selectedData}
          fetchMemberList={fetchMemberList}
        />
      )}
    </Stack>
  );
};

export default COVAMemberSummaryList;
