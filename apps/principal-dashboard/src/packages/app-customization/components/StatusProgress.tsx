import React, { useEffect, useMemo, useState } from 'react';
import { Typography, Popover, Stack } from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CircleIcon from '@mui/icons-material/Circle';

import { Button, Token, useConfirmationDialog } from '@woi/web-component';
import { useApplicationProvisioningListFetcher, useApplicationProvisioningResumeFetcher } from '@woi/service/principal';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useSnackbar } from 'notistack';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import { ApplicationData } from '@woi/service/principal/admin/application/applicationList';
import { ApplicationProvisioningData } from '@woi/service/principal/admin/application/applicationProvisioningList';
import { useTranslation } from 'react-i18next';

type StatusProgressProps = {
  selectedData: ApplicationData;
}

function StatusProgress(props: StatusProgressProps) {
  const { selectedData } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLSpanElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [steps, setSteps] = useState<ApplicationProvisioningData[]>([]);
  const { getConfirmation } = useConfirmationDialog();
  const { enqueueSnackbar } = useSnackbar();
  const { baseUrl } = useBaseUrl();
  const { t: tAppCustomization } = useTranslation('appCustomization');

  const displayStatus = useMemo(() => {
    if (selectedData.status === 'INACTIVE') return <Typography variant="inherit" color={Token.color.greyscaleGreyDark}>{tAppCustomization('statusProgressInactive')}</Typography>
    if (selectedData.status === 'PENDING') return <Typography variant="inherit" color={Token.color.orangeDark}>{tAppCustomization('statusProgressPending')}</Typography>
    if (selectedData.status === 'ACTIVE') return <Typography variant="inherit" color={Token.color.greenDark}>{tAppCustomization('statusProgressActive')}</Typography>
    if (selectedData.status === 'SUCCESS') return <Typography variant="inherit" color={Token.color.greenDark}>{tAppCustomization('statusProgressSuccess')}</Typography>
    if (selectedData.status === 'ERROR') return <Typography variant="inherit" color={Token.color.redDark}>{tAppCustomization('statusProgressError')}</Typography>
    return <Typography variant="inherit">-</Typography>
  }, [selectedData.status])

  const handleRetry = async () => {
    const confirmed = await getConfirmation({
      title: 'Retry Step',
      message: `Do you really want to retry step?`,
      primaryText: 'Retry',
      secondaryText: 'Cancel',
    });

    if (confirmed) {
      const { error, errorData } = await useApplicationProvisioningResumeFetcher(baseUrl, selectedData.communityOwnerId)
      if (!error) {
        enqueueSnackbar('Step successfully retry!', { variant: 'success' });
        setAnchorEl(null);
      } else {
        enqueueSnackbar(errorData?.details?.[0] || 'Retry step failed!', { variant: 'error' });
      }
    }
  }

  const fetchStatusActivation = async (_id: string) => {
    const { result, error } = await useApplicationProvisioningListFetcher(baseUrl, _id);

    if (result && !error) {
      setSteps(result.steps)
    }
  }

  useEffect(() => {
    if (selectedData) {
      fetchStatusActivation(selectedData.communityOwnerId);
    }
  }, [selectedData])

  const renderSteps = (data: ApplicationProvisioningData) => {
    switch (data.status) {
      case 'ERROR': {
        return (
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <CheckCircleIcon sx={{ color: Token.color.redDark }} />
              <Typography variant="body2" sx={{ color: Token.color.redDark }}>{data.name}</Typography>
            </Stack>
            <Button variant="text" color="primary" startIcon={<RefreshIcon />} onClick={handleRetry}>{tAppCustomization('statusProgressActionRetry')}</Button>
          </Stack>
        )
      }
      case 'SUCCESS':
      case 'ACTIVE': {
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <CheckCircleIcon sx={{ color: Token.color.greenDark }} />
            <Typography variant="body2">{data.name}</Typography>
          </Stack>
        )
      }
      case 'INACTIVE': {
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <CircleIcon sx={{ color: Token.color.greyscaleGreyLight }} />
            <Typography variant="body2">{data.name}</Typography>
          </Stack>
        )
      }
      case 'PENDING': 
      default: {
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <RadioButtonCheckedIcon sx={{ color: Token.color.primaryBlue }} />
            <Typography variant="subtitle2">{data.name}</Typography>
          </Stack>
        )
      }
    }
  }

  return (
    <React.Fragment>
      <Typography variant="inherit" onClick={event => setAnchorEl(event.currentTarget)}>{displayStatus}</Typography>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPopover-paper': {
            borderRadius: 3
          }
        }}
      >
        <Stack direction="column" spacing={2} sx={{ p: 2, width: 200 }}>
          <Typography variant="subtitle2">{tAppCustomization('statusProgressTitle')}</Typography>
          {steps.map(step => renderSteps(step))}
        </Stack>
      </Popover>
    </React.Fragment>
  );
}

export default StatusProgress;