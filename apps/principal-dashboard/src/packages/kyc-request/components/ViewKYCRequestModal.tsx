import React, { useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  IconButton,
  Grid,
  Card,
  Tabs,
  Tab,
  Box,
  DialogActions,
  FormHelperText,
} from '@mui/material';
import { Button, Token } from '@woi/web-component';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import HistoryIcon from '@mui/icons-material/History';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import ViewKYCRequestTab from './ViewKYCRequest/ViewKYCRequestTab';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ViewKYCRequestVerifyModal from './ViewKYCRequestVerifyModal';
import useKycRequestUpsert from '../hooks/useKycRequstUpsert';
import { useTranslation } from 'react-i18next';

type ViewKYCRequestModalProps = {
  isActive: boolean;
  onHide: () => void;
  isHistory: boolean;
  selectedId: string | null;
  fetchKycRequestList: () => void;
}

const ViewKYCRequestModal = (props: ViewKYCRequestModalProps) => {
  const { isActive, onHide, isHistory, selectedId, fetchKycRequestList } =
    props;
  const [activeTab, setActiveTab] = useState<number>(0);
  const {
    isActiveView,
    kycDetail,
    memberDetail,
    touched,
    hideModalView,
    handleShowVerify,
    handleVerify,
    handleRegisterDttot,
  } = useKycRequestUpsert({ selectedId, onHide, fetchKycRequestList });
  const { t: tKYC } = useTranslation('kyc');

  const displayStatus = useMemo(() => {
    if (kycDetail?.status === 'UNREGISTERED') {
      return tKYC('statusUnregistered');
    } else if (kycDetail?.status === 'WAITING_TO_REVIEW') {
      return tKYC('statusWaitingToVerify');
    } else if (kycDetail?.status === 'PREMIUM') {
      return tKYC('statusApproved');
    } else if (kycDetail?.status === 'REJECTED') {
      return tKYC('statusRejected');
    }
    return '-';
  }, [kycDetail?.status]);

  const showErrorDttot = touched && typeof kycDetail?.isDttot !== 'boolean';

  const eligibleVerify =
    !isHistory &&
    (kycDetail?.status === 'UNREGISTERED' ||
      kycDetail?.status === 'WAITING_TO_REVIEW');

  let dttotText = '-';
  if (typeof kycDetail?.isDttot === 'boolean') {
    dttotText = kycDetail?.isDttot ? tKYC('dttotYes') : tKYC('dttotNo');
  }

  return (
    <React.Fragment>
      <Dialog
        open={isActive}
        onClose={onHide}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 5,
          },
        }}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5">{tKYC('modalDetailTitle')}</Typography>
            <IconButton onClick={onHide}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item md={12 / 5} xs={12}>
              <Card sx={{ borderRadius: 4, p: 2 }}>
                <Stack direction="column" spacing={2}>
                  <Typography
                    variant="body2"
                    color={Token.color.greyscaleGreyDarkest}
                    sx={{ py: isHistory ? 0 : 1 }}
                  >
                    {tKYC('detailPhoneNumber')}
                  </Typography>
                  <Typography variant="subtitle2">
                    {kycDetail?.phoneNumber}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
            <Grid item md={12 / 5} xs={12}>
              <Card sx={{ borderRadius: 4, p: 2 }}>
                <Stack direction="column" spacing={2}>
                  <Typography
                    variant="body2"
                    color={Token.color.greyscaleGreyDarkest}
                    sx={{ py: isHistory ? 0 : 1 }}
                  >
                    {tKYC('detailMemberName')}
                  </Typography>
                  <Typography variant="subtitle2">
                    {kycDetail?.fullName}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
            <Grid item md={12 / 5} xs={12}>
              <Card sx={{ borderRadius: 4, p: 2 }}>
                <Stack direction="column" spacing={2}>
                  <Typography
                    variant="body2"
                    color={Token.color.greyscaleGreyDarkest}
                    sx={{ py: isHistory ? 0 : 1 }}
                  >
                    {tKYC('detailOccupation')}
                  </Typography>
                  <Typography variant="subtitle2">
                    {kycDetail?.occupation?.name}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
            <Grid item md={12 / 5} xs={12}>
              <Card
                variant={showErrorDttot ? 'outlined' : 'elevation'}
                sx={{
                  borderRadius: 4,
                  p: 2,
                  borderWidth: 1,
                  borderColor: Token.color.redDark,
                }}
              >
                <Stack direction="column" spacing={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="body2"
                      color={Token.color.greyscaleGreyDarkest}
                    >
                      {tKYC('detailRegisteredAsDTTOT')}
                    </Typography>
                    {eligibleVerify && (
                      <IconButton
                        color={showErrorDttot ? 'error' : 'primary'}
                        onClick={handleRegisterDttot}
                      >
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                  <Typography variant="subtitle2">{dttotText}</Typography>
                </Stack>
              </Card>
              {showErrorDttot && (
                <FormHelperText sx={{ color: Token.color.redDark }}>
                  {tKYC('dttotRequired')}
                </FormHelperText>
              )}
            </Grid>
            <Grid item md={12 / 5} xs={12}>
              <Card sx={{ borderRadius: 4, p: 2 }}>
                <Stack direction="column" spacing={2}>
                  <Typography
                    variant="body2"
                    color={Token.color.greyscaleGreyDarkest}
                    sx={{ py: isHistory ? 0 : 1 }}
                  >
                    {tKYC('detailKYCStatus')}
                  </Typography>
                  <Typography variant="subtitle2">{displayStatus}</Typography>
                </Stack>
              </Card>
            </Grid>
            <Box
              sx={{ width: '100%', bgcolor: 'background.paper', mt: 2, px: 2 }}
            >
              <Tabs
                value={activeTab}
                onChange={(_, value) => setActiveTab(value)}
                variant="fullWidth"
                centered
                sx={{ mb: 2 }}
              >
                <Tab
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <FolderSharedIcon />
                      {/** @ts-ignore */}
                      <Typography variant="subtitle3">
                        {tKYC('detailtabAccountInformation')}
                      </Typography>
                    </Stack>
                  }
                />
                <Tab
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PersonOutlineIcon />
                      {/** @ts-ignore */}
                      <Typography variant="subtitle3">
                        {tKYC('detailTabPersonalDataKYC')}
                      </Typography>
                    </Stack>
                  }
                />
                <Tab
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <HistoryIcon />
                      {/** @ts-ignore */}
                      <Typography variant="subtitle3">
                        {tKYC('detailTabVerificationHistory')}
                      </Typography>
                    </Stack>
                  }
                />
              </Tabs>
              <ViewKYCRequestTab
                activeTab={activeTab}
                kycDetail={kycDetail}
                memberDetail={memberDetail}
              />
            </Box>
          </Grid>
        </DialogContent>
        {eligibleVerify && (
          <DialogActions>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="flex-end"
              sx={{ p: 2 }}
            >
              <Button
                variant="contained"
                onClick={handleShowVerify}
                sx={{ py: 1, px: 5, borderRadius: 2 }}
              >
                {tKYC('actionVerifyThisMember')}
              </Button>
            </Stack>
          </DialogActions>
        )}
      </Dialog>
      <ViewKYCRequestVerifyModal
        isActive={isActiveView}
        onHide={hideModalView}
        onSubmit={handleVerify}
      />
    </React.Fragment>
  );
}

export default ViewKYCRequestModal;