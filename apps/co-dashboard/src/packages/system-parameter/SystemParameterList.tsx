import React, { useMemo, useState } from 'react';
import {
  Typography,
  Stack,
  Card,
  TextField,
  Pagination,
  Grid,
} from '@mui/material';
import {
  Button,
  Token,
  Datatable,
  LoadingPage,
  EmptyList,
} from '@woi/web-component';
import { Column } from 'react-table';
import { useTranslation } from 'react-i18next';
import { batch } from '@woi/core';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import CreateSystemParameterModal from './components/CreateSystemParameterModal';
import useSystemParameterList from './hooks/useSystemParameterList';
import { SystemParameterData } from '@woi/service/co/admin/systemParameter/systemParameterList';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';

// Icons
import AddCircleIcon from '@mui/icons-material/AddCircle';

const SystemParameterList = () => {
  const { t: tCommon } = useTranslation('common');
  const { t: tForm } = useTranslation('form');
  const [isActive, showModal, hideModal] = useModal();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    sortBy,
    handleSort,
    direction,
    systemParameterData,
    pagination,
    setPagination,
    filterForm,
    setFilterForm,
    fetchSystemParameterList,
    systemParameterStatus,
  } = useSystemParameterList();

  const [selectedId, setSelectedId] = useState<SystemParameterData | null>(
    null,
  );

  const columns: Array<Column<SystemParameterData & { action: string }>> =
    useMemo(
      () => [
        {
          Header: 'Code',
          accessor: 'code',
        },
        {
          Header: 'Value',
          accessor: 'valueType',
          Cell: ({ value, row }) => (
            <Typography variant="inherit" key="role">
              {value === 'Text'
                ? row.original.valueText
                : row.original.valueDate}
            </Typography>
          ),
        },
        {
          Header: 'Description',
          accessor: 'description',
        },
        {
          Header: 'Action',
          accessor: 'action',
          Cell: ({ row }) => (
            <Stack direction="row" spacing={2} key="detailAction">
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  setSelectedId(row.original);
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

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">System Parameter</Typography>
          <AuthorizeView access="system-parameter" privileges={['create']}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              sx={{ borderRadius: 2, display: 'none' }}
              onClick={() => {
                setSelectedId(null);
                showModal();
              }}
            >
              Add System Parameter
            </Button>
          </AuthorizeView>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">Code</Typography>
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
                  placeholder={tForm('placeholderType', {
                    fieldName: 'code',
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
          </Grid>
        </Card>
        {systemParameterStatus === 'loading' && <LoadingPage />}
        {systemParameterStatus === 'success' &&
          systemParameterData.length === 0 && (
            <EmptyList
              title={tCommon('tableEmptyNotFound')}
              description=""
              grayscale
            />
          )}
        {systemParameterStatus === 'success' && systemParameterData.length > 0 && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={systemParameterData}
                sortBy={sortBy}
                direction={direction}
                onSort={handleSort}
                hideHeaderSort={['action', 'valueType', 'description']}
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
                    totalShowing: systemParameterData.length,
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
      <CreateSystemParameterModal
        isActive={isActive}
        onHide={hideModal}
        selectedData={selectedId}
        setSelectedId={setSelectedId}
        fetchSystemParameterList={fetchSystemParameterList}
        showModal={showModal}
        setLoading={setLoading}
        loading={loading}
      />
    </Stack>
  );
};

export default SystemParameterList;
