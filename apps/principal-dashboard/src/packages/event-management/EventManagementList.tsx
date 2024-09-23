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
import CreateEventModal from './components/CreateEventModal';
import { reverseDirection } from '@woi/core';

// Icons
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface EventData {
  code: string;
  name: string;
  date: string;
}

const EventManagementList = () => {
  const [sortBy, setSortBy] = useState<keyof EventData>();
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const [isActive, showModal, hideModal] = useModal();
  const [coOptions] = useState([
    { label: 'WOI', value: '' },
    { label: 'Goodie', value: '' },
    { label: 'TokoBaru', value: '' },
    { label: 'MentimunPay', value: '' },
    { label: 'KFCPay', value: '' },
  ]);

  const handleSort = (columnId: keyof EventData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const columns: Array<Column<EventData & { action: string }>> = useMemo(
    () => [
      {
        Header: 'Event Code',
        accessor: 'code',
      },
      {
        Header: 'Event Name',
        accessor: 'name',
      },
      {
        Header: 'Event Date',
        accessor: 'date',
      },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: () => (
          <Stack direction="row" spacing={2} key="eventAction">
            <Button variant="text" size="small" onClick={showModal}>
              Details
            </Button>
          </Stack>
        ),
      },
    ],
    [showModal],
  );

  const data: EventData[] = createDummy(10).map(() => ({
    code: '001',
    name: 'SEPTEMBER CERIA',
    date: '3 Aug 2021 - 9 Sep 2021',
  }));

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">Event Management</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            sx={{ borderRadius: 2 }}
            onClick={showModal}
          >
            Add Event
          </Button>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">Event Code</Typography>
                <TextField
                  fullWidth
                  type="search"
                  placeholder="search event code"
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
                <Typography variant="subtitle2">Event Name</Typography>
                <TextField
                  fullWidth
                  type="search"
                  placeholder="search event name"
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
      <CreateEventModal isActive={isActive} onHide={hideModal} />
    </Stack>
  );
};

export default EventManagementList;
