// Cores
import React, { useMemo } from 'react';

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
  Chip,
  EmptyList,
  LoadingPage,
  renderOptionCheckbox,
} from '@woi/web-component';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';
import { Column } from 'react-table';
import CreateHolidayModal from './components/CreateHolidayModal';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import useAMLAHoliday from './hooks/amlaHolidayList';
import { batch, DateConvert } from '@woi/core';
import { useTranslation } from 'react-i18next';
import useMenuPrivilege from '@src/shared/hooks/useMenuPrivilege';

// Types & Consts
import { MEDIUM_DATE_FORMAT } from '@woi/core/utils/date/constants';
import { AMLAHolidayData } from '@woi/service/co/admin/report/amlaHoliday';
import { PRIVILEGE_ACCESS } from '@woi/privilege';

const AMBAHolidayList = () => {
  const [isActive, showModal, hideModal] = useModal();
  const { checkAuthority } = useMenuPrivilege();
  const {
    yearOptions,
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    amlaHolidayData,
    amlaHolidayStatus,
    fetchAMLAHolidayList,
    handleDelete,
  } = useAMLAHoliday();
  const { t: tCommon } = useTranslation('common');
  const { t: tAMLAHoliday } = useTranslation('amlaHoliday');
  const { t: tForm } = useTranslation('form');

  const columns: Array<Column<AMLAHolidayData & { action: string }>> =
    useMemo(() => {
      if (
        ['delete' as PRIVILEGE_ACCESS].every(privilege =>
          checkAuthority('amla-holiday', privilege),
        )
      ) {
        return [
          {
            Header: tAMLAHoliday('tableHeaderDate'),
            accessor: 'holidayDate',
            Cell: ({ value }) => (
              <Typography variant="inherit" key="date">
                {DateConvert.stringToDateFormat(value, MEDIUM_DATE_FORMAT)}
              </Typography>
            ),
          },
          {
            Header: tAMLAHoliday('tableHeaderHolidayName'),
            accessor: 'description',
            Cell: ({ value }) => (
              <Typography variant="inherit" key="role">
                {value}
              </Typography>
            ),
          },
          {
            Header: tAMLAHoliday('tableHeaderAction'),
            accessor: 'action',
            Cell: ({ row }) => (
              <Stack direction="row" spacing={2} key="correction">
                <Button
                  variant="text"
                  size="small"
                  color="error"
                  onClick={() => handleDelete(row.original)}
                >
                  {tAMLAHoliday('tableAction')}
                </Button>
              </Stack>
            ),
          },
        ];
      } else {
        return [
          {
            Header: tAMLAHoliday('tableHeaderDate'),
            accessor: 'holidayDate',
            Cell: ({ value }) => (
              <Typography variant="inherit" key="date">
                {DateConvert.stringToDateFormat(value, MEDIUM_DATE_FORMAT)}
              </Typography>
            ),
          },
          {
            Header: tAMLAHoliday('tableHeaderHolidayName'),
            accessor: 'description',
            Cell: ({ value }) => (
              <Typography variant="inherit" key="role">
                {value}
              </Typography>
            ),
          },
        ];
      }
    }, [showModal]);

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
      if (value.length === 0) return null;
      return (
        <Chip
          variant="outlined"
          label={`${key}: ${value.map(filter => filter.label).join(', ')}`}
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
          <Typography variant="h4">{tAMLAHoliday('pageTitle')}</Typography>
          <AuthorizeView access="amla-holiday" privileges={['create']}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              sx={{ borderRadius: 2 }}
              onClick={() => {
                showModal();
              }}
            >
              {tAMLAHoliday('pageActionAdd')}
            </Button>
          </AuthorizeView>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tAMLAHoliday('filterYear')}
                </Typography>
                <Autocomplete
                  value={yearOptions.filter(data =>
                    filterForm.year.some(el => el.value === data.value),
                  )}
                  onChange={(_, value) => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        year: value,
                      }));
                    });
                  }}
                  options={yearOptions}
                  size="small"
                  fullWidth
                  multiple
                  limitTags={1}
                  disableCloseOnSelect
                  getOptionLabel={option => option.label}
                  renderOption={renderOptionCheckbox}
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', {
                        fieldName: tAMLAHoliday('placeholderYear'),
                      })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                    />
                  )}
                />
              </Stack>
            </Grid>
          </Grid>
        </Card>
        <Stack direction="row" spacing={2}>
          {renderFilter()}
        </Stack>
        {amlaHolidayStatus === 'loading' && <LoadingPage />}
        {amlaHolidayStatus === 'success' && amlaHolidayData.length === 0 && (
          <EmptyList
          title={tCommon('tableEmptyNotFound')}
          description=""
          grayscale
        />
        )}
        {amlaHolidayStatus === 'success' && amlaHolidayData.length > 0 && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={amlaHolidayData}
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
                    totalShowing: amlaHolidayData.length,
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
        <CreateHolidayModal
          isActive={isActive}
          onHide={hideModal}
          fetchAMLAHolidayList={fetchAMLAHolidayList}
        />
      )}
    </Stack>
  );
};

export default AMBAHolidayList;
