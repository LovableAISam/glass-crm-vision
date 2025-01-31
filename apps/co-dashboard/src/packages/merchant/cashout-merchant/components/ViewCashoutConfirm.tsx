import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { PriceConverter } from '@woi/core';
import { CashoutPaymentResponse } from '@woi/service/co/merchant/merchantCashoutPayment';
import { MerchantProfileResponse } from '@woi/service/co/merchant/merchantProfile';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

type ViewManageMemberModalProps = {
  isActiveView: boolean;
  onHide: () => void;
  handleCancel: () => void;
  handleRequest: () => void;
  isLoading: boolean;
  merchantProfile: MerchantProfileResponse;
  transferService: string;
  paymentResult: CashoutPaymentResponse | null;
};

const ViewManageMemberModal = (props: ViewManageMemberModalProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tAccount } = useTranslation('account');

  const {
    isActiveView,
    onHide,
    handleRequest,
    handleCancel,
    isLoading,
    merchantProfile,
    transferService,
    paymentResult,
  } = props;

  return (
    <Dialog
      open={isActiveView}
      onClose={!paymentResult ? onHide : () => {}}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        },
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">
            {tAccount('confirmCashoutTitle')}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {!paymentResult ? (
          <Stack spacing={2} mt={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">
                {tAccount('detailAmount')}
              </Typography>
              <Typography variant="subtitle1">
                {PriceConverter.formatPrice(
                  merchantProfile.balance,
                  router.locale,
                )}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">
                {tAccount('detailTransferService')}
              </Typography>
              <Typography variant="subtitle1">{transferService}</Typography>
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={2} mt={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">
                {tAccount('detailAmount')}
              </Typography>
              <Typography variant="subtitle1">
                {PriceConverter.formatPrice(
                  merchantProfile.balance,
                  router.locale,
                )}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">
                {tAccount('detailTransferService')}
              </Typography>
              <Typography variant="subtitle1">{transferService}</Typography>
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ p: 2, flex: 1 }}
        >
          {!paymentResult ? (
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="flex-end"
            >
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{ py: 1, px: 5, borderRadius: 2 }}
                disabled={isLoading}
              >
                {tCommon('actionCancel')}
              </Button>
              <Button
                variant="contained"
                onClick={handleRequest}
                sx={{ py: 1, px: 5, borderRadius: 2 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Stack direction="row" gap={1}>
                    {tCommon('actionContinue')}
                    <CircularProgress
                      style={{
                        width: '15px',
                        height: '15px',
                        alignSelf: 'center',
                      }}
                    />
                  </Stack>
                ) : (
                  tCommon('actionContinue')
                )}
              </Button>
            </Stack>
          ) : (
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="flex-end"
            >
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{ py: 1, px: 5, borderRadius: 2 }}
                disabled={isLoading}
              >
                {tCommon('actionCancel')}
              </Button>
              <Button
                variant="contained"
                onClick={handleRequest}
                sx={{ py: 1, px: 5, borderRadius: 2 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Stack direction="row" gap={1}>
                    {tCommon('actionContinue')}
                    <CircularProgress
                      style={{
                        width: '15px',
                        height: '15px',
                        alignSelf: 'center',
                      }}
                    />
                  </Stack>
                ) : (
                  tCommon('actionContinue')
                )}
              </Button>
            </Stack>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default ViewManageMemberModal;
