import React, { useMemo, useState } from 'react';
import {
  Typography,
  Stack,
  Card,
  TextField,
  Autocomplete,
  Divider,
  Box,
  Pagination,
  Grid,
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
import CreateWhiteListModal from './components/CreateWhiteListModal';
import { reverseDirection } from '@woi/core';

// Icons
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface WhiteListData {
  co: string;
  ipAddress: string;
  description: string;
  type: string;
}

const WhiteList = () => {
  const [sortBy, setSortBy] = useState<keyof WhiteListData>();
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const [typeOptions] = useState([
    { label: 'SCP TYPE', value: '' },
    { label: 'NON SCP TYPE', value: '' },
    { label: 'OTHER TYPE', value: '' },
  ]);
  const [coOptions] = useState([
    { label: 'WOI', value: '' },
    { label: 'Goodie', value: '' },
    { label: 'TokoBaru', value: '' },
    { label: 'MentimunPay', value: '' },
    { label: 'KFCPay', value: '' },
  ]);
  const [isActive, showModal, hideModal] = useModal();

  const handleSort = (columnId: keyof WhiteListData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const columns: Array<Column<WhiteListData & { action: string }>> = useMemo(
    () => [
      {
        Header: 'CO',
        accessor: 'co',
      },
      {
        Header: 'IP Address',
        accessor: 'ipAddress',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: () => (
          <Stack direction="row" spacing={2} key="whiteListAction">
            <Button variant="text" size="small" onClick={showModal}>
              Edit
            </Button>
            <Box>
              <Divider orientation="vertical" />
            </Box>
            <Button variant="text" size="small">
              Delete
            </Button>
          </Stack>
        ),
      },
    ],
    [showModal],
  );

  const data: WhiteListData[] = createDummy(10).map(() => ({
    co: 'WOI',
    ipAddress: 'IP Address',
    description: 'Test Description',
    type: 'SCP TYPE',
  }));

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">White List</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            sx={{ borderRadius: 2 }}
            onClick={showModal}
          >
            Add White List
          </Button>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={6} md={6} xs={12}>
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
            <Grid item xl={6} md={6} xs={12}>
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
      <CreateWhiteListModal isActive={isActive} onHide={hideModal} />
    </Stack>
  );
};

export default WhiteList;
