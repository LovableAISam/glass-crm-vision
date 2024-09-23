// Cores
import React, { useMemo, useState } from 'react';

// Components
import {
  Grid,
  Card,
  Stack,
  TextField,
  Pagination,
  Typography,
  Dialog,
  DialogContent,
  CircularProgress,
  Box,
} from '@mui/material';
import {
  Token,
  Button,
  Datatable,
  FormDatePicker,
  LoadingPage,
  EmptyList,
} from '@woi/web-component';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';
import EditContentManagement from './components/EditContentManagement';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// Hooks & Utils
import { DateConvert, batch } from '@woi/core';
import useContentManagementUpsert, {
  ContentData,
  ContentDetail,
} from './hooks/useContentManagementUpsert';
import useDebounce from '@woi/common/hooks/useDebounce';
import { stringToDateFormat } from '@woi/core/utils/date/dateConvert';
import {
  useContentDetailFetcher,
  useContentListFetcher,
} from '@woi/service/principal';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { Column } from 'react-table';
import { LONG_DATE_FORMAT } from '@woi/core/utils/date/constants';
import { ContentListRequest } from '@woi/service/principal/admin/contentManagement/contentList';
import { useQuery } from '@tanstack/react-query';

const ContentManagement = () => {
  const {
    isActive,
    showModal,
    hideModal,
    filterForm,
    setFilterForm,
    pagination,
    setPagination,
    baseUrl,
  } = useContentManagementUpsert();
  const { t: tCO } = useTranslation('co');
  const { t: tCommon } = useTranslation('common');
  const debouncedFilter = useDebounce(filterForm, 300);

  const [sortBy, setSortBy] = useState<keyof ContentData>();
  const [direction, setDirection] = useState<'desc' | 'asc'>('desc');
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [selectId, setSelectId] = useState<string>('');
  const [detailContent, setDetailContent] = useState<{
    currentPage: number;
    totalElements: number;
    totalPages: number;
    data: ContentDetail[];
  }>();

  const handleSort = (columnId: keyof ContentData) => {
    setSortBy(columnId);
    setDirection(oldDirection => (oldDirection === 'asc' ? 'desc' : 'asc'));
  };

  const contentListPayload: ContentListRequest = {
    contentName: debouncedFilter.contentName,
    createdDateFrom: stringToDateFormat(debouncedFilter.createdDate.startDate),
    createdDateTo: stringToDateFormat(debouncedFilter.createdDate.endDate),
    limit: pagination.limit,
    page: pagination.currentPage,
    sort: sortBy ? `${sortBy}:${direction}` : '',
  }

  const {
    data: _contentListData,
    status: contentListStatus,
    refetch: refetchContentList
  } = useQuery(
    ['content-list', contentListPayload],
    async () => await useContentListFetcher(baseUrl, contentListPayload),
    {
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const result = response.result;
        if (result && result.data && !response.error) {
          setPagination(oldPagination => ({
            ...oldPagination,
            totalPages: Math.ceil(result.totalElements / pagination.limit),
            totalElements: result.totalElements,
          }));
        }
      },
      onError: () => {
        setPagination(oldPagination => ({
          ...oldPagination,
          totalPages: 0,
          currentPage: 0,
          totalElements: 0,
        }));
      }
    }
  );

  const contentListData = _contentListData?.result?.data || [];

  const handleDetail = async (id: string) => {
    setLoadingDetail(true);
    const { result, error } = await useContentDetailFetcher(baseUrl, id);
    if (result && !error) {
      setDetailContent(result);
      setIsUpdate(true);
      showModal();
    }
    setLoadingDetail(false);
  };

  const columns: Array<Column<ContentData & { action: string }>> = useMemo(
    () => [
      {
        Header: tCO('contentName'),
        accessor: 'contentName',
      },
      {
        Header: tCO('createdDate'),
        accessor: 'createdDate',
        Cell: ({ row }) => (
          <Typography variant="inherit" key="effectiveDate">
            {DateConvert.stringToDateFormat(
              row.original.createdDate,
              LONG_DATE_FORMAT,
            )}
          </Typography>
        ),
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="merchantAction">
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setSelectId(row.original.id);
                handleDetail(row.original.id);
              }}
            >
              {tCommon('tableActionDetail')}
            </Button>
          </Stack>
        ),
      },
    ],
    [],
  );

  return (
    <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
      <Dialog open={loadingDetail}>
        <DialogContent>
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>

      <EditContentManagement
        isActive={isActive}
        onHide={hideModal}
        detailContent={detailContent}
        isUpdate={isUpdate}
        selectId={selectId}
        fetchContentList={refetchContentList}
      />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Content Management</Typography>
        <AuthorizeView access="content" privileges={['create']}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            sx={{ borderRadius: 2 }}
            onClick={() => {
              setIsUpdate(false);
              showModal();
            }}
          >
            {tCO('addContent')}
          </Button>
        </AuthorizeView>
      </Stack>

      <Card
        sx={{
          p: 3,
          borderRadius: 4,
          boxShadow: '0px 2px 12px rgba(137, 168, 191, 0.15)',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xl={6} md={6} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('contentName')}</Typography>
              <TextField
                fullWidth
                type="search"
                placeholder={tCO('searchContentName')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
                value={filterForm.contentName}
                onChange={e => {
                  batch(() => {
                    setPagination(oldPagination => ({
                      ...oldPagination,
                      currentPage: 0,
                    }));
                    setFilterForm(oldForm => ({
                      ...oldForm,
                      contentName: e.target.value,
                    }));
                  });
                }}
                size="small"
              />
            </Stack>
          </Grid>
          <Grid item xl={6} md={6} xs={12}>
            <FormDatePicker
              title={tCO('createdDate')}
              size="small"
              placeholder={tCO('filterCreatedDate')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              onChange={value => {
                batch(() => {
                  setPagination(oldPagination => ({
                    ...oldPagination,
                    currentPage: 0,
                  }));
                  setFilterForm(oldForm => ({
                    ...oldForm,
                    createdDate: value,
                  }));
                });
              }}
            />
          </Grid>
        </Grid>
      </Card>

      {contentListStatus === 'loading' && <LoadingPage />}
      {contentListStatus === 'success' && contentListData.length === 0 && (
        <EmptyList
          title={tCommon('tableEmptyTitle')}
          description={tCommon('tableEmptyDescription', {
            text: tCO('content'),
          })}
        />
      )}

      {contentListStatus === 'success' && contentListData.length > 0 && (
        <React.Fragment>
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={contentListData}
                sortBy={sortBy}
                direction={direction}
                onSort={handleSort}
                hideHeaderSort={['action']}
              />
            </Stack>
          </Card>

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
                totalShowing: pagination.totalCurrentElements,
                totalData: pagination.totalElements,
              })}
            </Typography>
            <Pagination
              color="primary"
              page={pagination.currentPage + 1}
              count={pagination.totalPages}
              onChange={(_, page) =>
                setPagination(oldPagination => ({
                  ...oldPagination,
                  currentPage: page - 1,
                }))
              }
            />
          </Stack>
        </React.Fragment>
      )}
    </Stack>
  );
};

export default ContentManagement;
