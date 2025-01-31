// Core
import { useRef } from 'react';

// Components
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { QRCode } from 'react-qr-code';
import { Button } from "@woi/web-component";

// Hooks & Utils
import { useTranslation } from 'react-i18next';

// Types & Consts
import { MerchantProfileResponse } from '@woi/service/co/merchant/merchantProfile';

type ViewQRModalProps = {
  isActiveView: boolean;
  handleReset: () => void;
  checkStatus: () => void;
  isLoading: boolean;
  merchantProfile: MerchantProfileResponse | null;
  qrString: string;
  remainingTime: number;
};

const ViewQRModal = (props: ViewQRModalProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tAccount } = useTranslation('account');
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const {
    isActiveView,
    checkStatus,
    isLoading,
    qrString,
    handleReset,
    remainingTime
  } = props;

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  };

  return (
    <Dialog
      open={isActiveView}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        },
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <Typography variant="h5">{tAccount('countDownQr')}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={4}>
          {/* Countdown Timer */}
          <Stack direction="row" justifyContent="center">
            <Typography variant="h2">{formatTime(remainingTime)}</Typography>{' '}
            {/* Show MM:SS countdown */}
          </Stack>

          {/* QR Code */}
          <Stack direction="row" justifyContent="center" ref={qrCodeRef}>
            <QRCode
              size={256}
              style={{
                height: 'auto',
                maxWidth: '100%',
                width: '90%',
              }}
              value={qrString} // Pass qrString as the value
              viewBox={`0 0 256 256`}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{ p: 4, flex: 1 }}
        >
          <Stack direction="column" spacing={2} alignItems="center">
            <Button
              variant="contained"
              onClick={checkStatus}
              sx={{ py: 1, px: 5, borderRadius: 2 }}
              disabled={isLoading}
              loading={isLoading}
            >
              {tCommon('actionCheckStatus')}
            </Button>
            <Button
              variant="outlined"
              onClick={handleReset}
              sx={{ py: 1, px: 5, borderRadius: 2 }}
              disabled={remainingTime > 0}
            >
              {tCommon('actionClose')}
            </Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default ViewQRModal;
