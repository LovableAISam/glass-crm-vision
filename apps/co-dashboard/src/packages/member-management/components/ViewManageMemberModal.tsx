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
import { useTranslation } from 'react-i18next';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import useMemberUpsert from '../hooks/useMemberUpsert';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';

type ViewManageMemberModalProps = {
  isActive: boolean;
  onHide: () => void;
  selectedData: MemberData;
  fetchMemberList: () => void;
};

const ViewManageMemberModal = (props: ViewManageMemberModalProps) => {
  const { isActive, onHide, selectedData, fetchMemberList } = props;
  const [activeTab, setActiveTab] = useState<number>(0);
  const {
    memberDetail,
    memberKYCDetail,
    handleLockUnlock,
    listCountryResidence,
    listCityResidence,
    customerProfile
  } = useMemberUpsert({ selectedData, onHide, fetchMemberList });
  const { t: tMember } = useTranslation('member');
  const { t: tKYC } = useTranslation('kyc');

  return (
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
                  {tMember('detailPhoneNumber')}
                </Typography>
                <Typography variant="subtitle2" sx={{ py: 1 }}>
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
                  {tMember('detailMemberName')}
                </Typography>
                <Typography variant="subtitle2" sx={{ py: 1 }}>
                  {memberDetail?.name}
                </Typography>
              </Stack>
            </Card>
          </Grid>
          <Grid item md={12 / 3} xs={12}>
            <Card sx={{ borderRadius: 4, p: 2, height: '100%' }}>
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
                      memberDetail?.activationStatus === 'LOCK'
                        ? Token.color.redDark
                        : Token.color.greenDark
                    }
                    sx={{ py: 1 }}
                  >
                    {memberDetail?.activationStatus === 'LOCK'
                      ? tMember('detailStatusLocked')
                      : tMember('detailStatusActive')}
                  </Typography>
                  <AuthorizeView access="member" privileges={['update']}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ py: 1, borderRadius: 2 }}
                      onClick={handleLockUnlock}
                    >
                      {memberDetail?.activationStatus === 'LOCK'
                        ? tMember('detailActionUnLock')
                        : tMember('detailActionLock')}
                    </Button>
                  </AuthorizeView>
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
            </Tabs>
            <ViewManageMemberTab
              activeTab={activeTab}
              memberDetail={memberDetail}
              memberKYCDetail={memberKYCDetail}
              customerProfile={customerProfile}
              listCityResidence={listCityResidence}
              listCountryResidence={listCountryResidence}
            />
          </Box>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ViewManageMemberModal;
