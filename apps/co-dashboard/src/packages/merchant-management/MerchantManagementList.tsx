// Cores
import React, { useMemo } from 'react';

// Components
import {
  Autocomplete,
  Box,
  Card,
  Divider,
  Grid,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Button,
  Datatable,
  EmptyList,
  FormDatePicker,
  LoadingPage,
  PriceCell,
  Token,
} from '@woi/web-component';
import { useRouter } from 'next/router';
import CreateMerchantModal from './components/CreateMerchantModal';
import ViewMerchantModal from './components/ViewMerchantModal';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import { DateConvert, batch } from '@woi/core';
import { useTranslation } from 'react-i18next';
import useMerchantList from './hooks/useMerchantList';
import { MerchantDataList } from '@woi/service/co/merchant/merchantList';

// Types & Consts
import { Column } from 'react-table';
import { MEDIUM_DATE_FORMAT } from '@woi/core/utils/date/constants';

// Assets
import AddCircleIcon from '@mui/icons-material/AddCircle';

const MerchantManagementList = () => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tMerchant } = useTranslation('merchant');
  const { t: tForm } = useTranslation('form');

  const [isActiveView, showModalView, hideModalView] = useModal();
  const [isActiveCreate, showModalCreate, hideModalCreate] = useModal();

  const {
    setSelectEdit,
    sortBy,
    direction,
    handleSort,
    pagination,
    setPagination,
    setSelectView,
    merchantDetail,
    selectEdit,
    setFilterForm,
    filterForm,
    setMerchantDetail,
    statusOptions,
    merchantListData,
    merchantListStatus,
    fetchMerchantList,
    qrContent
  } = useMerchantList({ showModalView, showModalCreate });

  const columns: Array<Column<MerchantDataList & { action: string; }>> = useMemo(
    () => [
      {
        Header: tMerchant('tableHeaderMerchantCode'),
        accessor: 'merchantCode',
      },
      {
        Header: tMerchant('tableHeaderMerchantName'),
        accessor: 'merchantCompleteName',
      },
      {
        Header: tMerchant('tableHeaderStatus'),
        accessor: 'status',
        Cell: ({ row }) => (
          <Typography variant="inherit" key="status">
            {row.original.status === 'true'
              ? tMerchant('statusActive')
              : tMerchant('statusInactive')}
          </Typography>
        ),
      },
      {
        Header: tMerchant('tableHeaderBalance'),
        accessor: 'balance',
        Cell: ({ row }) => (
          <PriceCell
            value={Boolean(row.original.balance) ? row.original.balance : 0}
            router={router}
          />
        ),
      },
      {
        Header: tMerchant('filterEffectiveDate'),
        accessor: 'effectiveDateFrom',
        Cell: ({ row }) => (
          <Typography variant="inherit" key="effectiveDate">
            {DateConvert.stringToDateFormat(
              row.original.effectiveDateFrom,
              MEDIUM_DATE_FORMAT,
            )}{' '}
            -{' '}
            {DateConvert.stringToDateFormat(
              row.original.effectiveDateTo,
              MEDIUM_DATE_FORMAT,
            )}
          </Typography>
        ),
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="merchantAction">
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setSelectView(row.original);
              }}
            >
              {tCommon('actionView')}
            </Button>
            <Box>
              <Divider orientation="vertical" />
            </Box>
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setSelectEdit(row.original);
              }}
            >
              {tCommon('actionEdit')}
            </Button>
          </Stack>
        ),
      },
    ],
    [showModalCreate],
  );

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">{tMerchant('pageTitle')}</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            sx={{ borderRadius: 2 }}
            onClick={() => {
              showModalCreate();
              setSelectEdit(null);
              setMerchantDetail(null);
            }}
          >
            {tMerchant('pageActionAdd')}
          </Button>
        </Stack>
        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: '0px 2px 12px rgba(137, 168, 191, 0.15)',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xl={6} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tMerchant('filterMerchantName')}
                </Typography>
                <TextField
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', {
                    fieldName: 'merchant name',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  value={filterForm.merchantName}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        merchantName: e.target.value,
                      }));
                    });
                  }}
                  size="small"
                />
              </Stack>
            </Grid>
            <Grid item xl={6} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tMerchant('filterMerchantCode')}
                </Typography>
                <TextField
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', {
                    fieldName: 'merchant code',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  size="small"
                  value={filterForm.merchantCode}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        merchantCode: e.target.value,
                      }));
                    });
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xl={6} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tMerchant('filterStatus')}
                </Typography>
                <Autocomplete
                  options={statusOptions}
                  value={
                    filterForm.status === ''
                      ? null
                      : statusOptions.find(
                        item =>
                          item.value ===
                          (filterForm.status ? 'ACTIVE' : 'INACTIVE'),
                      )
                  }
                  fullWidth
                  size="small"
                  onChange={(_, value) => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => {
                        const selectedValue = value?.value;
                        const selectedStatus = statusOptions.find(
                          item => item.value === selectedValue,
                        );
                        if (value === null) {
                          return { ...oldForm, status: '' };
                        } else if (selectedStatus?.value === 'ACTIVE') {
                          return { ...oldForm, status: true };
                        } else {
                          return { ...oldForm, status: false };
                        }
                      });
                    });
                  }}
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
            <Grid item xl={6} md={6} xs={12}>
              <FormDatePicker
                title={tMerchant('filterEffectiveDate')}
                size="small"
                placeholder={tForm('placeholderSelect', { fieldName: 'date' })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
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
              />
            </Grid>
          </Grid>
        </Card>
        {merchantListStatus === 'loading' && <LoadingPage />}
        {merchantListStatus === 'success' && merchantListData.length === 0 && (
          <EmptyList
            title={tCommon('tableEmptyTitle')}
            description={tCommon('tableEmptyDescription', { text: 'merchant' })}
            grayscale
          />
        )}
        {merchantListStatus === 'success' && merchantListData.length > 0 && (
          <React.Fragment>
            <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
              <Stack direction="column" spacing={2}>
                <Datatable
                  columns={columns as Column<object>[]}
                  data={merchantListData}
                  sortBy={sortBy}
                  direction={direction}
                  onSort={handleSort}
                  hideHeaderSort={['action', 'merchantCode', 'balance']}
                />
              </Stack>
            </Card>
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
                  totalShowing: merchantListData.length,
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
          </React.Fragment>
        )}
      </Stack>

      {isActiveCreate && (
        <CreateMerchantModal
          isActive={isActiveCreate}
          onHide={() => {
            hideModalCreate();
            setSelectEdit(null);
          }}
          merchantDetail={merchantDetail}
          selectEdit={selectEdit}
          fetchMerchantList={fetchMerchantList}
          setSelectEdit={setSelectEdit}
        />
      )}

      {merchantDetail && isActiveView && (
        <ViewMerchantModal
          isActive={isActiveView}
          onHide={() => {
            hideModalView();
            setSelectView(null);
          }}
          merchantDetail={merchantDetail}
          qrContent={qrContent}
        />
      )}
    </Stack>
  );
};

export default MerchantManagementList;
