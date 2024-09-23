// Cores
import React, { useMemo, useState } from 'react';

// Components
import { Typography, Stack, Card, Pagination, Grid, TextField, Autocomplete } from '@mui/material';
import { Button, Token, Datatable, Chip, FormDatePicker, EmptyList, LoadingPage, renderOptionCheckbox } from '@woi/web-component';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import CreateCOModal from './components/CreateCOModal';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import RefreshIcon from '@mui/icons-material/Refresh';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';

// Hooks & Utils
import { batch, DateConvert } from '@woi/core';
import useModal from '@woi/common/hooks/useModal';
import useCOAccountManagementList from './hooks/useCommunityOwnerList';
import { stringToDateFormat } from '@woi/core/utils/date/dateConvert';
import { useTranslation } from 'react-i18next';

// Types & Constants
import { Column } from 'react-table';
import {
  CommunityOwnerData,
  CommunityOwnerStatusType
} from '@woi/service/principal/admin/communityOwner/communityOwnerList';
import { LONG_DATE_FORMAT } from '@woi/core/utils/date/constants';
import StatusProgress from './components/StatusProgress';
import { OptionMap } from '../content-management/hooks/useContentManagementUpsert';

const COAccountManagementList = () => {
  const [isActive, showModal, hideModal] = useModal();
  const [selectedData, setSelectedData] = useState<CommunityOwnerData | null>(null);
  const {
    statusOptions,
    filterForm,
    setFilterForm,
    resetFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    communityOwnerData,
    communityOwnerStatus,
    fetchCommunityOwnerList,
  } = useCOAccountManagementList();
  const { t: tCommon } = useTranslation('common');
  const { t: tCO } = useTranslation('co');
  const { t: tForm } = useTranslation('form');

  const columns: Array<Column<CommunityOwnerData & { action: string; }>> = useMemo(
    () => [
      {
        Header: tCO('tableHeaderCOName'),
        accessor: 'name',
      },
      {
        Header: tCO('tableHeaderProvisioningStatus'),
        accessor: 'provisioningStatus',
        Cell: ({ row }) => (
          <StatusProgress selectedData={row.original} key="provisioningStatus" />
        )
      },
      {
        Header: tCO('tableHeaderAccountStatus'),
        accessor: 'isActive',
        Cell: ({ row }) => (
          <Typography variant="inherit" key="active" color={row.original.isActive ? Token.color.greenDark : Token.color.redDark}>{row.original.isActive ? 'Active' : 'Inactive'}</Typography>
        )
      },
      {
        Header: tCO('tableHeaderEffectiveDate'),
        accessor: 'activeDate',
        Cell: ({ row }) => (
          <Typography variant="inherit" key="activeDate">{DateConvert.stringToDateFormat(row.original.activeDate, LONG_DATE_FORMAT)} - {DateConvert.stringToDateFormat(row.original.inactiveDate, LONG_DATE_FORMAT)}</Typography>
        )
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => {
          const dataRow = row.original;
          return (
            <Stack direction="row" spacing={2} key="communityOwnerAction">
              <Button variant="text" size="small" onClick={() => {
                setSelectedData(dataRow);
                showModal();
              }}>
                {tCommon('tableActionDetail')}
              </Button>
            </Stack>
          )
        }
      },
    ],
    [showModal]
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
  }

  const renderFilter = () => {
    return Object.entries(filterForm).map(([key, value]) => {
      switch (key as keyof typeof filterForm) {
        case 'search': {
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
                  textTransform: 'uppercase'
                }
              }}
            />
          )
        }
        case 'status': {
          const filterValue = value as typeof statusOptions;
          if (filterValue.length === 0) return null;
          return (
            <Chip
              variant="outlined"
              label={`${key}: ${filterValue.map(filter => filter.label).join(', ')}`}
              color="primary"
              deleteIcon={<CloseIcon />}
              onDelete={() => handleDeleteFilter(key, [])}
              sx={{
                '& .MuiChip-label': {
                  textTransform: 'uppercase'
                }
              }}
            />
          )
        }
        case 'activeDate': {
          const filterValue = value as typeof filterForm.activeDate;
          if (!filterValue.startDate || !filterValue.endDate) return null;
          return (
            <Chip
              variant="outlined"
              label={`${key}: ${stringToDateFormat(filterValue.startDate)} - ${stringToDateFormat(filterValue.endDate)}`}
              color="primary"
              deleteIcon={<CloseIcon />}
              onDelete={() => handleDeleteFilter(key, [])}
              sx={{
                '& .MuiChip-label': {
                  textTransform: 'uppercase'
                }
              }}
            />
          )
        }
      }
    })
  }

  return (
    <>
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">{tCO('pageTitle')}</Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PersonAddAlt1Icon />}
              sx={{ borderRadius: 2 }}
              onClick={showModal}
            >
              Batch Process
            </Button>
            <AuthorizeView access="co" privileges={['create']}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
                sx={{ borderRadius: 2 }}
                onClick={() => {
                  setSelectedData(null);
                  showModal();
                }}
              >
                Register New CO
              </Button>
            </AuthorizeView>
          </Stack>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">{tCO('tableHeaderCOName')}</Typography>
                <TextField
                  value={filterForm.search}
                  onChange={(e) => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        search: e.target.value,
                      }));
                    });
                  }}
                  fullWidth
                  placeholder={tForm('placeholderType', { fieldName: 'co name' })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3
                    }
                  }}
                  size="small"
                />
              </Stack>
            </Grid>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">{tCO('tableHeaderAccountStatus')}</Typography>
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
                        status: value as OptionMap<CommunityOwnerStatusType>[],
                      }));
                    });
                  }}
                  options={statusOptions}
                  size="small"
                  fullWidth
                  multiple
                  limitTags={1}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  renderOption={renderOptionCheckbox}
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
                />
              </Stack>
            </Grid>
            <Grid item xl={4} md={6} xs={12}>
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
                title="Filter Date"
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
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            {renderFilter()}
          </Stack>
          <Button variant="text" color="primary" startIcon={<RefreshIcon />} onClick={resetFilterForm}>{tCommon('actionReset')}</Button>
        </Stack>
        {communityOwnerStatus === 'loading' && <LoadingPage />}
        {(communityOwnerStatus === 'success' && communityOwnerData.length === 0) && (
          <EmptyList
            title={tCommon('tableEmptyTitle')}
            description={tCommon('tableEmptyDescription', { text: "community owner" })}
          />
        )}
        {(communityOwnerStatus === 'success' && communityOwnerData.length > 0) && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={communityOwnerData}
                sortBy={sortBy}
                direction={direction}
                onSort={handleSort}
                hideHeaderSort={['action']}
              />
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="caption" color={Token.color.greyscaleGreyDarkest}>
                  {tCommon('paginationTitle', { totalShowing: communityOwnerData.length, totalData: pagination.totalElements })}
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
        <CreateCOModal isActive={isActive} onHide={hideModal} selectedData={selectedData} fetchCOList={fetchCommunityOwnerList} />
      )}
    </>
  )
}

export default COAccountManagementList;