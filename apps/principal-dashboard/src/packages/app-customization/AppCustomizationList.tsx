// Cores
import React, { useMemo } from 'react';

// Components
import { Typography, Stack, Card, Pagination, Grid, TextField, Autocomplete } from '@mui/material';
import { Button, Token, Datatable, Chip, FormDatePicker, EmptyList, LoadingPage, renderOptionCheckbox } from '@woi/web-component';
import { Column } from 'react-table';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';

// Hooks & Utils
import { batch, DateConvert } from '@woi/core';
import useModal from '@woi/common/hooks/useModal';
import { useTranslation } from 'react-i18next';
import useRouteRedirection from '@src/shared/hooks/useRouteRedirection';
import { stringToDateFormat } from '@woi/core/utils/date/dateConvert';
import useAppCustomizationList from './hooks/useAppCustomizationList';

// Types & Consts
import StatusProgress from './components/StatusProgress';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';
import { ApplicationData, ApplicationStatus } from '@woi/service/principal/admin/application/applicationList';
import CreateAppCustomizationModal from './components/CreateAppCustomizationModal';
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';
import { OptionMap } from '../content-management/hooks/useContentManagementUpsert';

const AppCustomizationList = () => {
  const [isActive, showModal, hideModal] = useModal();
  const { onNavigate } = useRouteRedirection();
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
    appCustomizationData,
    appCustomizationStatus,
  } = useAppCustomizationList();
  const { t: tCommon } = useTranslation('common');
  const { t: tAppCustomization } = useTranslation('appCustomization');
  const { t: tForm } = useTranslation('form');

  const columns: Array<Column<ApplicationData & { action: string; }>> = useMemo(
    () => [
      {
        Header: tAppCustomization('tableHeaderCOName'),
        accessor: 'name',
      },
      {
        Header: tAppCustomization('tableHeaderCustomizationDate'),
        accessor: 'createdDate',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="createdDate">{DateConvert.stringToDateFormat(value, LONG_DATE_TIME_FORMAT)}</Typography>
        )
      },
      {
        Header: tAppCustomization('tableHeaderStatus'),
        accessor: 'status',
        Cell: ({ row }) => (
          <StatusProgress selectedData={row.original} key="status" />
        )
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => {
          return (
            <Stack direction="row" spacing={2} key="applicationAction">
              <Button variant="text" size="small" onClick={() => onNavigate({ pathname: `/app-customization/detail/${row.original.id}` })}>
                {tCommon('tableActionDetail')}
              </Button>
            </Stack>
          )
        }
      },
    ],
    []
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
          <Typography variant="h4">{tAppCustomization('pageListTitle')}</Typography>
          <Stack direction="row" spacing={2}>
            <AuthorizeView access="co" privileges={['create']}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
                sx={{ borderRadius: 2 }}
                onClick={showModal}
              >
                {tAppCustomization('pageActionAdd')}
              </Button>
            </AuthorizeView>
          </Stack>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">{tAppCustomization('filterCOName')}</Typography>
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
                <Typography variant="subtitle2">{tAppCustomization('filterStatus')}</Typography>
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
                        status: value as OptionMap<ApplicationStatus>[],
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
                title={tAppCustomization('filterDate')}
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
          <Button variant="text" color="primary" startIcon={<RefreshIcon />} onClick={resetFilterForm}>Reset</Button>
        </Stack>
        {appCustomizationStatus === 'loading' && <LoadingPage />}
        {(appCustomizationStatus === 'success' && appCustomizationData.length === 0) && (
          <EmptyList
            title={tCommon('tableEmptyTitle')}
            description={tCommon('tableEmptyDescription', { text: "app customization" })}
          />
        )}
        {(appCustomizationStatus === 'success' && appCustomizationData.length > 0) && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={appCustomizationData}
                sortBy={sortBy}
                direction={direction}
                onSort={handleSort}
                hideHeaderSort={['action']}
              />
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="caption" color={Token.color.greyscaleGreyDarkest}>
                  {tCommon('paginationTitle', { totalShowing: appCustomizationData.length, totalData: pagination.totalElements })}
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
        <CreateAppCustomizationModal isActive={isActive} onHide={hideModal} />
      )}
    </>
  )
}

export default AppCustomizationList;