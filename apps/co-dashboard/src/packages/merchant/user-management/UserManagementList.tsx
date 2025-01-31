// Cores
import { useMemo, useState } from 'react';

// Components
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LockIcon from '@mui/icons-material/Lock';
import {
  Autocomplete,
  Card,
  Grid,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Button,
  Chip,
  Datatable,
  EmptyList,
  FormDatePicker,
  LoadingPage,
  renderOptionCheckbox,
  Token,
} from '@woi/web-component';
import CreateUserModal from './components/CreateUserModal';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import { batch, DateConvert } from '@woi/core';
import { stringToDateFormat } from '@woi/core/utils/date/dateConvert';
import { useTranslation } from 'react-i18next';
import useUserList, { StatusType } from './hooks/useUserList';

// Types & Consts
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';
import { OptionMap } from '@woi/option';
import { UserData } from '@woi/service/co/idp/user/userList';
import { Column } from 'react-table';

// Icons
import CloseIcon from '@mui/icons-material/Close';

const UserManagementList = () => {
  const [isActive, showModal, hideModal] = useModal();
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const {
    statusOptions,
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    userData,
    userStatus,
    fetchUserList,
    roleOptions
  } = useUserList();
  const { t: tCommon } = useTranslation('common');
  const { t: tUser } = useTranslation('user');
  const { t: tForm } = useTranslation('form');

  const columns: Array<Column<UserData & { action: string; }>> = useMemo(
    () => [
      {
        Header: tUser('tableHeaderEmail'),
        accessor: 'username',
        Cell: ({ value, row }) => (
          <Stack direction="row" spacing={1} alignItems="center" key="username">
            <Typography
              variant="inherit"
              sx={{
                color: row.original.isLocked
                  ? Token.color.greyscaleGreyDarkest
                  : Token.color.primaryBlack,
              }}
            >
              {value}
            </Typography>
            {row.original.isLocked && (
              <LockIcon
                fontSize="small"
                sx={{ color: Token.color.greyscaleGreyDarkest }}
              />
            )}
          </Stack>
        ),
      },
      {
        Header: tUser('tableHeaderRole'),
        accessor: 'role',
        Cell: ({ value, row }) => (
          <Typography
            variant="inherit"
            key="role"
            sx={{
              color: row.original.isLocked
                ? Token.color.greyscaleGreyDarkest
                : Token.color.primaryBlack,
            }}
          >
            {value}
          </Typography>
        ),
      },
      {
        Header: tUser('tableHeaderStatus'),
        accessor: 'enabled',
        Cell: ({ value }) => {
          if (!value)
            return (
              <Typography variant="inherit" color={Token.color.orangeDark}>
                {tUser('statusInactive')}
              </Typography>
            );
          return (
            <Typography variant="inherit" color={Token.color.greenDark}>
              {tUser('statusActive')}
            </Typography>
          );
        },
      },
      {
        Header: tUser('tableHeaderRegisteredDate'),
        accessor: 'createdDate',
        Cell: ({ value, row }) => (
          <Typography
            variant="inherit"
            key="createdDate"
            sx={{
              color: row.original.isLocked
                ? Token.color.greyscaleGreyDarkest
                : Token.color.primaryBlack,
            }}
          >
            {DateConvert.stringToDateFormat(value, LONG_DATE_TIME_FORMAT)}
          </Typography>
        ),
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="userAction">
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setSelectedUser(row.original);
                showModal();
              }}
            >
              {tCommon('tableActionDetail')}
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
        case 'username': {
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
        case 'status': {
          const filterValue = value as typeof statusOptions;
          if (filterValue.length === 0) return null;
          return (
            <Chip
              variant="outlined"
              label={`${key}: ${filterValue
                .map(filter => filter.label)
                .join(', ')}`}
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
          <Typography variant="h4">{tUser('pageTitle')}</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            sx={{ borderRadius: 2, textTransform: 'none' }}
            onClick={() => {
              showModal();
              setSelectedUser(null);
            }}
          >
            {tUser('pageActionAdd')}
          </Button>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tUser('filterUsername')}
                </Typography>
                <TextField
                  value={filterForm.username}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        username: e.target.value,
                      }));
                    });
                  }}
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', {
                    fieldName: 'username',
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
            <Grid item md={6} xs={12}>
              <FormDatePicker
                value={filterForm.activeDate}
                onChange={value => {
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
                title={tUser('filterDate')}
                size="small"
                placeholder={tForm('placeholderSelect', { fieldName: 'date' })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tUser('filterRole')}
                </Typography>
                <Autocomplete
                  value={roleOptions.filter(data =>
                    filterForm.role.some(filter => filter.value === data.value),
                  )}
                  onChange={(_, value) => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        role: value,
                      }));
                    });
                  }}
                  options={roleOptions}
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
                        fieldName: 'role',
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
            <Grid item md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tUser('filterStatus')}
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
                        fieldName: 'status',
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
        {userStatus === 'loading' && <LoadingPage />}
        {userStatus === 'success' && userData.length === 0 && (
          <EmptyList
            title={tCommon('tableEmptyTitle')}
            description={tCommon('tableEmptyDescription', { text: 'user' })}
          />
        )}
        {userStatus === 'success' && userData.length > 0 && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={userData}
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
                    totalShowing: userData.length,
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
        <CreateUserModal
          isActive={isActive}
          onHide={hideModal}
          selectedData={selectedUser}
          fetchUserList={fetchUserList}
          roleOptions={roleOptions}
        />
      )}
    </Stack>
  );
};

export default UserManagementList;
