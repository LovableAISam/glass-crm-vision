import React, { useEffect, useMemo, useState } from 'react';
import { Typography, Popover, Stack } from '@mui/material';

import { CommunityOwnerData } from '@woi/service/principal/admin/communityOwner/communityOwnerList';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CircleIcon from '@mui/icons-material/Circle';

import { Button, Token, useConfirmationDialog } from '@woi/web-component';
import { useCommunityOwnerActivationListFetcher, useCommunityOwnerActivationResumeFetcher } from '@woi/service/principal';
import { CommunityOwnerActivationData } from '@woi/service/principal/admin/communityOwner/communityOwnerActivationList';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useSnackbar } from 'notistack';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import { useTranslation } from 'react-i18next';

type StatusProgressProps = {
  selectedData: CommunityOwnerData;
}

function StatusProgress(props: StatusProgressProps) {
  const { selectedData } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLSpanElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [steps, setSteps] = useState<CommunityOwnerActivationData[]>([]);
  const { getConfirmation } = useConfirmationDialog();
  const { enqueueSnackbar } = useSnackbar();
  const { baseUrl } = useBaseUrl();
  const { t: tCO } = useTranslation('co');

  const displayStatus = useMemo(() => {
    if (selectedData.provisioningStatus === 'INACTIVE') return <Typography variant="inherit" color={Token.color.greyscaleGreyDark}>{tCO('statusProgressInactive')}</Typography>
    if (selectedData.provisioningStatus === 'PENDING') return <Typography variant="inherit" color={Token.color.orangeDark}>{tCO('statusProgressPending')}</Typography>
    if (selectedData.provisioningStatus === 'ACTIVE') return <Typography variant="inherit" color={Token.color.greenDark}>{tCO('statusProgressActive')}</Typography>
    if (selectedData.provisioningStatus === 'ERROR') return <Typography variant="inherit" color={Token.color.redDark}>{tCO('statusProgressError')}</Typography>
    return <Typography variant="inherit">-</Typography>
  }, [selectedData.provisioningStatus])

  const handleRetry = async () => {
    const confirmed = await getConfirmation({
      title: tCO('retryConfirmationTitle'),
      message: tCO('retryConfirmationDescription'),
      primaryText: tCO('retryConfirmationYes'),
      secondaryText: tCO('retryConfirmationNo'),
    });

    if (confirmed) {
      const { error, errorData } = await useCommunityOwnerActivationResumeFetcher(baseUrl, selectedData.id)
      if (!error) {
        enqueueSnackbar(tCO('retryConfirmationSuccess'), { variant: 'success' });
        setAnchorEl(null);
      } else {
        enqueueSnackbar(errorData?.details?.[0] || tCO('retryConfirmationFailed'), { variant: 'error' });
      }
    }
  }

  const fetchStatusActivation = async (selectedId: string) => {
    const { result, error } = await useCommunityOwnerActivationListFetcher(baseUrl, selectedId);

    if (result && !error) {
      setSteps(result.steps)
    }
  }

  useEffect(() => {
    if (selectedData) {
      fetchStatusActivation(selectedData.id);
    }
  }, [selectedData])

  const renderSteps = (data: CommunityOwnerActivationData) => {
    switch (data.status) {
      case 'ERROR': {
        return (
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <CheckCircleIcon sx={{ color: Token.color.redDark }} />
              <Typography variant="body2" sx={{ color: Token.color.redDark }}>{data.name}</Typography>
            </Stack>
            <Button variant="text" color="primary" startIcon={<RefreshIcon />} onClick={handleRetry}>{tCO('statusProgressActionRetry')}</Button>
          </Stack>
        )
      }
      case 'NEXT': {
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <CircleIcon sx={{ color: Token.color.greyscaleGreyLight }} />
            <Typography variant="body2">{data.name}</Typography>
          </Stack>
        )
      }
      case 'SUCCESS': {
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <CheckCircleIcon sx={{ color: Token.color.greenDark }} />
            <Typography variant="body2">{data.name}</Typography>
          </Stack>
        )
      }
      case 'RUNNING': {
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
          <Typography variant="subtitle2">{tCO('statusProgressTitle')}</Typography>
          {steps.map(step => renderSteps(step))}
        </Stack>
      </Popover>
    </React.Fragment>
  );
}

export default StatusProgress;