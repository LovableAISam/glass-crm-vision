import React, { useMemo, useState } from 'react';
import {
  Box,
  Card,
  Divider,
  Grid,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import { Button, Datatable, FormDatePicker, Token } from '@woi/web-component';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Column } from 'react-table';
import createDummy from '@woi/core/utils/dummy';
import DownloadIcon from '@mui/icons-material/Download';
import { useTranslation } from 'react-i18next';
import { reverseDirection } from '@woi/core';

interface TransactionData {
  dateTime: string;
  type: string;
  method: string;
  id: string;
  description: string;
  amount: string;
  balance: string;
}

function AccountInformation() {
  const [sortBy, setSortBy] = useState<keyof TransactionData>();
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const [show, setShow] = useState<boolean>(false);
  const { t: tCommon } = useTranslation('common');
  const { t: tKYC } = useTranslation('kyc');
  const { t: tForm } = useTranslation('form');

  const handleSort = (columnId: keyof TransactionData) => {
    setSortBy(columnId);
    setDirection(oldDirection => reverseDirection(oldDirection));
  };

  const columns: Array<Column<TransactionData>> = useMemo(
    () => [
      {
        Header: tKYC('accountInformationTableHeaderDateTime'),
        accessor: 'dateTime',
      },
      {
        Header: tKYC('accountInformationTableHeaderType'),
        accessor: 'type',
      },
      {
        Header: tKYC('accountInformationTableHeaderMethod'),
        accessor: 'method',
      },
      {
        Header: tKYC('accountInformationTableHeaderRefID'),
        accessor: 'id',
      },
      {
        Header: tKYC('accountInformationTableHeaderDescription'),
        accessor: 'description',
      },
      {
        Header: tKYC('accountInformationTableHeaderAmount'),
        accessor: 'amount',
      },
      {
        Header: tKYC('accountInformationTableHeaderBalance'),
        accessor: 'balance',
      },
    ],
    [],
  );

  const data: TransactionData[] = createDummy(10).map(() => ({
    dateTime: '13 Jun 2019 09:32',
    type: 'Bill Payment',
    method: 'E-Money',
    id: '08123456789_BILL18',
    description: 'Indosat Prepaid',
    amount: '- Rp 100.000',
    balance: 'Rp 1.010.000',
  }));

  return (
    <Box>
      {!show && (
        <React.Fragment>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {tKYC('accountInformationListOfCO')}
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item md={4} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  Account Number
                </Typography>
                <Typography variant="subtitle2">2617-2839-1820</Typography>
                <Divider />
              </Stack>
            </Grid>
            <Grid item md={4} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  Password
                </Typography>
                <Typography variant="subtitle2">******</Typography>
                <Divider />
              </Stack>
            </Grid>
          </Grid>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            List of CO
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item md={4} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  {tKYC('accountInformationCOCode')}
                </Typography>
                <Typography variant="subtitle2">850500</Typography>
                <Divider />
              </Stack>
            </Grid>
            <Grid item md={4} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  {tKYC('accountInformationCOName')}
                </Typography>
                <Typography variant="subtitle2">WOI</Typography>
                <Divider />
              </Stack>
            </Grid>
            <Grid item md={4} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  {tKYC('accountInformationEffectiveDate')}
                </Typography>
                <Typography variant="subtitle2">
                  19 Mar 2019 - 29 Oct 2019
                </Typography>
                <Divider />
              </Stack>
            </Grid>
            <Grid item md={4} xs={12}>
              <Stack direction="column" spacing={1}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  Status
                </Typography>
                <Typography variant="subtitle2">Verified</Typography>
                <Divider />
              </Stack>
            </Grid>
          </Grid>
        </React.Fragment>
      )}
      <Stack direction="column" spacing={1}>
        <Typography variant="body2" color={Token.color.greyscaleGreyDarkest}>
          {tKYC('accountInformationBalance')}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="subtitle2">Rp 1.010.000</Typography>
          <Button
            variant="text"
            endIcon={
              <ExpandMoreIcon
                sx={{
                  transform: show ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'all 0.4s linear',
                }}
              />
            }
            sx={{ borderRadius: 2 }}
            onClick={() => setShow(showProps => !showProps)}
          >
            {`${
              show
                ? tKYC('accountInformationActionHideTransactionDetail')
                : tKYC('accountInformationActionSeeTransactionDetail')
            }`}
          </Button>
        </Stack>
        <Divider />
      </Stack>
      {show && (
        <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
          <FormDatePicker
            title={tKYC('activityMemberHistoryFilterTransactionDate')}
            size="small"
            placeholder={tForm('placeholderSelect', {
              fieldName: 'transaction date',
            })}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />
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
          <Stack
            direction="row"
            spacing={3}
            justifyContent="flex-end"
            alignItems="center"
          >
            {/** @ts-ignore */}
            <Typography variant="subtitle3">
              {tCommon('exportAsXls')}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{ borderRadius: 2 }}
            >
              {tCommon('actionDownload')}
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
}

export default AccountInformation;
