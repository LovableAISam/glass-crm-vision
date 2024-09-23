// Cores
import React, { useMemo, useState } from 'react';

// Components
import { Typography, Stack, Card, TextField, Pagination, Grid } from '@mui/material';
import { Button, Token, Datatable, EmptyList, LoadingPage } from '@woi/web-component';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import useTransactionTypeList from './hooks/useTransactionTypeList';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { Column } from 'react-table';
import CreateTransactionTypeModal from './components/CreateTransactionTypeModal';
import { TransactionTypeData } from '@woi/service/principal/admin/transactionType/transactionTypeList';

const TransactionTypeManagementList = () => {
  const [isActive, showModal, hideModal] = useModal();
  const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionTypeData | null>(null);
  const {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    transactionTypeData,
    transactionTypeStatus,
    fetchTransactionTypeList,
  } = useTransactionTypeList();
  const { t: tCommon } = useTranslation('common');
  const { t: tTransactionType } = useTranslation('transactionType');
  const { t: tForm } = useTranslation('form');

  const columns: Array<Column<TransactionTypeData & { action: string }>> = useMemo(
    () => [
      {
        Header: tTransactionType('tableHeaderTransactionTypeCode'),
        accessor: 'code',
      },
      {
        Header: tTransactionType('tableHeaderTransactionTypeName'),
        accessor: 'name',
      },
      {
        Header: tTransactionType('tableHeaderTransactionTypeDescription'),
        accessor: 'description',
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="transactionTypeAction">
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setSelectedTransactionType(row.original);
                showModal();
              }}
            >
              {tCommon('tableActionEdit')}
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
          <Typography variant="h4">{tTransactionType('pageTitle')}</Typography>
          <AuthorizeView access="transaction-type" privileges={['create']}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              sx={{ borderRadius: 2 }}
              onClick={() => {
                setSelectedTransactionType(null);
                showModal();
              }}
            >
              {tTransactionType('pageActionAdd')}
            </Button>
          </AuthorizeView>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">{tTransactionType('filterTransactionTypeCode')}</Typography>
                <TextField
                  value={filterForm.code}
                  onChange={e => {
                    setPagination(oldPagination => ({
                      ...oldPagination,
                      currentPage: 0,
                    }))
                    setFilterForm(oldForm => ({
                      ...oldForm,
                      code: e.target.value
                    }))
                  }
                  }
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', { fieldName: 'transaction type code' })}
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
                <Typography variant="subtitle2">{tTransactionType('filterTransactionTypeName')}</Typography>
                <TextField
                  value={filterForm.name}
                  onChange={e => {
                    setPagination(oldPagination => ({
                      ...oldPagination,
                      currentPage: 0,
                    }))
                    setFilterForm(oldForm => ({
                      ...oldForm,
                      name: e.target.value
                    }))
                  }}
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', { fieldName: 'transaction type name' })}
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
        {transactionTypeStatus === 'loading' && <LoadingPage />}
        {(transactionTypeStatus === 'success' && transactionTypeData.length === 0) && (
          <EmptyList
            title={tCommon('tableEmptyTitle')}
            description={tCommon('tableEmptyDescription', { text: "transaction type" })}
          />
        )}
        {(transactionTypeStatus === 'success' && transactionTypeData.length > 0) && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={transactionTypeData}
                sortBy={sortBy}
                direction={direction}
                onSort={handleSort}
                hideHeaderSort={['action']}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
                <Typography variant="caption" color={Token.color.greyscaleGreyDarkest}>
                  {tCommon('paginationTitle', { totalShowing: transactionTypeData.length, totalData: pagination.totalElements })}
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
        <CreateTransactionTypeModal isActive={isActive} onHide={hideModal} selectedData={selectedTransactionType} fetchTransactionTypeList={fetchTransactionTypeList} />
      )}
    </Stack>
  )
}

export default TransactionTypeManagementList;