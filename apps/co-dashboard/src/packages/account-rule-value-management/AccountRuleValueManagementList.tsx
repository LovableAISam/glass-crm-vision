// Cores
import React, { useMemo, useState } from 'react';

// Components
import {
  Typography,
  Stack,
  Card,
  TextField,
  Pagination,
  Grid,
  Autocomplete,
  Chip,
} from '@mui/material';
import {
  Button,
  Token,
  Datatable,
  FormDatePicker,
  LoadingPage,
  EmptyList,
  renderOptionCheckbox,
} from '@woi/web-component';
import CreateAccountRuleValueModal from './components/CreateAccountRuleValueModal';

// Utils
import useModal from '@woi/common/hooks/useModal';
import { batch, DateConvert } from '@woi/core';
import useAccountRuleValueList from './hooks/useAccountRuleValueList';
import { useTranslation } from 'react-i18next';

// Types
import { Column } from 'react-table';
import { AccountRuleValueData } from '@woi/service/co/admin/accountRuleValue/accountRuleValueList';
import { MEDIUM_DATE_FORMAT } from '@woi/core/utils/date/constants';
import { stringToDateFormat } from '@woi/core/utils/date/dateConvert';

// Icons
import CloseIcon from '@mui/icons-material/Close';

const AccountRuleValueManagementList = () => {
  const [isActive, showModal, hideModal] = useModal();
  const [selectedData, setSelectedData] = useState<AccountRuleValueData | null>(
    null,
  );
  const {
    accountRuleOptions,
    transactionTypeOptions,
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    accountRuleValueData,
    accountRuleValueStatus,
    fetchAccountRuleValueList,
  } = useAccountRuleValueList();
  const { t: tCommon } = useTranslation('common');
  const { t: tAccountRuleValue } = useTranslation('accountRuleValue');
  const { t: tForm } = useTranslation('form');

  const columns: Array<Column<AccountRuleValueData & { action: string }>> =
    useMemo(
      () => [
        {
          Header: tAccountRuleValue('tableHeaderAccountRuleValueName'),
          accessor: 'accountRuleName',
          Cell: ({ value }) => (
            <Typography variant="inherit" key="accountRules">
              {value}
            </Typography>
          ),
        },
        {
          Header: tAccountRuleValue('tableHeadeTransactionType'),
          accessor: 'transactionTypeName',
          Cell: ({ value }) => (
            <Typography variant="inherit" key="transactionType">
              {value}
            </Typography>
          ),
        },
        {
          Header: tAccountRuleValue('tableHeaderCurrency'),
          accessor: 'currencyName',
          Cell: ({ value }) => (
            <Typography variant="inherit" key="currency">
              {value}
            </Typography>
          ),
        },
        {
          Header: tAccountRuleValue('tableHeaderEffectiveDate'),
          accessor: 'startDate',
          Cell: ({ row }) => (
            <Typography variant="inherit" key="startDate">
              {DateConvert.stringToDateFormat(
                row.original.startDate,
                MEDIUM_DATE_FORMAT,
              )}{' '}
              -{' '}
              {DateConvert.stringToDateFormat(
                row.original.endDate,
                MEDIUM_DATE_FORMAT,
              )}
            </Typography>
          ),
        },
        {
          Header: tCommon('tableHeaderAction'),
          accessor: 'action',
          Cell: ({ row }) => (
            <Stack direction="row" spacing={2} key="accountRuleValueAction">
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  setSelectedData(row.original);
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
        case 'accountRuleSecureIds':
        case 'transactionTypeSecureIds': {
          const filterValue = value as typeof accountRuleOptions;
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
          <Typography variant="h4">{tAccountRuleValue('pageTitle')}</Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tAccountRuleValue('filterRuleName')}
                </Typography>
                <Autocomplete
                  value={accountRuleOptions.filter(data =>
                    filterForm.accountRuleSecureIds.some(
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
                        accountRuleSecureIds: value,
                      }));
                    });
                  }}
                  options={accountRuleOptions}
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
                      placeholder={tForm('placeholderType', {
                        fieldName: 'rule name',
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
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tAccountRuleValue('filterTransactionType')}
                </Typography>
                <Autocomplete
                  value={transactionTypeOptions.filter(data =>
                    filterForm.transactionTypeSecureIds.some(
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
                        transactionTypeSecureIds: value,
                      }));
                    });
                  }}
                  options={transactionTypeOptions}
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
                        fieldName: 'transaction type',
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
            <Grid item xl={4} md={6} xs={12}>
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
                noShortcuts
                title={tAccountRuleValue('filterDate')}
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
        {accountRuleValueStatus === 'loading' && <LoadingPage />}
        {accountRuleValueStatus === 'success' &&
          accountRuleValueData.length === 0 && (
            <EmptyList
              title={tCommon('tableEmptyNotFound')}
              description=""
              grayscale
            />
          )}
        {accountRuleValueStatus === 'success' &&
          accountRuleValueData.length > 0 && (
            <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
              <Stack direction="column" spacing={2}>
                <Datatable
                  columns={columns as Column<object>[]}
                  data={accountRuleValueData}
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
                      totalShowing: accountRuleValueData.length,
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
        <CreateAccountRuleValueModal
          isActive={isActive}
          onHide={hideModal}
          selectedData={selectedData}
          fetchAccountRuleValueList={fetchAccountRuleValueList}
        />
      )}
    </Stack>
  );
};

export default AccountRuleValueManagementList;
