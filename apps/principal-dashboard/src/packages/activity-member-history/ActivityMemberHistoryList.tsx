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
import { useTranslation } from 'react-i18next';

// Icons
import CloseIcon from '@mui/icons-material/Close';

interface ActivityMemberHistoryData {
  createdDate: string;
  createdTime: string;
  refId: string;
  account: string;
  type: string;
  description: string;
}

const ActivityMemberHistoryList = () => {
  const [sortBy, setSortBy] = useState<keyof ActivityMemberHistoryData>();
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const [typeOptions] = useState([{ label: 'Top Up', value: '' }]);
  const { t: tActivityMember } = useTranslation('activityMember');
  const { t: tForm } = useTranslation('form');

  const handleSort = (columnId: keyof ActivityMemberHistoryData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const columns: Array<Column<ActivityMemberHistoryData>> = useMemo(
    () => [
      {
        Header: tActivityMember('tableHeaderCreatedDate'),
        accessor: 'createdDate',
        Cell: ({ value, row }) => (
          <Stack direction="row" spacing={2} key="createdDate">
            <Typography variant="inherit">{value}</Typography>
            <Typography
              variant="inherit"
              color={Token.color.greyscaleGreyDarkest}
            >
              ●
            </Typography>
            <Typography
              variant="inherit"
              color={Token.color.greyscaleGreyDarkest}
            >
              {row.original.createdTime}
            </Typography>
          </Stack>
        ),
      },
      {
        Header: tActivityMember('tableHeaderRefID'),
        accessor: 'refId',
      },
      {
        Header: tActivityMember('tableHeaderAccountNumber'),
        accessor: 'account',
      },
      {
        Header: tActivityMember('tableHeaderType'),
        accessor: 'type',
      },
      {
        Header: tActivityMember('tableHeaderDescription'),
        accessor: 'description',
      },
    ],
    [],
  );

  const data: ActivityMemberHistoryData[] = createDummy(10).map(() => ({
    createdDate: '18 May 2022',
    createdTime: '17:35',
    refId: '2347325070917200417',
    account: '081234567889',
    type: 'Top Up',
    description: '081234567889 top up 100000',
  }));

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">{tActivityMember('pageTitle')}</Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tActivityMember('filterPhoneNumber')}
                </Typography>
                <TextField
                  fullWidth
                  type="search"
                  placeholder={tForm('placeholderType', {
                    fieldName: 'phone number',
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

            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  {tActivityMember('filterType')}
                </Typography>
                <Autocomplete
                  options={typeOptions}
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
                      placeholder={tForm('placeholderType', {
                        fieldName: 'type',
                      })}
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
            <Grid item xl={4} md={6} xs={12}>
              <FormDatePicker
                title={tActivityMember('filterDate')}
                size="small"
                placeholder={tForm('placeholderSelect', { fieldName: 'date' })}
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
            label="Type: Top Up"
            color="primary"
            deleteIcon={<CloseIcon />}
          />
          <Chip
            variant="outlined"
            label="Phone Number: 081234567889"
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

export default ActivityMemberHistoryList;
