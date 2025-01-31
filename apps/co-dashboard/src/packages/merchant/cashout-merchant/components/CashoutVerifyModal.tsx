import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { TextValidation } from '@woi/core';
import { PasswordInput } from '@woi/web-component';
import { useController, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CashoutForm } from '../hooks/useCashoutMerchantUpsert';

type CashoutVerifyModalProps = {
  isActive: boolean;
  onHide: () => void;
  formData: UseFormReturn<CashoutForm, any>;
  handleCancel: () => void;
  isLoading: boolean;
  handleUpsert: () => void;
};

const CashoutVerifyModal = (props: CashoutVerifyModalProps) => {
  const { isActive, onHide, formData, handleCancel, isLoading, handleUpsert } =
    props;

  const { t: tForm } = useTranslation('form');
  const { t: tCommon } = useTranslation('common');
  const { t: tAccount } = useTranslation('account');

  const {
    formState: { errors },
    control,
  } = formData;

  const { field: fieldPassword } = useController({
    name: 'password',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Password' }),
      validate: value => {
        if (!TextValidation.minChar(value, 8))
          return tForm('generalErrorMinChar', { number: 8 });
        else if (!TextValidation.maxChar(value, 20))
          return tForm('generalErrorMaxChar', { number: 20 });
        else if (!TextValidation.containsUppercase(value))
          return tForm('generalErrorContainsUppercase');
        else if (!TextValidation.containsSpecialChars(value))
          return tForm('generalErrorContainsSpecialChars');
        else if (!TextValidation.containsNumber(value))
          return tForm('generalErrorContainsNumber');
      },
    },
  });

  return (
    <Dialog
      open={isActive}
      onClose={onHide}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        },
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 5 }}>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tAccount('detailPassword')}
            </Typography>
            <PasswordInput
              {...fieldPassword}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'password' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
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
            onClick={handleUpsert}
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
              tCommon('actionSubmit')
            )}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default CashoutVerifyModal;
