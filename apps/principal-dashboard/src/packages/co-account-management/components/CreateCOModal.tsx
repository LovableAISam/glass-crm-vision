import React, { useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  IconButton,
  Card,
  Grid,
} from '@mui/material';
import { Button, Token } from '@woi/web-component';

// Components
import CreateCOModalContent from './CreateCOModalContent';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { CommunityOwnerData } from '@woi/service/principal/admin/communityOwner/communityOwnerList';
import useCommunityOwnerUpsert from '../hooks/useCommunityOwnerUpsert';
import { FormProvider } from 'react-hook-form';
import { stringToDateFormat } from '@woi/core/utils/date/dateConvert';
import { useTranslation } from 'react-i18next';

type CreateCOModalProps = {
  selectedData: CommunityOwnerData | null;
  isActive: boolean;
  onHide: () => void;
  fetchCOList: () => void;
}

const CreateCOModal = (props: CreateCOModalProps) => {
  const {
    selectedData,
    isActive,
    onHide,
    fetchCOList,
  } = props;
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{
    [k: number]: boolean;
  }>({});
  const isUpdate = Boolean(selectedData);
  const {
    coDetailState,
    formData,
    handleCancel,
    handleActivateDeactivate,
  } = useCommunityOwnerUpsert({ selectedData, onHide, fetchCOList });
  const { t: tCO } = useTranslation('co');

  const handleStep = (step: number) => {
    setActiveStep(step);
  };

  const handleComplete = (step: number) => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleStep(step);
  };

  const displayStatus = useMemo(() => {
    if (selectedData?.provisioningStatus === 'INACTIVE') return <Typography variant="inherit" color={Token.color.greyscaleGreyDark}>{tCO('statusProgressInactive')}</Typography>
    if (selectedData?.provisioningStatus === 'PENDING') return <Typography variant="inherit" color={Token.color.orangeDark}>{tCO('statusProgressPending')}</Typography>
    if (selectedData?.provisioningStatus === 'ACTIVE') return <Typography variant="inherit" color={Token.color.greenDark}>{tCO('statusProgressActive')}</Typography>
    if (selectedData?.provisioningStatus === 'ERROR') return <Typography variant="inherit" color={Token.color.redDark}>{tCO('statusProgressError')}</Typography>
    return <Typography variant="inherit">-</Typography>
  }, [selectedData?.provisioningStatus])

  return (
    <FormProvider {...formData}>
      <Dialog
        open={isActive}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 5,
          }
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">{isUpdate ? 'Community Owner Details' : 'Register New Community Owner'}</Typography>
            <IconButton onClick={onHide}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers={true}>
          {isUpdate && (
            <Grid container spacing={2} sx={{ paddingBottom: 2 }}>
              <Grid item md={3} xs={12}>
                <Card
                  variant="elevation"
                  sx={{ p: 2, borderRadius: 3, height: 100 }}
                >
                  <Stack direction="column" spacing={2}>
                    <Typography variant="body2">{tCO('tableHeaderCOName')}</Typography>
                    <Typography variant="subtitle2">{coDetailState?.code} - {coDetailState?.name}</Typography>
                  </Stack>
                </Card>
              </Grid>
              <Grid item md={3} xs={12}>
                <Card
                  variant="elevation"
                  sx={{ p: 2, borderRadius: 3, height: 100 }}
                >
                  <Stack direction="column" spacing={2}>
                    <Typography variant="body2">{tCO('tableHeaderEffectiveDate')}</Typography>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="subtitle2">{stringToDateFormat(coDetailState?.activeDate)} - {stringToDateFormat(coDetailState?.inactiveDate)}</Typography>
                      <CalendarTodayIcon sx={theme => ({ color: theme.palette.primary.main })} />
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
              <Grid item md={3} xs={12}>
                <Card
                  variant="elevation"
                  sx={{ p: 2, borderRadius: 3, height: 100 }}
                >
                  <Stack direction="column" spacing={2}>
                    <Typography variant="body2">{tCO('tableHeaderProvisioningStatus')}</Typography>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="subtitle2">{displayStatus}</Typography>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
              <Grid item md={3} xs={12}>
                <Card
                  variant="elevation"
                  sx={{ p: 2, borderRadius: 3, height: 100 }}
                >
                  <Stack direction="column" spacing={1}>
                    <Typography variant="body2">{tCO('tableHeaderAccountStatus')}</Typography>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="subtitle2" color={coDetailState?.isActive ? Token.color.greenDark : Token.color.redDark}>{coDetailState?.isActive ? 'Active' : 'Inactive'}</Typography>
                      <Button variant="outlined" size="small" onClick={handleActivateDeactivate} sx={{ py: 1, borderRadius: 2 }}>{coDetailState?.isActive ? 'Deactivate' : 'Activate'}</Button>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          )}
          <CreateCOModalContent
            selectedData={selectedData}
            activeStep={activeStep}
            completed={completed}
            handleStep={handleStep}
            handleComplete={handleComplete}
            handleCancel={handleCancel}
            handleHide={onHide}
            handleReloadList={fetchCOList}
          />
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}

export default CreateCOModal;