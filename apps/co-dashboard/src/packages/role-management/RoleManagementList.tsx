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
} from '@mui/material';
import {
  Button,
  Token,
  Datatable,
  EmptyList,
  LoadingPage,
} from '@woi/web-component';
import CreateRoleModal from './components/CreateRoleModal';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import useRoleList from './hooks/useRoleList';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { Column } from 'react-table';
import { RoleData } from '@woi/service/co/idp/role/roleList';

const RoleManagementList = () => {
  const [isActive, showModal, hideModal] = useModal();
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
  const {
    searchRole,
    setSearchRole,
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    roleData,
    roleStatus,
    fetchRoleList,
  } = useRoleList();
  const { t: tCommon } = useTranslation('common');
  const { t: tRole } = useTranslation('role');
  const { t: tForm } = useTranslation('form');

  const columns: Array<Column<RoleData & { action: string }>> = useMemo(
    () => [
      {
        Header: tRole('tableHeaderRoleName'),
        accessor: 'name',
      },
      {
        Header: tRole('tableHeaderNumberOfUsers'),
        accessor: 'numberOfUser',
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="roleAction">
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setSelectedRole(row.original);
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

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">{tRole('pageTitle')}</Typography>
          <AuthorizeView access="role" privileges={['create']}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              sx={{ borderRadius: 2 }}
              onClick={() => {
                setSelectedRole(null);
                showModal();
              }}
            >
              {tRole('pageActionAdd')}
            </Button>
          </AuthorizeView>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tRole('filterRoleName')}
                </Typography>
                <TextField
                  value={searchRole}
                  onChange={e => setSearchRole(e.target.value)}
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', {
                    fieldName: 'role name',
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
        {roleStatus === 'loading' && <LoadingPage />}
        {roleStatus === 'success' && roleData.length === 0 && (
          <EmptyList
            title={tCommon('tableEmptyNotFound')}
            description=""
            grayscale
          />
        )}
        {roleStatus === 'success' && roleData.length > 0 && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={roleData}
                sortBy={sortBy}
                direction={direction}
                onSort={handleSort}
                hideHeaderSort={['action']}
              />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography
                  variant="caption"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  {tCommon('paginationTitle', {
                    totalShowing: roleData.length,
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
        <CreateRoleModal
          selectedData={selectedRole}
          isActive={isActive}
          onHide={hideModal}
          fetchRoleList={fetchRoleList}
        />
      )}
    </Stack>
  );
};

export default RoleManagementList;
