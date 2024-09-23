import React, { useMemo, useState } from 'react';
import {
  Typography,
  Stack,
  Card,
  TextField,
  Autocomplete,
  Pagination,
  Grid,
  Box,
  Divider,
} from '@mui/material';
import {
  Token,
  Datatable,
  Chip,
  Button,
  useConfirmationDialog,
  renderOptionCheckbox,
} from '@woi/web-component';
import { Column } from 'react-table';
import createDummy from '@woi/core/utils/dummy';
import { reverseDirection } from '@woi/core';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';

interface UserMaintenanceData {
  loginID: string;
  fullName: string;
  role: string;
  status: string;
}

const UserMaintenanceList = () => {
  const [sortBy, setSortBy] = useState<keyof UserMaintenanceData>();
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const [roleOptions] = useState([
    { label: 'System Admin', value: '' },
    { label: 'CO Admin', value: '' },
  ]);
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const { t: tCommon } = useTranslation('common');

  const handleSort = (columnId: keyof UserMaintenanceData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const handleLockUnlock = async (status: boolean) => {
    const confirmed = await getConfirmation(
      status
        ? {
            title: tCommon('confirmationLockTitle', { text: 'User' }),
            message: tCommon('confirmationLockDescription', { text: 'User' }),
            primaryText: tCommon('confirmationLockYes'),
            secondaryText: tCommon('confirmationLockNo'),
          }
        : {
            title: tCommon('confirmationUnlockTitle', { text: 'User' }),
            message: tCommon('confirmationUnlockDescription', { text: 'User' }),
            primaryText: tCommon('confirmationUnlockYes'),
            secondaryText: tCommon('confirmationUnlockNo'),
          },
    );

    if (confirmed) {
      enqueueSnackbar(
        status
          ? tCommon('successLock', { text: 'User' })
          : tCommon('successUnlock', { text: 'User' }),
        { variant: 'info' },
      );
    }
  };

  const columns: Array<Column<UserMaintenanceData & { action: string }>> =
    useMemo(
      () => [
        {
          Header: 'Login ID',
          accessor: 'loginID',
        },
        {
          Header: 'Full Name',
          accessor: 'fullName',
        },
        {
          Header: 'Role',
          accessor: 'role',
        },
        {
          Header: 'Status',
          accessor: 'status',
        },
        {
          Header: 'Action',
          accessor: 'action',
          Cell: () => (
            <Stack direction="row" spacing={2} key="userMaintenanceAction">
              <Button
                variant="text"
                size="small"
                onClick={() => handleLockUnlock(true)}
              >
                Lock
              </Button>
              <Box>
                <Divider orientation="vertical" />
              </Box>
              <Button
                variant="text"
                size="small"
                onClick={() => handleLockUnlock(false)}
              >
                Unlock
              </Button>
            </Stack>
          ),
        },
      ],
      [],
    );

  const data: UserMaintenanceData[] = createDummy(10).map(() => ({
    loginID: 'sudosu',
    fullName: 'Sudosu1',
    role: 'System Admin',
    status: 'Active',
  }));

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">User Maintenance</Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">Login ID</Typography>
                <TextField
                  fullWidth
                  type="search"
                  placeholder="search login ID"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  size="small"
                />
              </Stack>
            </Grid>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">Full Name</Typography>
                <TextField
                  fullWidth
                  type="search"
                  placeholder="search full name"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  size="small"
                />
              </Stack>
            </Grid>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">Role</Typography>
                <Autocomplete
                  options={roleOptions}
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
                      placeholder="select admin type"
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
          </Grid>
        </Card>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              variant="outlined"
              label="Login ID: sudosu"
              color="primary"
              deleteIcon={<CloseIcon />}
            />
            <Chip
              variant="outlined"
              label="Fullname: Sudosu1"
              color="primary"
              deleteIcon={<CloseIcon />}
            />
          </Stack>
          <Button variant="text" color="primary" startIcon={<RefreshIcon />}>
            Reset
          </Button>
        </Stack>
        <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
          <Stack direction="column" spacing={2}>
            <Datatable
              columns={columns as Column<object>[]}
              data={data}
              sortBy={sortBy}
              direction={direction}
              onSort={handleSort}
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
                Showing 5 of 125 entries
              </Typography>
              <Pagination count={10} color="primary" />
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
};

export default UserMaintenanceList;
