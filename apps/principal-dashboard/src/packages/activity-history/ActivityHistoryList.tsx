import React, { useMemo, useState } from 'react';
import {
  Typography,
  Stack,
  Card,
  TextField,
  Autocomplete,
  Pagination,
  Grid,
} from '@mui/material';
import {
  Token,
  Datatable,
  Chip,
  FormDatePicker,
  renderOptionCheckbox,
} from '@woi/web-component';
import { Column } from 'react-table';
import createDummy from '@woi/core/utils/dummy';
import { reverseDirection } from '@woi/core';

// Icons
import CloseIcon from '@mui/icons-material/Close';

interface ActivityHistoryData {
  fromUser: string;
  toUser: string;
  memberAccount: string;
  status: string;
  date: string;
  type: string;
}

const ActivityHistoryList = () => {
  const [sortBy, setSortBy] = useState<keyof ActivityHistoryData>();
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const [statusOptions] = useState([
    { label: 'Approved', value: '' },
    { label: 'Denied', value: '' },
  ]);
  const [typeOptions] = useState([
    { label: 'Login Dashboard', value: '' },
    { label: 'Reset Password', value: '' },
    { label: 'Biller Management', value: '' },
    { label: 'KYC Request', value: '' },
  ]);

  const handleSort = (columnId: keyof ActivityHistoryData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const columns: Array<Column<ActivityHistoryData & { action: string }>> =
    useMemo(
      () => [
        {
          Header: 'From User',
          accessor: 'fromUser',
        },
        {
          Header: 'To User',
          accessor: 'toUser',
        },
        {
          Header: 'Member Account',
          accessor: 'memberAccount',
        },
        {
          Header: 'Status',
          accessor: 'status',
        },
        {
          Header: 'Date',
          accessor: 'date',
        },
        {
          Header: 'Type',
          accessor: 'type',
        },
      ],
      [],
    );

  const data: ActivityHistoryData[] = createDummy(10).map(() => ({
    fromUser: 'admin',
    toUser: 'superadmin',
    memberAccount: 'Sat.0123816981012',
    status: 'Approved',
    date: '09 Apr 2020',
    type: 'Biller Management',
  }));

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">Activity History</Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">From User</Typography>
                <TextField
                  fullWidth
                  type="search"
                  placeholder="search from user"
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
                <Typography variant="subtitle2">To User</Typography>
                <TextField
                  fullWidth
                  type="search"
                  placeholder="search to user"
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
                <Typography variant="subtitle2">Type</Typography>
                <Autocomplete
                  options={typeOptions}
                  fullWidth
                  size="small"
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder="select type"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                    />
                  )}
                  multiple
                  limitTags={1}
                  disableCloseOnSelect
                  getOptionLabel={option => option.label}
                  renderOption={renderOptionCheckbox}
                />
              </Stack>
            </Grid>
            <Grid item xl={6} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">Status</Typography>
                <Autocomplete
                  options={statusOptions}
                  fullWidth
                  size="small"
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder="select status"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                    />
                  )}
                  multiple
                  limitTags={1}
                  disableCloseOnSelect
                  getOptionLabel={option => option.label}
                  renderOption={renderOptionCheckbox}
                />
              </Stack>
            </Grid>
            <Grid item xl={6} md={6} xs={12}>
              <FormDatePicker
                title="Filter Date"
                size="small"
                placeholder="select date"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
            </Grid>
          </Grid>
        </Card>
        <Stack direction="row" spacing={2}>
          <Chip
            variant="outlined"
            label="Status: Approved"
            color="primary"
            deleteIcon={<CloseIcon />}
          />
          <Chip
            variant="outlined"
            label="Type: Biller Management"
            color="primary"
            deleteIcon={<CloseIcon />}
          />
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

export default ActivityHistoryList;
