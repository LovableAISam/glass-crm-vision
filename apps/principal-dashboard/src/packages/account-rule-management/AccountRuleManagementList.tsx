// Cores
import React, { useMemo, useState } from 'react';

// Components
import { Typography, Stack, Card, TextField, Pagination, Grid } from '@mui/material';
import { Button, Token, Datatable, LoadingPage, EmptyList } from '@woi/web-component';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';

// Utils
import useModal from '@woi/common/hooks/useModal';
import useAccountRuleList from './hooks/useAccountRuleList';

// Types
import { Column } from 'react-table';
import CreateAccountRuleModal from './components/CreateAccountRuleModal';
import { AccountRuleData } from '@woi/service/principal/admin/accountRule/accountRuleList';
import { batch } from '@woi/core';
import { useTranslation } from 'react-i18next';

const AccountRuleManagementList = () => {
  const [isActive, showModal, hideModal] = useModal();
  const [selectedData, setSelectedData] = useState<AccountRuleData | null>(null);
  const {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    accountRuleData,
    accountRuleStatus,
    fetchAccountRuleList,
  } = useAccountRuleList();
  const { t: tCommon } = useTranslation('common');
  const { t: tAccountRule } = useTranslation('accountRule');
  const { t: tForm } = useTranslation('form');

  const columns: Array<Column<AccountRuleData & { action: string }>> = useMemo(
    () => [
      {
        Header: tAccountRule('tableHeaderAccountRuleCode'),
        accessor: 'code',
      },
      {
        Header: tAccountRule('tableHeaderAccountRuleName'),
        accessor: 'name',
      },
      {
        Header: tAccountRule('tableHeaderDescription'),
        accessor: 'description',
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="accountRuleAction">
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
          <Typography variant="h4">{tAccountRule('pageTitle')}</Typography>
          <AuthorizeView access="account-rule" privileges={['create']}>
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
              {tAccountRule('pageActionAdd')}
            </Button>
          </AuthorizeView>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">{tAccountRule('filterAccountRuleCode')}</Typography>
                <TextField
                  value={filterForm.code}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        code: e.target.value,
                      }));
                    });
                  }}
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', { fieldName: 'account rule code' })}
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
                <Typography variant="subtitle2">{tAccountRule('filterAccountRuleName')}</Typography>
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
                  placeholder={tForm('placeholderType', { fieldName: 'account rule name' })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3
                    }
                  }}
                  size="small"
                />
              </Stack>
            </Grid>
          </Grid>
        </Card>
        {accountRuleStatus === 'loading' && <LoadingPage />}
        {(accountRuleStatus === 'success' && accountRuleData.length === 0) && (
          <EmptyList
            title={tCommon('tableEmptyTitle')}
            description={tCommon('tableEmptyDescription', { text: "account rule" })}
            grayscale
          />
        )}
        {(accountRuleStatus === 'success' && accountRuleData.length > 0) && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={accountRuleData}
                sortBy={sortBy}
                direction={direction}
                onSort={handleSort}
                hideHeaderSort={['action']}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
                <Typography variant="caption" color={Token.color.greyscaleGreyDarkest}>
                  {tCommon('paginationTitle', { totalShowing: accountRuleData.length, totalData: pagination.totalElements })}
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
        <CreateAccountRuleModal isActive={isActive} onHide={hideModal} selectedData={selectedData} fetchAccountRuleList={fetchAccountRuleList} />
      )}
    </Stack>
  )
}

export default AccountRuleManagementList;