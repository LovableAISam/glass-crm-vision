import React, { useEffect, useMemo, useState } from 'react';
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
import ViewKYCRequestHistoryTab from './ViewKYCRequestHistory/ViewKYCRequestHistoryTab';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ViewKYCRequestVerifyModal from './ViewKYCRequestVerifyModal';
import useKycRequestUpsert, {
  KycPremiumMemberDetailForm,
  KycPremiumMemberDetailHistoryForm,
} from '../hooks/useKycRequstUpsert';
import { useTranslation } from 'react-i18next';

// Icons
import CloseIcon from '@mui/icons-material/Close';

type ViewKYCRequestModalProps = {
  isActive: boolean;
  onHide: () => void;
  isHistory: boolean;
  selectedId: string | null;
  fetchKycRequestList: () => void;
  phoneNumber: string | null;
  memberSecureId: string | null;
};

const ViewKYCRequestModal = (props: ViewKYCRequestModalProps) => {
  const {
    isActive,
    onHide,
    isHistory,
    selectedId,
    fetchKycRequestList,
    phoneNumber,
    memberSecureId,
  } = props;
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
    kycDetailHistory,
    listCityResidence,
    listCountryResidence,
    customerProfile
  } = useKycRequestUpsert({
    selectedId,
    onHide,
    fetchKycRequestList,
    isHistory,
    phoneNumber,
    memberSecureId,
  });
  const { t: tKYC } = useTranslation('kyc');

  const dataKyc:
    | KycPremiumMemberDetailForm
    | null = useMemo(() => kycDetail, [kycDetail]);

  const displayStatus = useMemo(() => {
    if (dataKyc?.premiumMember.status === 'STARTED') {
      return tKYC('statusStarted');
    } else if (dataKyc?.premiumMember.status === 'VERIFIED') {
      return tKYC('statusVerified');
    } else if (dataKyc?.premiumMember.status === 'UNVERIFIED') {
      return tKYC('statusUnverified');
    } else if (dataKyc?.premiumMember.status === 'UNREGISTER') {
      return tKYC('statusUnregistered');
    } else if (dataKyc?.premiumMember.status === 'WAITING_TO_REVIEW') {
      return tKYC('statusWaitingToReview');
    } else if (dataKyc?.premiumMember.status === 'REGISTERED') {
      return tKYC('statusRegistered');
    } else if (dataKyc?.premiumMember.status === 'REJECTED') {
      return tKYC('statusRejected');
    }
    return '-';
  }, [dataKyc?.premiumMember.status]);

  const showErrorDttot =
    touched && typeof dataKyc?.premiumMember.isDttot !== 'boolean';

  const eligibleVerify =
    !isHistory &&
    (dataKyc?.premiumMember.status === 'UNREGISTER' ||
      dataKyc?.premiumMember.status === 'WAITING_TO_REVIEW');

  let dttotText = '-';
  if (typeof dataKyc?.premiumMember.isDttot === 'boolean') {
    dttotText = dataKyc?.premiumMember.isDttot
      ? tKYC('dttotYes')
      : tKYC('dttotNo');
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
            <Grid item md={12 / 4} xs={12}>
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
                    {dataKyc?.premiumMember.phoneNumber || '-'}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
            <Grid item md={12 / 4} xs={12}>
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
                    {`${dataKyc?.premiumMember.firstName} ${dataKyc?.premiumMember.middleName} ${dataKyc?.premiumMember.lastName}` || '-'}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
            <Grid item md={12 / 4} xs={12} hidden>
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
                    {dataKyc?.premiumMember.occupation?.name || '-'}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
            <Grid item md={12 / 4} xs={12}>
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
                      sx={{ py: isHistory ? 0 : 1 }}
                    >
                      {tKYC('detailRegisteredAsDTTOT')}
                    </Typography>
                    {eligibleVerify && (
                      <IconButton
                        color={showErrorDttot ? 'error' : 'primary'}
                        onClick={handleRegisterDttot}
                        data-testid="ButtonOpenInNewIcon"
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
            <Grid item md={12 / 4} xs={12}>
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
                        {tKYC('detailTabAccountInformation')}
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
                {isHistory && (
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
                )}
              </Tabs>
              {isHistory ? (
                <ViewKYCRequestHistoryTab
                  activeTab={activeTab}
                  kycDetail={kycDetail}
                  memberDetail={memberDetail}
                  kycDetailHistory={kycDetailHistory}
                  listCityResidence={listCityResidence}
                  listCountryResidence={listCountryResidence}
                  customerProfile={customerProfile}
                />
              ) : (
                <ViewKYCRequestTab
                  activeTab={activeTab}
                  kycDetail={kycDetail}
                  memberDetail={memberDetail}
                  kycDetailHistory={kycDetailHistory}
                  listCityResidence={listCityResidence}
                  listCountryResidence={listCountryResidence}
                  customerProfile={customerProfile}
                />
              )}
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
};

export default ViewKYCRequestModal;
