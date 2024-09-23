import React, { useMemo, useState } from 'react';
import {
  Typography,
  Stack,
  Card,
  TextField,
  Pagination,
  Grid,
  Autocomplete,
} from '@mui/material';
import {
  Button,
  Token,
  Datatable,
  FormDatePicker,
  renderOptionCheckbox,
} from '@woi/web-component';
import { Column } from 'react-table';
import createDummy from '@woi/core/utils/dummy';
import useModal from '@woi/common/hooks/useModal';
import { reverseDirection } from '@woi/core';
import CreateBillerModal from './components/CreateBillerModal';
import { OptionMap } from '@woi/option';

// Icons
import AddCircleIcon from '@mui/icons-material/AddCircle';

export interface BillerData {
  billerCode: string;
  billerName: string;
  balance: string;
  status: string;
  effectiveDate: string;
}

const BillerManagementList = () => {
  const [sortBy, setSortBy] = useState<keyof BillerData>();
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const [isActive, showModal, hideModal] = useModal();
  const [selectedBiller, setSelectedBiller] = useState<BillerData | null>(null);
  const statusOptions: OptionMap<string>[] = [
    {
      label: 'Active',
      value: 'Active',
    },
    {
      label: 'Inactive',
      value: 'Inactive',
    },
  ];

  const handleSort = (columnId: keyof BillerData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const columns: Array<Column<BillerData & { action: string }>> = useMemo(
    () => [
      {
        Header: 'Biller Code',
        accessor: 'billerCode',
      },
      {
        Header: 'Biller Name',
        accessor: 'billerName',
      },
      {
        Header: 'Saldo',
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
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="billerAction">
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setSelectedBiller(row.original);
                showModal();
              }}
            >
              Details
            </Button>
          </Stack>
        ),
      },
    ],
    [showModal],
  );

  const data: BillerData[] = createDummy(10).map(() => ({
    billerCode: '081234567890',
    billerName: 'Jamob WOI',
    balance: 'Rp 1.000.000',
    effectiveDate: '13 Sept 2021 - 20 Sept 2022',
    status: '',
  }));

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">Biller Management</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            sx={{ borderRadius: 2 }}
            onClick={() => {
              showModal();
              setSelectedBiller(null);
            }}
          >
            Register New Biller
          </Button>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">Biller Code</Typography>
                <TextField
                  fullWidth
                  type="search"
                  placeholder="search biller dode"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  size="small"
                />
              </Stack>
            </Grid>
            <Grid item md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">Biller Name</Typography>
                <TextField
                  fullWidth
                  type="search"
                  placeholder="search biller name"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  size="small"
                />
              </Stack>
            </Grid>
            <Grid item md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">Status</Typography>
                <Autocomplete
                  options={statusOptions}
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
                      placeholder="select status"
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
            <Grid item md={6} xs={12}>
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
      <CreateBillerModal
        isActive={isActive}
        onHide={hideModal}
        selectedData={selectedBiller}
      />
    </Stack>
  );
};

export default BillerManagementList;
