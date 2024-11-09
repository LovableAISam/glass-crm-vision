import React, { useMemo } from 'react';
import { Box, Card, Stack, Typography } from '@mui/material';
import { Datatable, Token } from '@woi/web-component';
import { Column } from 'react-table';
import { useTranslation } from 'react-i18next';
import { KycPermiumHistory } from '@woi/service/co/kyc/premiumMember/premiumMemberHistoryDetail';
import { ViewKYCRequestTabProps } from '../ViewKYCRequestHistoryTab';

function VerificationHistory(props: ViewKYCRequestTabProps) {
  const { kycDetailHistory } = props;

  const { t: tKYC } = useTranslation('kyc');
  const { t: tCommon } = useTranslation('common');

  const columns: Array<Column<KycPermiumHistory>> = useMemo(
    () => [
      {
        Header: tKYC('verificationHistoryTableHeaderVerifierName'),
        accessor: 'fullName',
      },
      {
        Header: tKYC('verificationHistoryTableHeaderStatusGiven'),
        accessor: 'status',
        Cell: ({ value }) => {
          let componentToRender;
          if (value === 'STARTED') {
            componentToRender = (
              <Typography
                variant="inherit"
                color={Token.color.greyscaleGreyDarker}
                key="status"
              >
                {tKYC('statusStarted')}
              </Typography>
            );
          } else if (value === 'WAITING_TO_REVIEW') {
            componentToRender = (
              <Typography
                variant="inherit"
                color={Token.color.orangeDark}
                key="status"
              >
                {tKYC('statusWaitingToReview')}
              </Typography>
            );
          } else if (value === 'REGISTERED') {
            componentToRender = (
              <Typography
                variant="inherit"
                color={Token.color.greyscaleGreyDarker}
                key="status"
              >
                {tKYC('statusRegistered')}
              </Typography>
            );
          } else if (value === 'UNREGISTER') {
            componentToRender = (
              <Typography
                variant="inherit"
                color={Token.color.orangeDark}
                key="status"
              >
                {tKYC('statusUnregister')}
              </Typography>
            );
          } else if (value === 'REJECTED') {
            componentToRender = (
              <Typography
                variant="inherit"
                color={Token.color.orangeDark}
                key="status"
              >
                {tKYC('statusRejected')}
              </Typography>
            );
          } else {
            componentToRender = (
              <Typography
                variant="inherit"
                color={Token.color.greenDark}
                key="status"
              >
                {tKYC('statusUnknown')}
              </Typography>
            );
          }
          return componentToRender;
        },
      },
      {
        Header: tKYC('verificationHistoryTableHeaderComments'),
        accessor: 'reason',
      },
    ],
    [],
  );

  return (
    <Box>
      <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
        <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
          <Stack direction="column" spacing={2}>
            <Datatable
              columns={columns as Column<object>[]}
              data={kycDetailHistory?.histories || []}
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
                  totalShowing: kycDetailHistory?.histories.length,
                  totalData: kycDetailHistory?.histories.length,
                })}
              </Typography>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}

export default VerificationHistory;
