// Cores
import React, { useMemo, useState } from 'react';

// Components
import { Typography, Stack, Card, TextField, Autocomplete, Pagination, Grid } from '@mui/material';
import { Button, Token, Datatable, EmptyList, LoadingPage, Markdown, renderOptionCheckbox } from '@woi/web-component';
import { Column } from 'react-table';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateBankFAQScreenModal from './components/CreateBankFAQScreenModal';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import useBankFAQList from './hooks/useBankFAQList';
import { batch } from '@woi/core';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { BankFAQData } from '@woi/service/principal/admin/bankFAQ/bankFAQList';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';

const BankFAQScreenList = () => {
  const [isActive, showModal, hideModal] = useModal();
  const [selectedBankFAQ, setSelectedBankFAQ] = useState<BankFAQData | null>(null);
  const {
    bankOptions,
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    bankFAQData,
    bankFAQStatus,
    fetchBankFAQList,
  } = useBankFAQList();
  const { t: tCommon } = useTranslation('common');
  const { t: tBankFAQ } = useTranslation('bankFAQ');
  const { t: tForm } = useTranslation('form');

  const columns: Array<Column<BankFAQData & { action: string }>> = useMemo(
    () => [
      {
        Header: tBankFAQ('tableHeaderHeader'),
        accessor: 'header',
      },
      {
        Header: tBankFAQ('tableHeaderContent'),
        accessor: 'content',
        Cell: ({ value }) => (
          <Markdown
            typographyProps={{
              variant: 'body2',
            }}
            key="content"
          >
            {value}
          </Markdown>
        )
      },
      {
        Header: tBankFAQ('tableHeaderBankName'),
        accessor: 'bank',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="bank">{value.name}</Typography>
        )
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="bankFAQAction">
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setSelectedBankFAQ(row.original);
                showModal();
              }}>
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
          <Typography variant="h4">{tBankFAQ('pageTitle')}</Typography>
          <AuthorizeView access="bank-faq" privileges={['create']}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              sx={{ borderRadius: 2 }}
              onClick={() => {
                setSelectedBankFAQ(null);
                showModal();
              }}
            >
              {tBankFAQ('pageActionAdd')}
            </Button>
          </AuthorizeView>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">{tBankFAQ('filterBankFAQHeader')}</Typography>
                <TextField
                  value={filterForm.header}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        header: e.target.value
                      }));
                    });
                  }}
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', { fieldName: 'bank FAQ header' })}
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
                <Typography variant="subtitle2">{tBankFAQ('filterBankFAQContent')}</Typography>
                <TextField
                  value={filterForm.content}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        content: e.target.value
                      }));
                    });
                  }}
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', { fieldName: 'bank FAQ content' })}
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
                <Typography variant="subtitle2">{tBankFAQ('filterBankName')}</Typography>
                <Autocomplete
                  value={filterForm.bank}
                  onChange={(_, value) => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        bank: value,
                      }))
                    });
                  }}
                  options={bankOptions}
                  fullWidth
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={tForm('placeholderSelect', { fieldName: 'bank' })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3
                        }
                      }}
                    />
                  )}
                  multiple
                  limitTags={1}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  renderOption={renderOptionCheckbox}
                />
              </Stack>
            </Grid>
          </Grid>
        </Card>
        {bankFAQStatus === 'loading' && <LoadingPage />}
        {(bankFAQStatus === 'success' && bankFAQData.length === 0) && (
          <EmptyList
            title={tCommon('tableEmptyTitle')}
            description={tCommon('tableEmptyDescription', { text: "bank FAQ" })}
          />
        )}
        {(bankFAQStatus === 'success' && bankFAQData.length > 0) && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={bankFAQData}
                sortBy={sortBy}
                direction={direction}
                onSort={handleSort}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
                <Typography variant="caption" color={Token.color.greyscaleGreyDarkest}>
                  {tCommon('paginationTitle', { totalShowing: bankFAQData.length, totalData: pagination.totalElements })}
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
        <CreateBankFAQScreenModal isActive={isActive} onHide={hideModal} selectedData={selectedBankFAQ} fetchBankFAQList={fetchBankFAQList} />
      )}
    </Stack>
  )
}

export default BankFAQScreenList;