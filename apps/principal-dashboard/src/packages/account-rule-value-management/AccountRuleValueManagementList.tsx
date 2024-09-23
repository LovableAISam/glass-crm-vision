// Cores
import React, { useMemo, useState } from 'react';

// Components
import { Typography, Stack, Card, TextField, Pagination, Grid, Autocomplete } from '@mui/material';
import { Button, Token, Datatable, FormDatePicker, LoadingPage, EmptyList, renderOptionCheckbox } from '@woi/web-component';
import CreateAccountRuleValueModal from './components/CreateAccountRuleValueModal';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';

// Utils
import useModal from '@woi/common/hooks/useModal';
import { batch, DateConvert } from '@woi/core';
import useAccountRuleValueList from './hooks/useAccountRuleValueList';

// Types
import { Column } from 'react-table';
import { AccountRuleValueData } from '@woi/service/principal/admin/accountRuleValue/accountRuleValueList';
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';
import { useTranslation } from 'react-i18next';

const AccountRuleValueManagementList = () => {
  const [isActive, showModal, hideModal] = useModal();
  const [selectedData, setSelectedData] = useState<AccountRuleValueData | null>(null);
  const {
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

  const columns: Array<Column<AccountRuleValueData & { action: string }>> = useMemo(
    () => [
      {
        Header: tAccountRuleValue('tableHeaderAccountRuleValueName'),
        accessor: 'accountRules',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="accountRules">{value.name}</Typography>
        )
      },
      {
        Header: tAccountRuleValue('tableHeadeTransactionType'),
        accessor: 'transactionType',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="transactionType">{value.name}</Typography>
        )
      },
      {
        Header: tAccountRuleValue('tableHeaderCurrency'),
        accessor: 'currency',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="currency">{value.name}</Typography>
        )
      },
      {
        Header: tAccountRuleValue('tableHeaderEffectiveDate'),
        accessor: 'startDate',
        Cell: ({ row }) => (
          <Typography variant="inherit" key="startDate">{DateConvert.stringToDateFormat(row.original.startDate, LONG_DATE_TIME_FORMAT)} - {DateConvert.stringToDateFormat(row.original.endDate, LONG_DATE_TIME_FORMAT)}</Typography>
        )
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
        )
      },
    ],
    [showModal]
  );

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">{tAccountRuleValue('pageTitle')}</Typography>
          <AuthorizeView access="account-rule-value" privileges={['create']}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              sx={{ borderRadius: 2 }}
              onClick={() => {
                showModal();
                setSelectedData(null);
              }}
            >
              {tAccountRuleValue('pageActionAdd')}
            </Button>
          </AuthorizeView>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">{tAccountRuleValue('filterRuleName')}</Typography>
                <TextField
                  value={filterForm.accountRulesName}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        accountRulesName: e.target.value,
                      }));
                    });
                  }}
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', { fieldName: 'rule name' })}
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
                <Typography variant="subtitle2">{tAccountRuleValue('filterTransactionType')}</Typography>
                <Autocomplete
                  value={filterForm.transactionType}
                  onChange={(_, value) => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        transactionType: value,
                      }));
                    });
                  }}
                  options={transactionTypeOptions}
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
                      placeholder={tForm('placeholderSelect', { fieldName: 'transaction type' })}
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
                title={tAccountRuleValue('filterDate')}
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
        {accountRuleValueStatus === 'loading' && <LoadingPage />}
        {(accountRuleValueStatus === 'success' && accountRuleValueData.length === 0) && (
          <EmptyList
            title={tCommon('tableEmptyTitle')}
            description={tCommon('tableEmptyDescription', { text: "account rule value" })}
            grayscale
          />
        )}
        {(accountRuleValueStatus === 'success' && accountRuleValueData.length > 0) && (
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
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
                <Typography variant="caption" color={Token.color.greyscaleGreyDarkest}>
                  {tCommon('paginationTitle', { totalShowing: accountRuleValueData.length, totalData: pagination.totalElements })}
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
        <CreateAccountRuleValueModal isActive={isActive} onHide={hideModal} selectedData={selectedData} fetchAccountRuleValueList={fetchAccountRuleValueList} />
      )}
    </Stack>
  )
}

export default AccountRuleValueManagementList;
