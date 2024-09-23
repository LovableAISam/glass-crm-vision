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
import { Button, Token, useConfirmationDialog } from '@woi/web-component';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import ViewManageMemberTab from './ViewManageMamber/ViewManageMemberTab';
import { useSnackbar } from 'notistack';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

type ViewManageMemberModalProps = {
  isActive: boolean;
  onHide: () => void;
}

const ViewManageMemberModal = (props: ViewManageMemberModalProps) => {
  const {
    isActive,
    onHide,
  } = props;
  const [activeTab, setActiveTab] = useState<number>(0);
  const { getConfirmation } = useConfirmationDialog();
  const { enqueueSnackbar } = useSnackbar();
  const { t: tMember } = useTranslation('member');
  const { t: tKYC } = useTranslation('kyc');
  const { t: tCommon } = useTranslation('common');

  const handleLock = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationLockTitle', { text: 'Member' }),
      message: tCommon('confirmationLockDescription', { text: 'Member' }),
      primaryText: tCommon('confirmationLockYes'),
      secondaryText: tCommon('confirmationLockNo'),
    });

    if (confirmed) {
      enqueueSnackbar(tCommon('successLock', { text: 'Member' }), { variant: 'success' });
      onHide();
    }
  }

  return (
    <Dialog
      open={isActive}
      onClose={onHide}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        }
      }}
      maxWidth="xl"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{tMember('detailTitle')}</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={4} xs={12}>
            <Card sx={{ borderRadius: 4, p: 2 }}>
              <Stack direction="column" spacing={2}>
                <Typography variant="body2" color={Token.color.greyscaleGreyDarkest}>{tMember('detailPhoneNumber')}</Typography>
                <Typography variant="subtitle2" sx={{ py: 0.8 }}>081287654321</Typography>
              </Stack>
            </Card>
          </Grid>
          <Grid item md={4} xs={12}>
            <Card sx={{ borderRadius: 4, p: 2 }}>
              <Stack direction="column" spacing={2}>
                <Typography variant="body2" color={Token.color.greyscaleGreyDarkest}>{tMember('detailMemberName')}</Typography>
                <Typography variant="subtitle2" sx={{ py: 0.8 }}>Mukhtar Fauzi Dharmawanto</Typography>
              </Stack>
            </Card>
          </Grid>
          <Grid item md={4} xs={12}>
            <Card sx={{ borderRadius: 4, p: 2 }}>
              <Stack direction="column" spacing={2}>
                <Typography variant="body2" color={Token.color.greyscaleGreyDarkest}>{tMember('detailMemberStatus')}</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2">{tMember('detailStatusActive')}</Typography>
                  <Button variant="outlined" sx={{ borderRadius: 2 }} onClick={handleLock}>
                    {tMember('detailActionLock')}
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Grid>
          <Box sx={{ width: '100%', bgcolor: 'background.paper', mt: 2, px: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value)}
              variant="fullWidth"
              centered
              sx={{ mb: 2 }}
            >
              <Tab
                label={(
                  <Stack direction="row" spacing={1} alignItems="center">
                    <FolderSharedIcon />
                    {/** @ts-ignore */}
                    <Typography variant="subtitle3">{tKYC('detailTabAccountInformation')}</Typography>
                  </Stack>
                )}
              />
              <Tab
                label={(
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonOutlineIcon />
                    {/** @ts-ignore */}
                    <Typography variant="subtitle3">{tKYC('detailTabPersonalDataKYC')}</Typography>
                  </Stack>
                )}
              />
            </Tabs>
            <ViewManageMemberTab activeTab={activeTab} />
          </Box>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default ViewManageMemberModal;