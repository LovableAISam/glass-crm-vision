// Cores
import React, { useMemo, useState } from 'react';

// Components
import { Typography, Stack, Card, TextField, Pagination, Grid } from '@mui/material';
import { Button, Token, Datatable, EmptyList, LoadingPage } from '@woi/web-component';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateLayeringApprovalModal from './components/CreateLayeringApprovalModal';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import useLayeringApprovalList from './hooks/useLayeringApprovalList';
import { batch } from '@woi/core';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { Column } from 'react-table';
import { ApprovalLayerData } from '@woi/service/principal/admin/approvalLayer/approvalLayerList';

const LayeringApprovalList = () => {
  const [isActive, showModal, hideModal] = useModal();
  const [selectedApprovalLayer, setSelectedApprovalLayer] = useState<ApprovalLayerData | null>(null);
  const {
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    approvalLayerData,
    approvalLayerStatus,
    fetchApprovalLayerList,
  } = useLayeringApprovalList();
  const { t: tCommon } = useTranslation('common');
  const { t: tLayeringApproval } = useTranslation('layeringApproval');
  const { t: tForm } = useTranslation('form');

  const columns: Array<Column<ApprovalLayerData & { action: string }>> = useMemo(
    () => [
      {
        Header: tLayeringApproval('tableHeaderMenu'),
        accessor: 'menu',
      },
      {
        Header: tLayeringApproval('tableHeaderLayeringApprovalAmount'),
        accessor: 'id',
      },
      {
        Header: tLayeringApproval('tableHeaderRole'),
        accessor: 'role',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="role">{value?.map(data => data.role).join(', ')}</Typography>
        )
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="approvalLayerAction">
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setSelectedApprovalLayer(row.original);
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
          <Typography variant="h4">{tLayeringApproval('pageTitle')}</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            sx={{ borderRadius: 2 }}
            onClick={() => {
              showModal();
              setSelectedApprovalLayer(null);
            }}
          >
            {tLayeringApproval('pageActionAdd')}
          </Button>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">{tLayeringApproval('formMenu')}</Typography>
                <TextField
                  value={filterForm.menu}
                  onChange={e => {
                    batch(() => {
                      setPagination(oldPagination => ({
                        ...oldPagination,
                        currentPage: 0,
                      }));
                      setFilterForm(oldForm => ({
                        ...oldForm,
                        menu: e.target.value
                      }));
                    });
                  }}
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', { fieldName: 'menu' })}
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
        {approvalLayerStatus === 'loading' && <LoadingPage />}
        {(approvalLayerStatus === 'success' && approvalLayerData.length === 0) && (
          <EmptyList
            title={tCommon('tableEmptyTitle')}
            description={tCommon('tableEmptyDescription', { text: "approval layer" })}
          />
        )}
        {(approvalLayerStatus === 'success' && approvalLayerData.length > 0) && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={approvalLayerData}
                sortBy={sortBy}
                direction={direction}
                onSort={handleSort}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
                <Typography variant="caption" color={Token.color.greyscaleGreyDarkest}>
                  {tCommon('paginationTitle', { totalShowing: approvalLayerData.length, totalData: pagination.totalElements })}
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
        <CreateLayeringApprovalModal isActive={isActive} onHide={hideModal} selectedData={selectedApprovalLayer} fetchApprovalLayerList={fetchApprovalLayerList} />
      )}
    </Stack>
  )
}

export default LayeringApprovalList;