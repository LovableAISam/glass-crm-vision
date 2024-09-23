// Cores
import React, { useMemo } from 'react';
import { batch, DateConvert } from '@woi/core';

// Components
import { Typography, Stack, Card, TextField, Autocomplete, Pagination, Grid, FormHelperText } from '@mui/material';
import { Button, Token, Datatable, FormDatePicker, EmptyList, LoadingPage, renderOptionCheckbox } from '@woi/web-component';
import LockIcon from '@mui/icons-material/Lock';
import ViewManageMemberModal from './components/ViewManageMemberModal';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import useMemberList, { StatusType } from './hooks/useMemberList';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { Column } from 'react-table';
import { MemberData } from '@woi/service/principal/admin/member/memberList';
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';
import { OptionMap } from '../content-management/hooks/useContentManagementUpsert';

const MemberManagementList = () => {
  const {
    coOptions,
    statusOptions,
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    memberData,
    memberStatus,
  } = useMemberList();
  const [isActive, showModal, hideModal] = useModal();
  const { t: tCommon } = useTranslation('common');
  const { t: tMember } = useTranslation('member');
  const { t: tForm } = useTranslation('form');

  const columns: Array<Column<MemberData & { action: string }>> = useMemo(
    () => [
      {
        Header: tMember('tableHeaderCO'),
        accessor: 'coName',
        Cell: ({ value, row }) => (
          <Stack direction="row" spacing={1} alignItems="center" key="coName">
            <Typography variant="inherit" sx={{ color: row.original.isLocked ? Token.color.greyscaleGreyDarkest : Token.color.primaryBlack }}>{value}</Typography>
            {row.original.isLocked && (
              <LockIcon fontSize="small" sx={{ color: Token.color.greyscaleGreyDarkest }} />
            )}
          </Stack>
        )
      },
      {
        Header: tMember('tableHeaderPhoneNumber'),
        accessor: 'phoneNumber',
        Cell: ({ value, row }) => (
          <Typography variant="inherit" key="phoneNumber" sx={{ color: row.original.isLocked ? Token.color.greyscaleGreyDarkest : Token.color.primaryBlack }}>{value}</Typography>
        )
      },
      {
        Header: tMember('tableHeaderMemberName'),
        accessor: 'name',
        Cell: ({ value, row }) => (
          <Typography variant="inherit" key="name" sx={{ color: row.original.isLocked ? Token.color.greyscaleGreyDarkest : Token.color.primaryBlack }}>{value}</Typography>
        )
      },
      {
        Header: tMember('tableHeaderStatus'),
        accessor: 'status',
        Cell: ({ value }) => {
          if (value === 'REGISTERED') return <Typography variant="inherit" color={Token.color.greenDark}>{tMember('statusRegistered')}</Typography>
          if (value === 'UNREGISTERED') return <Typography variant="inherit" color={Token.color.orangeDark}>{tMember('statusUnregistered')}</Typography>
          return <Typography variant="inherit">-</Typography>
        }
      },
      {
        Header: tMember('tableHeaderRegistrationDate'),
        accessor: 'createdDate',
        Cell: ({ row, value }) => (
          <Typography variant="inherit" key="createdDate" sx={{ color: row.original.isLocked ? Token.color.greyscaleGreyDarkest : Token.color.primaryBlack }}>{DateConvert.stringToDateFormat(value, LONG_DATE_TIME_FORMAT)}</Typography>
        )
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: () => (
          <Stack direction="row" spacing={2} key="memberAction">
            <Button variant="text" size="small" onClick={showModal}>
              {tMember('tableActionView')}
            </Button>
          </Stack>
        )
      },
    ],
    [showModal]
  );

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">{tMember('pageTitle')}</Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={3} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">{tMember('filterCO')}</Typography>
                <Autocomplete
                  value={coOptions.filter(data => filterForm.communityOwner.some(filter => filter.value === data.value))}
                  onChange={(_, value) => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        communityOwner: value,
                      }));
                    });
                  }}
                  options={coOptions}
                  fullWidth
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', { fieldName: 'community owner' })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3
                        }
                      }}
                    />
                  )}
                  multiple
                  limitTags={1}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  renderOption={renderOptionCheckbox}
                />
                {filterForm.communityOwner.length === 0 && (
                  <FormHelperText sx={{ color: Token.color.redDark }}>
                    {tForm('errorEmpty', { fieldName: 'community owner' })}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xl={3} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">{tMember('filterPhoneNumber')}</Typography>
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
                      borderRadius: 3
                    }
                  }}
                  size="small"
                />
              </Stack>
            </Grid>
            <Grid item xl={3} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">{tMember('filterMemberName')}</Typography>
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
                  placeholder={tForm('placeholderType', { fieldName: 'member name' })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3
                    }
                  }}
                  size="small"
                />
              </Stack>
            </Grid>
            <Grid item xl={3} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">{tMember('filterStatus')}</Typography>
                <Autocomplete
                  value={statusOptions.filter(data => filterForm.status.some(filter => filter.value === data.value))}
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
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', { fieldName: 'status' })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3
                        }
                      }}
                    />
                  )}
                  multiple
                  limitTags={1}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  renderOption={renderOptionCheckbox}
                />
              </Stack>
            </Grid>
            <Grid item xl={3} md={6} xs={12}>
              <FormDatePicker
                value={filterForm.activeDate}
                onChange={(value) => {
                  batch(() => {
                    setPagination(oldPagination => ({
                      ...oldPagination,
                      currentPage: 0,
                    }));
                    setFilterForm(oldForm => ({
                      ...oldForm,
                      activeDate: value,
                    }));
                  });
                }}
                title={tMember('filterDate')}
                size="small"
                placeholder={tForm('placeholderSelect', { fieldName: 'date' })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
              />
            </Grid>
          </Grid>
        </Card>
        {memberStatus === 'loading' && <LoadingPage />}
        {(memberStatus === 'success' && memberData.length === 0) && (
          <EmptyList
            title={tCommon('tableEmptyTitle')}
            description={filterForm.communityOwner.length === 0
              ? tCommon('tableEmptyDescriptionFiltered')
              : tCommon('tableEmptyDescription', { text: "member" })
            }
            grayscale
          />
        )}
        {(memberStatus === 'success' && memberData.length > 0) && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={memberData}
                sortBy={sortBy}
                direction={direction}
                onSort={handleSort}
                hideHeaderSort={['action']}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
                <Typography variant="caption" color={Token.color.greyscaleGreyDarkest}>
                  {tCommon('paginationTitle', { totalShowing: memberData.length, totalData: pagination.totalElements })}
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
      <ViewManageMemberModal isActive={isActive} onHide={hideModal} />
    </Stack>
  )
}

export default MemberManagementList;