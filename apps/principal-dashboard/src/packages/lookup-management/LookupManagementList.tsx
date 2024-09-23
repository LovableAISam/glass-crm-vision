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
  renderOptionCheckbox,
} from '@woi/web-component';
import { Column } from 'react-table';
import createDummy from '@woi/core/utils/dummy';
import useModal from '@woi/common/hooks/useModal';
import CreateLookupModal from './components/CreateLookupModal';
import { reverseDirection } from '@woi/core';

// Icons
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface LookupData {
  groupCode: string;
  code: string;
  value: string;
  status: string;
}

const LookupManagementList = () => {
  const [sortBy, setSortBy] = useState<keyof LookupData>();
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const [isActive, showModal, hideModal] = useModal();
  const [lookupGroupOptions] = useState([
    { label: 'CURRENCY_ALPHABET', value: '' },
    { label: 'CURRENCY_NUM', value: '' },
    { label: 'GENDER', value: '' },
    { label: 'IDC_CONTACT', value: '' },
    { label: 'CURRENCY_ALPHABET', value: '' },
  ]);

  const handleSort = (columnId: keyof LookupData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const columns: Array<Column<LookupData & { action: string }>> = useMemo(
    () => [
      {
        Header: 'Lookup Group Code',
        accessor: 'groupCode',
      },
      {
        Header: 'Lookup Code',
        accessor: 'code',
      },
      {
        Header: 'Lookup Name',
        accessor: 'value',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: () => (
          <Stack direction="row" spacing={2} key="lookupAction">
            <Button variant="text" size="small" onClick={showModal}>
              Details
            </Button>
          </Stack>
        ),
      },
    ],
    [showModal],
  );

  const data: LookupData[] = createDummy(10).map(() => ({
    groupCode: 'CURRENCY_ALPHABET',
    code: 'IDR',
    value: 'IDR',
    status: 'Y',
  }));

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">Lookup Management</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            sx={{ borderRadius: 2 }}
            onClick={showModal}
          >
            Add Lookup
          </Button>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">Lookup Group Code</Typography>
                <Autocomplete
                  options={lookupGroupOptions}
                  fullWidth
                  size="small"
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder="select lookup group"
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
      <CreateLookupModal isActive={isActive} onHide={hideModal} />
    </Stack>
  );
};

export default LookupManagementList;
