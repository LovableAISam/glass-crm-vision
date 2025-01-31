// Components
import {
  Autocomplete,
  Button,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { PriceConverter } from '@woi/core';
import { Token } from '@woi/web-component';
import { useRouter } from 'next/router';

// Hooks & Utils
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import CashoutVerifyModal from './components/CashoutVerifyModal';
import ViewManageMemberModal from './components/ViewCashoutConfirm';
import useCashoutMerchantUpsert from './hooks/useCashoutMerchantUpsert';
import useModal from '@woi/common/hooks/useModal';
import useModalPassword from '@woi/common/hooks/useModalPassword';

const CashoutMerchantRequest = () => {
  const router = useRouter();
  const { t: tForm } = useTranslation('form');
  const { t: tAccount } = useTranslation('account');

  const [isActive, showModal, hideModal] = useModal();
  const [isActivePassword, showModalPassword, hideModalPassword] =
    useModalPassword();

  const {
    formData,
    merchantProfile,
    bankOptions,
    feeRateTypeOptions,
    isLoading,
    handleConfirm,
    handleRequest,
    handleCancel,
    handleUpsert,
    paymentResult,
  } = useCashoutMerchantUpsert({
    showModal,
    hideModal,
    showModalPassword,
    hideModalPassword,
  });

  const {
    formState: { errors },
    control,
    getValues,
  } = formData;

  const { field: fieldBank } = useController({
    name: 'bankName',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Bank' }),
    },
  });

  const { field: fieldTransferService } = useController({
    name: 'transferService',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'Transfer Service',
      }),
    },
  });

  return (
    <Stack direction="column">
      <Stack direction="column" spacing={2} sx={{ pb: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">
            {tAccount('pageTitleBalanceInquiry')}
          </Typography>
        </Stack>

        {merchantProfile && (
          <Card sx={{ p: 3, borderRadius: 4 }}>
            <Stack gap={2}>
              <Grid container spacing={2} sx={{ pt: 1 }}>
                <Grid item md={6} xs={12}>
                  <Stack direction="column" spacing={2}>
                    <Typography
                      variant="body2"
                      color={Token.color.greyscaleGreyDarkest}
                    >
                      {tAccount('detailPhoneNumber')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ py: 0.8 }}>
                      {merchantProfile.accountNumber}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Stack direction="column" spacing={2}>
                    <Typography
                      variant="body2"
                      color={Token.color.greyscaleGreyDarkest}
                    >
                      {tAccount('detailBalance')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ py: 0.8 }}>
                      {PriceConverter.formatPrice(
                        merchantProfile.balance,
                        router.locale,
                      )}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item md={12} xs={12} mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    {tAccount('formBank')}
                  </Typography>
                  <Autocomplete
                    {...fieldBank}
                    onChange={(_, value) => fieldBank.onChange(value)}
                    options={bankOptions}
                    fullWidth
                    renderInput={params => (
                      <TextField
                        {...params}
                        placeholder={tForm('placeholderSelect', {
                          fieldName: 'bank',
                        })}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                          },
                        }}
                        error={Boolean(errors.bankName)}
                        helperText={errors.bankName?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    {tAccount('formTransferService')}
                  </Typography>
                  <Autocomplete
                    {...fieldTransferService}
                    onChange={(_, value) =>
                      fieldTransferService.onChange(value)
                    }
                    options={feeRateTypeOptions}
                    fullWidth
                    renderInput={params => (
                      <TextField
                        {...params}
                        placeholder={tForm('placeholderSelect', {
                          fieldName: 'transfer service',
                        })}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                          },
                        }}
                        error={Boolean(errors.transferService)}
                        helperText={errors.transferService?.message}
                      />
                    )}
                  />
                </Grid>
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
                  disabled={isLoading}
                  sx={{ py: 1, px: 5, borderRadius: 2 }}
                  onClick={handleConfirm}
                >
                  {tAccount('buttonCashout')}
                </Button>
              </Stack>
            </Stack>
          </Card>
        )}
      </Stack>

      {merchantProfile && isActive && (
        <ViewManageMemberModal
          isActiveView={isActive}
          onHide={hideModal}
          handleCancel={handleCancel}
          handleRequest={handleRequest}
          isLoading={isLoading}
          merchantProfile={merchantProfile}
          transferService={getValues('transferService.label')}
          paymentResult={paymentResult}
        />
      )}

      {isActivePassword && (
        <CashoutVerifyModal
          isActive={isActivePassword}
          onHide={hideModalPassword}
          isLoading={isLoading}
          formData={formData}
          handleCancel={handleCancel}
          handleUpsert={handleUpsert}
        />
      )}
    </Stack>
  );
};

export default CashoutMerchantRequest;
