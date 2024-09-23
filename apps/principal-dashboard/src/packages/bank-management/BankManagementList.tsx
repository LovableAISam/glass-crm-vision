// Cores
import React, { useMemo, useState } from 'react';

// Components
import { Typography, Stack, Card, TextField, Pagination, Grid } from '@mui/material';
import { Button, Token, Datatable, EmptyList, LoadingPage } from '@woi/web-component';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateBankModal from './components/CreateBankModal';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import useBankList from './hooks/useBankList';
import { batch } from '@woi/core';
import { useTranslation } from 'react-i18next';

// Types & Constants
import { Column } from 'react-table';
import { BankData } from '@woi/service/principal/admin/bank/bankList';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';

const BankManagementList = () => {
  const [isActive, showModal, hideModal] = useModal();
  const [selectedBank, setSelectedBank] = useState<BankData | null>(null);
  const {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    bankData,
    bankStatus,
    fetchBankList,
  } = useBankList();
  const { t: tCommon } = useTranslation('common');
  const { t: tBank } = useTranslation('bank');
  const { t: tForm } = useTranslation('form');

  const columns: Array<Column<BankData & { action: string }>> = useMemo(
    () => [
      {
        Header: tBank('tableHeaderName'),
        accessor: 'name',
      },
      {
        Header: tBank('tableHeaderFullname'),
        accessor: 'fullName',
      },
      {
        Header: tBank('tableHeaderStatus'),
        accessor: 'status',
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="bankAction">
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setSelectedBank(row.original);
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
          <Typography variant="h4">{tBank('pageTitle')}</Typography>
          <AuthorizeView access="bank" privileges={['create']}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              sx={{ borderRadius: 2 }}
              onClick={() => {
                setSelectedBank(null);
                showModal();
              }}
            >
              {tBank('pageActionAdd')}
            </Button>
          </AuthorizeView>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">{tBank('tableHeaderFullname')}</Typography>
                <TextField
                  value={filterForm.search}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        search: e.target.value
                      }));
                    });
                  }}
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', { fieldName: 'bank name' })}
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
        {bankStatus === 'loading' && <LoadingPage />}
        {(bankStatus === 'success' && bankData.length === 0) && (
          <EmptyList
            title={tCommon('tableEmptyTitle')}
            description={tCommon('tableEmptyDescription', { text: "bank" })}
          />
        )}
        {(bankStatus === 'success' && bankData.length > 0) && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={bankData}
                sortBy={sortBy}
                direction={direction}
                onSort={handleSort}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
                <Typography variant="caption" color={Token.color.greyscaleGreyDarkest}>
                  {tCommon('paginationTitle', { totalShowing: bankData.length, totalData: pagination.totalElements })}
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
        <CreateBankModal isActive={isActive} onHide={hideModal} selectedData={selectedBank} fetchBankList={fetchBankList} />
      )}
    </Stack>
  )
}

export default BankManagementList;