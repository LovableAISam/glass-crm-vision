// Core
import { useEffect, useState } from 'react';

// Components
import {
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Button } from "@woi/web-component";
import ViewQRModal from './components/ViewQRModal';
import ViewStatusModal from './components/ViewStatusModal';

// Hooks & Utils
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import useCashoutMerchantUpsert from './hooks/useQrMerchantUpsert';
import useModal from '@woi/common/hooks/useModal';
import useModalPassword from '@woi/common/hooks/useModalPassword';

const CreateQrRequest = () => {
  const { t: tForm } = useTranslation('form');
  const { t: tAccount } = useTranslation('account');
  const { t: tCommon } = useTranslation('common');

  const [isActiveQR, showModalQR, hideModalQR] = useModal();
  const [isActiveStatus, showModalStatus, hideModalStatus] = useModalPassword();
  const [isAmountValid, setIsAmountValid] = useState(false);

  const {
    formData,
    merchantProfile,
    handleGenerate,
    validityPeriod,
    qrString,
    isLoading,
    checkStatus,
    dataStatus,
    dialogMessage,
    errorDialog,
    setErrorDialog,
    updateStatus,
    handleReset
  } = useCashoutMerchantUpsert({
    showModalQR,
    hideModalQR,
    showModalStatus,
    hideModalStatus
  });

  const [remainingTime, setRemainingTime] = useState<number>(0);

  const {
    formState: { errors },
    control,
  } = formData;

  const { field: fieldAmount } = useController({
    name: 'amount',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Amount' }),
    },
  });

  const formatThousand = (value: number | null): string => {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID').format(Number(value));
  };

  const calculateRemainingTime = () => {
    const now = Date.now();
    const expiryTime = Date.parse(validityPeriod);
    if (!expiryTime || expiryTime < now) {
      return 0;
    }
    return Math.max(Math.floor((expiryTime - now) / 1000), 0);
  };

  useEffect(() => {
    if (validityPeriod !== '') {
      const initialRemainingTime = calculateRemainingTime();
      setRemainingTime(initialRemainingTime);

      const timer = setInterval(() => {
        const newRemainingTime = calculateRemainingTime();
        setRemainingTime(newRemainingTime);

        if (newRemainingTime <= 0) {
          clearInterval(timer);
          updateStatus();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [validityPeriod]);

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          onClick={showModalStatus}
        >
          <Typography variant="h4">
            {tAccount('pageTitleGenerateQr')}
          </Typography>
        </Stack>

        <Card sx={{ p: 3, borderRadius: 4 }}>
          <Stack gap={3}>
            <Grid container spacing={2} sx={{ pt: 3, px: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {tAccount('detailAmount')}
              </Typography>
              <TextField
                fullWidth
                type="text"
                placeholder={tAccount('detailAmount')}
                value={formatThousand(fieldAmount.value)}
                error={!!errors.amount}
                helperText={errors.amount?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
                onChange={e => {
                  const rawValue = e.target.value.replace(/\./g, ''); // Remove dots
                  const numericValue = parseInt(rawValue, 10);

                  if (numericValue > 10000000) {
                    fieldAmount.onChange(10000000);
                    setIsAmountValid(true);
                  } else {
                    fieldAmount.onChange(numericValue || 0);
                    setIsAmountValid(numericValue > 0);
                  }
                }}
              />
            </Grid>

            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              gap={2}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={!isAmountValid}
                sx={{ py: 1, px: 5, borderRadius: 2 }}
                onClick={() => {
                  handleGenerate();
                }}
                loading={isLoading && !isActiveQR}
              >
                {tAccount('buttonGenerate')}
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      {isActiveStatus && (
        <ViewStatusModal
          isActive={isActiveStatus}
          onHide={hideModalStatus}
          isLoading={isLoading}
          dataStatus={dataStatus}
          onHideModalQR={hideModalQR}
          showModalQR={showModalQR}
          handleReset={handleReset}
        />
      )}

      {isActiveQR && (
        <ViewQRModal
          isActiveView={isActiveQR}
          merchantProfile={merchantProfile}
          qrString={qrString}
          remainingTime={remainingTime}
          checkStatus={checkStatus}
          isLoading={isLoading}
          handleReset={handleReset}
        />
      )}

      {/* Dialog Error */}
      <Dialog
        open={errorDialog}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 5,
          },
        }}
        fullWidth>
        <DialogContent
          sx={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            p: '40px 20px'
          }}
        >
          <Typography variant="h3" textAlign="center">
            {dialogMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => {
              setErrorDialog(false);
            }}
          >
            {tCommon('actionClose')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default CreateQrRequest;
