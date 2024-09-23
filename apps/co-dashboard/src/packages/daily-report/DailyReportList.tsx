// Cores
import React, { useMemo } from 'react';

// Components
import { Typography, Stack, Card, Pagination, Grid } from '@mui/material';
import {
  Button,
  Token,
  Datatable,
  FormDatePicker,
  LoadingPage,
  EmptyList,
} from '@woi/web-component';
import { Column } from 'react-table';

// Hooks & Utils
import { DateConvert } from '@woi/core';
import { useTranslation } from 'react-i18next';
import useDailyReportList from './hooks/useDailyReportList';

// Asset
import { LONG_DATE_TIME_FORMAT } from '@woi/core/utils/date/constants';
import { DailyReportData } from '@woi/service/co/admin/report/dailyReportList';

const DailyReportList = () => {
  const { t: tCommon } = useTranslation('common');
  const { t: tReport } = useTranslation('report');
  const { t: tForm } = useTranslation('form');

  const {
    filterForm,
    setPagination,
    sortBy,
    direction,
    handleSort,
    dailyReportData,
    dailyReoprtStatus,
    pagination,
    handleExport,
    handleChangeDate,
  } = useDailyReportList();

  const columns: Array<Column<DailyReportData & { action: string }>> = useMemo(
    () => [
      {
        Header: tReport('tableHeaderFileName'),
        accessor: 'fileName',
      },
      {
        Header: tReport('tableHeaderDate'),
        accessor: 'effectiveDate',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="dateTime">
            {DateConvert.stringToDateFormat(value, LONG_DATE_TIME_FORMAT)}
          </Typography>
        ),
      },
      {
        Header: tReport('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="userAction">
            <Button
              onClick={() => {
                handleExport(row.original);
              }}
              variant="text"
              size="small"
            >
              {tReport('tableActionDownload')}
            </Button>
          </Stack>
        ),
      },
    ],
    [],
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
            {tReport('pageTitleDailyReport')}
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

        {dailyReoprtStatus === 'loading' && <LoadingPage />}

        {dailyReoprtStatus === 'success' && dailyReportData.length === 0 && (
          <EmptyList
            title={tCommon('tableEmptyNotFound')}
            description=""
            grayscale
          />
        )}

        {dailyReoprtStatus === 'success' && dailyReportData.length > 0 && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={dailyReportData}
                sortBy={sortBy}
                direction={direction}
                onSort={handleSort}
                hideHeaderSort={['action', 'fileName']}
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
                  {tCommon('paginationTitle', {
                    totalShowing: dailyReportData.length,
                    totalData: pagination.totalElements,
                  })}
                </Typography>
                <Pagination
                  color="primary"
                  page={pagination.currentPage + 1}
                  count={pagination.totalPages}
                  onChange={(_, page) => {
                    setPagination(oldPagination => ({
                      ...oldPagination,
                      currentPage: page - 1,
                    }));
                  }}
                />
              </Stack>
            </Stack>
          </Card>
        )}
      </Stack>
    </Stack>
  );
};

export default DailyReportList;
