import React, { useState } from 'react';
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
} from '@mui/material';
import { Button, Token } from '@woi/web-component';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import ViewManageMemberTab from './ViewManageMamber/ViewManageMemberTab';
import { MemberData } from '@woi/service/co/idp/member/memberList';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import useMemberUpsert from '../hooks/useMemberUpsert';
import { useTranslation } from 'react-i18next';
import useModal from '@woi/common/hooks/useModal';
import UpdateMemberAddressModal from './UpdateMemberAddressModal';

type ViewManageMemberModalProps = {
  isActiveView: boolean;
  onHide: () => void;
  selectedData: MemberData;
  fetchMemberList: () => void;
};

const ViewManageMemberModal = (props: ViewManageMemberModalProps) => {
  const { t: tMember } = useTranslation('member');
  const { t: tKYC } = useTranslation('kyc');

  const { isActiveView, onHide, selectedData, fetchMemberList } = props;
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isActive, showModal, hideModal] = useModal();

  const {
    memberDetail,
    memberKYCDetail,
    handleLockUnlock,
    listProvinceResidence,
    listProvinceDomicile,
    listCityResidence,
    listCityDomicile,
    listCountryResidence,
    listCountryDomicile,
    fetchMemberKYCHistoryDetail,
  } = useMemberUpsert({
    selectedData,
    onHide,
    fetchMemberList,
  });

  return (
    <Dialog
      open={isActiveView}
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
          <Typography variant="h5">{tMember('detailTitle')}</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12 / 3} xs={12}>
            <Card sx={{ borderRadius: 4, p: 2 }}>
              <Stack direction="column" spacing={2}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  {tMember('detailMemberName')}
                </Typography>
                <Typography variant="subtitle2" sx={{ py: 0.8 }}>
                  {memberDetail?.name}
                </Typography>
              </Stack>
            </Card>
          </Grid>
          <Grid item md={12 / 3} xs={12}>
            <Card sx={{ borderRadius: 4, p: 2 }}>
              <Stack direction="column" spacing={2}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  {tMember('detailPhoneNumber')}
                </Typography>
                <Typography variant="subtitle2" sx={{ py: 0.8 }}>
                  {memberDetail?.phoneNumber}
                </Typography>
              </Stack>
            </Card>
          </Grid>
          <Grid item md={12 / 3} xs={12}>
            <Card sx={{ borderRadius: 4, p: 2 }}>
              <Stack direction="column" spacing={2}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  {tMember('detailMemberStatus')}
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="subtitle2"
                    color={
                      memberDetail?.activationStatus === 'ACTIVE'
                        ? Token.color.greenDark
                        : Token.color.redDark
                    }
                  >
                    {memberDetail?.activationStatus === 'ACTIVE'
                      ? tMember('detailStatusActive')
                      : memberDetail?.activationStatus === 'LOCK'
                      ? tMember('detailStatusLocked')
                      : tMember('detailStatusClosed')}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ py: 1, borderRadius: 2 }}
                    onClick={handleLockUnlock}
                    disabled={memberDetail?.activationStatus === 'CLOSED'}
                  >
                    {memberDetail?.activationStatus === 'LOCK'
                      ? tMember('detailActionUnLock')
                      : tMember('detailActionLock')}
                  </Button>
                </Stack>
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
              {memberDetail?.upgradeStatus === 'REGISTERED' && (
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
              )}
            </Tabs>
            <ViewManageMemberTab
              activeTab={activeTab}
              memberDetail={memberDetail}
              memberKYCDetail={memberKYCDetail}
              listProvinceResidence={listProvinceResidence}
              listProvinceDomicile={listProvinceDomicile}
              listCityResidence={listCityResidence}
              listCityDomicile={listCityDomicile}
              listCountryDomicile={listCountryDomicile}
              listCountryResidence={listCountryResidence}
              showModalUpdate={showModal}
              selectedData={selectedData}
            />
          </Box>
        </Grid>
      </DialogContent>

      {isActive && (
        <UpdateMemberAddressModal
          isActive={isActive}
          onHide={hideModal}
          memberKYCDetail={memberKYCDetail}
          selectedData={selectedData}
          fetchMemberKYCHistoryDetail={fetchMemberKYCHistoryDetail}
        />
      )}
    </Dialog>
  );
};

export default ViewManageMemberModal;
