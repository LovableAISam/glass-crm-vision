// Cores
import React, { useMemo, useState } from 'react';

// Components
import {
  Typography,
  Stack,
  Card,
  TextField,
  Autocomplete,
  Pagination,
  Grid,
  Chip,
} from '@mui/material';
import {
  Button,
  Token,
  Datatable,
  FormDatePicker,
  EmptyList,
  LoadingPage,
  renderOptionCheckbox,
} from '@woi/web-component';
import LockIcon from '@mui/icons-material/Lock';
import ViewManageMemberModal from './components/ViewManageMemberModal';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import useMemberList from './hooks/useMemberList';
import { batch, DateConvert } from '@woi/core';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { Column } from 'react-table';
import {
  MemberData,
  UpgradeStatus,
} from '@woi/service/co/idp/member/memberList';
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';
import { OptionMap } from '@woi/option';
import { MemberStatusType } from '@woi/service/co/idp/member/memberStatusList';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import { stringToDateFormat } from '@woi/core/utils/date/dateConvert';

const MemberManagementList = () => {
  const {
    upgrageStatusOptions,
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
    fetchMemberList,
    handleDeleteFilter,
  } = useMemberList();
  const [isActive, showModal, hideModal] = useModal();
  const { t: tCommon } = useTranslation('common');
  const { t: tMember } = useTranslation('member');
  const { t: tForm } = useTranslation('form');
  const { t: tKYC } = useTranslation('kyc');
  const [selectedData, setSelectedData] = useState<MemberData | null>(null);

  const renderCell = ({ value, row }: { value: any; row: any; }) => (
    <Typography
      variant="inherit"
      key="name"
      sx={{
        color:
          row.original.activationStatus === 'LOCK'
            ? Token.color.greyscaleGreyDarkest
            : Token.color.primaryBlack,
      }}
    >
      {value}
    </Typography>
  );

  const columns: Array<Column<MemberData & { action: string; }>> = useMemo(
    () => [
      {
        Header: tMember('tableHeaderPhoneNumber'),
        accessor: 'phoneNumber',
        Cell: ({ value, row }) => (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            key="phoneNumber"
          >
            <Typography
              variant="inherit"
              sx={{
                color:
                  row.original.activationStatus === 'LOCK'
                    ? Token.color.greyscaleGreyDarkest
                    : Token.color.primaryBlack,
              }}
            >
              {value}
            </Typography>
            {row.original.activationStatus === 'LOCK' && (
              <LockIcon
                fontSize="small"
                sx={{ color: Token.color.greyscaleGreyDarkest }}
              />
            )}
          </Stack>
        ),
      },
      {
        Header: tMember('tableHeaderMemberName'),
        accessor: 'name',
        Cell: ({ value, row }) => renderCell({ value, row }),
      },
      {
        Header: tMember('tableHeaderStatus'),
        accessor: 'activationStatus',
        Cell: ({ value }) => {
          if (value === 'ACTIVE')
            return (
              <Typography variant="inherit">
                {tMember('statusActive')}
              </Typography>
            );
          if (value === 'LOCK')
            return (
              <Typography variant="inherit">{tMember('statusLock')}</Typography>
            );
          return <Typography variant="inherit">-</Typography>;
        },
      },
      {
        Header: tMember('tableHeaderUpgradeStatus'),
        accessor: 'upgradeStatus',
        Cell: ({ value }) => {
          let componentToRender;
          if (value === 'STARTED') {
            componentToRender = (
              <Typography variant="inherit" key="status">
                {tKYC('statusStarted')}
              </Typography>
            );
          } else if (value === 'WAITING_TO_REVIEW' || value === "WAITING") {
            componentToRender = (
              <Typography variant="inherit" key="status" color={Token.color.primaryBlue}>
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
          } else if (value === 'UPGRADE') {
            componentToRender = (
              <Typography
                variant="inherit"
                key="status"
              >
                {tKYC('statusUpgrade')}
              </Typography>
            );
          } else if (value === 'NOT_UPGRADE') {
            componentToRender = (
              <Typography
                variant="inherit"
                key="status"
              >
                {tKYC('statusNotUpgrade')}
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
          } else if (value === 'VERIFIED') {
            componentToRender = (
              <Typography
                variant="inherit"
                color={Token.color.orangeDark}
                key="status"
              >
                {tKYC('statusVerified')}
              </Typography>
            );
          } else {
            componentToRender = (
              <Typography
                variant="inherit"
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
        Header: tMember('tableHeaderRegistrationDate'),
        accessor: 'createdDate',
        Cell: ({ row, value }) =>
          renderCell({
            value: DateConvert.stringToDateFormat(value, LONG_DATE_TIME_FORMAT),
            row,
          }),
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="memberAction">
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setSelectedData(row.original);
                showModal();
              }}
            >
              {tMember('tableActionView')}
            </Button>
          </Stack>
        ),
      },
    ],
    [showModal],
  );

  const renderInput = (params: any, placeholder: string) => (
    <TextField
      {...params}
      placeholder={placeholder}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
        },
      }}
    />
  );

  const renderFilter = () => {
    return Object.entries(filterForm).map(([key, value]) => {
      switch (key as keyof typeof filterForm) {
        case 'phoneNumber':
        case 'name': {
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
        case 'status':
        case 'upgradeStatus': {
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
          <Typography variant="h4">{tMember('pageTitle')}</Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={3} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tMember('filterPhoneNumber')}
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
                    fieldName: 'phone number',
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
            <Grid item xl={3} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tMember('filterMemberName')}
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
                    fieldName: 'member name',
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
            <Grid item xl={3} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tMember('filterStatus')}
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
                        status: value as OptionMap<MemberStatusType>[],
                      }));
                    });
                  }}
                  options={statusOptions}
                  fullWidth
                  size="small"
                  renderInput={params =>
                    renderInput(
                      params,
                      tForm('placeholderSelect', {
                        fieldName: 'status',
                      }),
                    )
                  }
                  multiple
                  limitTags={1}
                  disableCloseOnSelect
                  getOptionLabel={option => option.label}
                  renderOption={renderOptionCheckbox}
                />
              </Stack>
            </Grid>
            <Grid item xl={3} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tMember('filterUpgradeStatus')}
                </Typography>
                <Autocomplete
                  value={upgrageStatusOptions.filter(data =>
                    filterForm.upgradeStatus.some(
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
                        upgradeStatus: value as OptionMap<UpgradeStatus>[],
                      }));
                    });
                  }}
                  options={upgrageStatusOptions}
                  fullWidth
                  size="small"
                  renderInput={params =>
                    renderInput(
                      params,
                      tForm('placeholderSelect', {
                        fieldName: 'member vybe status',
                      }),
                    )
                  }
                  multiple
                  limitTags={1}
                  disableCloseOnSelect
                  getOptionLabel={option => option.label}
                  renderOption={renderOptionCheckbox}
                />
              </Stack>
            </Grid>
            <Grid item xl={3} md={6} xs={12}>
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
                title={tMember('filterDate')}
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
        <ViewManageMemberModal
          isActive={isActive}
          onHide={hideModal}
          selectedData={selectedData}
          fetchMemberList={fetchMemberList}
        />
      )}
    </Stack>
  );
};

export default MemberManagementList;
