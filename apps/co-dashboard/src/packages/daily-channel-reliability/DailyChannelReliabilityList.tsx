// Cores
import React, { useMemo } from 'react';

// Components
import {
  Typography,
  Stack,
  Card,
  Grid,
  TableRow,
  TableCell,
} from '@mui/material';
import {
  Token,
  Datatable,
  FormDatePicker,
  LoadingPage,
  EmptyList,
} from '@woi/web-component';
import { Column } from 'react-table';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import { useTranslation } from 'react-i18next';
import useDailyChannelReliabilityList from './hooks/useDailyChannelReliabilityList';

// Types & Consts
import { ResponseChannelReliability } from '@woi/service/co/admin/channelReliability/channelReliabilityList';

const DailyChannelReliabilityList = () => {
  const {
    filterForm,
    dailyChannelReliabilityData,
    dailyChannelReliabilityStatus,
    handleChangeDate,
  } = useDailyChannelReliabilityList();
  const [showModal] = useModal();
  const { t: tCommon } = useTranslation('common');
  const { t: tReport } = useTranslation('report');
  const { t: tForm } = useTranslation('form');

  const columns: Array<
    Column<ResponseChannelReliability & { action: string }>
  > = useMemo(
    () => [
      {
        Header: tReport('tableHeaderLoginAttempts'),
        accessor: 'loginAttempts',
      },
      {
        Header: tReport('tableHeaderSuccessfulLogins'),
        accessor: 'successfullLogin',
      },
      {
        Header: tReport('tableHeader%Successful'),
        accessor: 'succesLoginPercentage',
      },
      {
        Header: tReport('tableHeaderUsersAttempted'),
        accessor: 'attemptedUserLogin',
      },
      {
        Header: tReport('tableHeaderAvgAttemptsOrUser'),
        accessor: 'avgAttemptsLoginPerUser',
      },
      {
        Header: tReport('tableHeaderUsersWithSuccessfulAttempts'),
        accessor: 'successUserLoginAttempt',
      },
      {
        Header: tReport('tableHeaderNonFinancialTransactionAttempt'),
        accessor: 'nonFinancialAttempt',
      },
      {
        Header: tReport('tableHeaderSuccessNonFinancialTransactions'),
        accessor: 'nonFinancialSuccess',
      },
      {
        Header: tReport('tableHeader%Successful'),
        accessor: 'successNonFinancialPercentage',
      },
      {
        Header: tReport('tableHeaderUsersAttempted'),
        accessor: 'attemptedNonFinancialMember',
      },
      {
        Header: tReport('tableHeaderAvgAttemptsOrUser'),
        accessor: 'avgAttemptsNonFinancialPerUser',
      },
      {
        Header: tReport('tableHeaderUsersWithSuccessfulAttempts'),
        accessor: 'successUserNonFinancialAttempt',
      },
      {
        Header: tReport('tableHeaderFinancialTransactionAttempts'),
        accessor: 'attemptFinancial',
      },
      {
        Header: tReport('tableHeaderSuccessFinancialTransactions'),
        accessor: 'successFinancial',
      },
      {
        Header: tReport('tableHeader%Successful'),
        accessor: 'successFinancialPercentage',
      },
      {
        Header: tReport('tableHeaderUsersAttempted'),
        accessor: 'attemptFinancialMember',
      },
      {
        Header: tReport('tableHeaderAvgAttemptsOrUser'),
        accessor: 'avgAttemptsFinancialPerUser',
      },
      {
        Header: tReport('tableHeaderUsersWithSuccessfulAttempts'),
        accessor: 'successUserFinancialAttempt',
      },
      {
        Header: tReport('tableHeaderSuccessfulLogins'),
        accessor: 'statsSuccessLogin',
      },
      {
        Header: tReport('tableHeaderTotalMinsLoginLogout'),
        accessor: 'statsTotalMinsLoginLogout',
      },
      {
        Header: tReport('tableHeaderAverageMinsInApp'),
        accessor: 'statsAverageMinsInApp',
      },
      {
        Header: tReport('tableHeaderSuccessNonFinancialTransactions'),
        accessor: 'statsSuccessNonFinancialTransaction',
      },
      {
        Header: tReport('tableHeaderTotalMinsStartEndTransaction'),
        accessor: 'statsTotalMinsNonFinancial',
      },
      {
        Header: tReport('tableHeaderAverageNonFinTxn'),
        accessor: 'averageNonFinancialTransaction',
      },
      {
        Header: tReport('tableHeaderSuccessFinancialTransactions'),
        accessor: 'statsSuccessFinancialTransaction',
      },
      {
        Header: tReport('tableHeaderTotalMinsStartEndTransaction'),
        accessor: 'statsTotalMinsFinancial',
      },
      {
        Header: tReport('tableHeaderAverageFinTxn'),
        accessor: 'averageFinancialTransaction',
      },
    ],
    [showModal],
  );

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">
            {tReport('pageTitleDailyChannelReliabilityReport')}
          </Typography>
        </Stack>
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Grid container spacing={2}>
            <Grid item xl={6} md={6} xs={12}>
              <FormDatePicker
                value={filterForm.activeDate}
                onChange={handleChangeDate}
                title={tReport('filterDate')}
                size="small"
                placeholder={tForm('placeholderSelect', {
                  fieldName: tReport('typeDate'),
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
            </Grid>
          </Grid>
        </Card>

        {dailyChannelReliabilityStatus === 'loading' && <LoadingPage />}

        {dailyChannelReliabilityStatus === 'success' &&
          Object.keys(dailyChannelReliabilityData).length === 0 && (
            <EmptyList
              title={tCommon('tableEmptyNotFound')}
              description=""
              grayscale
            />
          )}

        {dailyChannelReliabilityStatus === 'success' &&
          Object.keys(dailyChannelReliabilityData).length > 0 && (
            <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
              <Stack direction="column" spacing={2}>
                <Datatable
                  tableHeaderGroup={
                    <React.Fragment>
                      <TableRow>
                        <TableCell
                          align="center"
                          colSpan={6}
                          style={{
                            borderRight: '1px solid rgba(224, 224, 224, 1)',
                            borderBottom: 'none',
                            paddingBottom: '0',
                            fontWeight: 600,
                            color: Token.color.greyscaleGreyDarkest,
                          }}
                        >
                          {tReport('tableHeaderLoginStatistics')}
                        </TableCell>
                        <TableCell
                          align="center"
                          colSpan={6}
                          style={{
                            borderRight: '1px solid rgba(224, 224, 224, 1)',
                            borderBottom: 'none',
                            paddingBottom: '0',
                            fontWeight: 600,
                            color: Token.color.greyscaleGreyDarkest,
                          }}
                        >
                          {tReport('tableHeaderNonFinancialStatistics')}
                        </TableCell>
                        <TableCell
                          align="center"
                          colSpan={6}
                          style={{
                            borderRight: '1px solid rgba(224, 224, 224, 1)',
                            borderBottom: 'none',
                            paddingBottom: '0',
                            fontWeight: 600,
                            color: Token.color.greyscaleGreyDarkest,
                          }}
                        >
                          {tReport('tableHeaderFinancialStatistics')}
                        </TableCell>
                        <TableCell
                          align="center"
                          colSpan={9}
                          style={{
                            borderBottom: 'none',
                            paddingBottom: '0',
                            fontWeight: 600,
                            color: Token.color.greyscaleGreyDarkest,
                          }}
                        >
                          {tReport('tableHeaderDurationStatistics')}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  }
                  columns={columns as Column<object>[]}
                  data={[dailyChannelReliabilityData]}
                  sortable={false}
                />
              </Stack>
            </Card>
          )}
      </Stack>
    </Stack>
  );
};

export default DailyChannelReliabilityList;
