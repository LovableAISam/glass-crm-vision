import React, { useMemo, useState } from 'react';
import {
  Typography,
  Stack,
  Card,
  TextField,
  Pagination,
  Grid,
} from '@mui/material';
import { Button, Token, Datatable } from '@woi/web-component';
import { Column } from 'react-table';
import createDummy from '@woi/core/utils/dummy';
import useModal from '@woi/common/hooks/useModal';
import CreateSystemParameterModal from './components/CreateSystemParameterModal';
import { reverseDirection } from '@woi/core';

// Icons
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface SystemParameterData {
  code: string;
  value: string;
}

const SystemParameterList = () => {
  const [sortBy, setSortBy] = useState<keyof SystemParameterData>();
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const [isActive, showModal, hideModal] = useModal();

  const handleSort = (columnId: keyof SystemParameterData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const columns: Array<Column<SystemParameterData & { action: string }>> =
    useMemo(
      () => [
        {
          Header: 'Code',
          accessor: 'code',
        },
        {
          Header: 'Value',
          accessor: 'value',
        },
        {
          Header: 'Action',
          accessor: 'action',
          Cell: () => (
            <Stack direction="row" spacing={2} key="systemParameterAction">
              <Button variant="text" size="small" onClick={showModal}>
                Details
              </Button>
            </Stack>
          ),
        },
      ],
      [showModal],
    );

  const data: SystemParameterData[] = createDummy(10).map(() => ({
    code: 'NUM_OF_MINUTES_CASH_WITHDRAWAL_EXPIRY',
    value: '30',
  }));

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">System Parameter</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            sx={{ borderRadius: 2 }}
            onClick={showModal}
          >
            Add System Parameter
          </Button>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={4} md={6} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">
                  System Parameter Code
                </Typography>
                <TextField
                  fullWidth
                  type="search"
                  placeholder="search system parameter code"
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
      <CreateSystemParameterModal isActive={isActive} onHide={hideModal} />
    </Stack>
  );
};

export default SystemParameterList;
