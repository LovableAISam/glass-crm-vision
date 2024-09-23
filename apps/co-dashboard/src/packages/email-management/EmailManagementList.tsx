// Cores
import { useMemo, useState } from 'react';

// Components
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Card, Pagination, Stack, Typography } from '@mui/material';
import {
  Button,
  Datatable,
  EmptyList,
  LoadingPage,
  Token,
} from '@woi/web-component';
import CreateEmailManagementModal from './components/CreateEmailManagementModal';

// Hooks & Utils
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';
import useModal from '@woi/common/hooks/useModal';
import { useTranslation } from 'react-i18next';
import useEmailContentList from './hooks/useEmailContentList';

// Types & Consts
import { EmailContentData } from '@woi/service/co/admin/emailContent/emailContentList';
import { Column } from 'react-table';

const EmailManagementList = () => {
  const [isActive, showModal, hideModal] = useModal();
  const [selectedEmail, setSelectedEmail] = useState<EmailContentData | null>(
    null,
  );
  const {
    pagination,
    setPagination,
    sortBy,
    direction,
    handleSort,
    emailContentData,
    emailContentStatus,
    fetchEmailContentList,
  } = useEmailContentList();
  const { t: tEmailContent } = useTranslation('emailContent');
  const { t: tCommon } = useTranslation('common');

  const columns: Array<Column<EmailContentData & { action: string }>> = useMemo(
    () => [
      {
        Header: tEmailContent('tableHeaderSubject'),
        accessor: 'subject',
      },
      {
        Header: tEmailContent('tableHeaderType'),
        accessor: 'transactionType',
        Cell: ({ value }) => (
          <Typography variant="inherit" key="transactionType">
            {value.name}
          </Typography>
        ),
      },
      {
        Header: tCommon('tableHeaderAction'),
        accessor: 'action',
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} key="emailContentAction">
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setSelectedEmail(row.original);
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
          <Typography variant="h4">{tEmailContent('pageTitle')}</Typography>
          <AuthorizeView access="email-content" privileges={['create']}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              sx={{ borderRadius: 2, display: 'none' }}
              onClick={() => {
                setSelectedEmail(null);
                showModal();
              }}
            >
              {tEmailContent('pageActionAdd')}
            </Button>
          </AuthorizeView>
        </Stack>
        {emailContentStatus === 'loading' && <LoadingPage />}
        {emailContentStatus === 'success' && emailContentData.length === 0 && (
          <EmptyList
            title={tCommon('tableEmptyNotFound')}
            description=""
            grayscale
          />
        )}
        {emailContentStatus === 'success' && emailContentData.length > 0 && (
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="column" spacing={2}>
              <Datatable
                columns={columns as Column<object>[]}
                data={emailContentData}
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
                    totalShowing: emailContentData.length,
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
        <CreateEmailManagementModal
          selectedData={selectedEmail}
          isActive={isActive}
          onHide={hideModal}
          fetchEmailContentList={fetchEmailContentList}
        />
      )}
    </Stack>
  );
};

export default EmailManagementList;
