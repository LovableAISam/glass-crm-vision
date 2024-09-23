// Cores
import React, { useMemo, useState } from 'react';

// Components
import { Typography, Stack, Card, Pagination } from '@mui/material';
import {
  Button,
  Token,
  Datatable,
  Markdown,
  EmptyList,
  LoadingPage,
} from '@woi/web-component';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateSMSContentManagementModal from './components/CreateSMSContentManagementModal';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';

// Hooks & Utils
import useModal from '@woi/common/hooks/useModal';
import useSMSContentList from './hooks/useSMSContentList';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { Column } from 'react-table';
import { SMSContentData } from '@woi/service/co/admin/smsContent/smsContentList';

const SMSContentManagementList = () => {
  const [isActive, showModal, hideModal] = useModal();
  const [selectedSMS, setSelectedSMS] = useState<SMSContentData | null>(null);

  const {
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    smsContentData,
    smsContentStatus,
    fetchSMSContentList,
  } = useSMSContentList();
  const { t: tCommon } = useTranslation('common');
  const { t: tSMSContent } = useTranslation('smsContent');

  const columns: Array<Column<SMSContentData & { action: string }>> = useMemo(
    () => [
      {
        Header: tSMSContent('tableHeaderSubject'),
        accessor: 'subject',
      },
      {
        Header: tSMSContent('tableHeaderContent'),
        accessor: 'content',
        Cell: ({ value }) => (
          <Markdown
            typographyProps={{
              variant: 'body2',
            }}
            key="content"
          >
            {value}
          </Markdown>
        ),
      },
      {
        Header: tSMSContent('tableHeaderType'),
        accessor: 'transactionType',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="transactionType">
            {value?.name ?? '-'}
          </Typography>
        ),
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="smsContentAction">
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setSelectedSMS(row.original);
                showModal();
              }}
            >
              {tCommon('tableActionDetail')}
            </Button>
          </Stack>
        ),
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
          <Typography variant="h4">{tSMSContent('pageTitle')}</Typography>
          <AuthorizeView access="sms-content" privileges={['create']}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              sx={{ borderRadius: 2, display: 'none' }}
              onClick={() => {
                setSelectedSMS(null);
                showModal();
              }}
            >
              {tSMSContent('pageActionAdd')}
            </Button>
          </AuthorizeView>
        </Stack>
        {smsContentStatus === 'loading' && <LoadingPage />}
        {smsContentStatus === 'success' && smsContentData.length === 0 && (
          <EmptyList
            title={tCommon('tableEmptyNotFound')}
            description=""
            grayscale
          />
        )}
        {smsContentStatus === 'success' && smsContentData.length > 0 && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={smsContentData}
                sortBy={sortBy}
                direction={direction}
                onSort={handleSort}
                hideHeaderSort={['action', 'content']}
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
                    totalShowing: smsContentData.length,
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
            </Stack>
          </Card>
        )}
      </Stack>
      {isActive && (
        <CreateSMSContentManagementModal
          selectedData={selectedSMS}
          isActive={isActive}
          onHide={hideModal}
          fetchSMSContentList={fetchSMSContentList}
        />
      )}
    </Stack>
  );
};

export default SMSContentManagementList;
