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
  Button,
  Token,
  Datatable,
  Chip,
  FormDatePicker,
  renderOptionCheckbox,
} from '@woi/web-component';
import { Column } from 'react-table';
import createDummy from '@woi/core/utils/dummy';
import useModal from '@woi/common/hooks/useModal';
import CreateCOBrandModal from './components/CreateCOBrandModal';
import { reverseDirection } from '@woi/core';

// Icons
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';

interface COBrandData {
  co: string;
  merchantCode: string;
  merchantName: string;
  balance: string;
  status: string;
  effectiveDate: string;
}

const COBrandList = () => {
  const [sortBy, setSortBy] = useState<keyof COBrandData>();
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const [statusOptions] = useState([
    { label: 'Active', value: '' },
    { label: 'Inactive', value: '' },
    { label: 'Disabled', value: '' },
    { label: 'Please Verify', value: '' },
  ]);
  const [coOptions] = useState([
    { label: 'WOI', value: '' },
    { label: 'Goodie', value: '' },
    { label: 'TokoBaru', value: '' },
    { label: 'MentimunPay', value: '' },
    { label: 'KFCPay', value: '' },
  ]);
  const [isActive, showModal, hideModal] = useModal();

  const handleSort = (columnId: keyof COBrandData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const columns: Array<Column<COBrandData & { action: string }>> = useMemo(
    () => [
      {
        Header: 'CO',
        accessor: 'co',
      },
      {
        Header: 'Merchant Code',
        accessor: 'merchantCode',
      },
      {
        Header: 'Merchant Name',
        accessor: 'merchantName',
      },
      {
        Header: 'Balance',
        accessor: 'balance',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Effective Date',
        accessor: 'effectiveDate',
      },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: () => (
          <Stack direction="row" spacing={2} key="coBrandAction">
            <Button variant="text" size="small" onClick={showModal}>
              Edit
            </Button>
          </Stack>
        ),
      },
    ],
    [showModal],
  );

  const data: COBrandData[] = createDummy(10).map(() => ({
    co: 'WOI',
    merchantCode: 'CB.Fri.821361890020',
    merchantName: 'Mentimun',
    balance: 'Rp 1.000.000',
    status: 'Active',
    effectiveDate: '13 Apr 2020 - 20 Jan 2022',
  }));

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">Co Brand</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            sx={{ borderRadius: 2 }}
            onClick={showModal}
          >
            Register New Brand/Merchant
          </Button>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">CO</Typography>
                <Autocomplete
                  options={coOptions}
                  fullWidth
                  size="small"
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder="select co"
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
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">Merchant Code</Typography>
                <TextField
                  fullWidth
                  type="search"
                  placeholder="search merchant code"
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
                <Typography variant="subtitle2">Merchant Name</Typography>
                <TextField
                  fullWidth
                  type="search"
                  placeholder="search merchant name"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  size="small"
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
            label="Status: Active"
            color="primary"
            deleteIcon={<CloseIcon />}
          />
          <Chip
            variant="outlined"
            label="CO: WOI"
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
      <CreateCOBrandModal isActive={isActive} onHide={hideModal} />
    </Stack>
  );
};

export default COBrandList;
