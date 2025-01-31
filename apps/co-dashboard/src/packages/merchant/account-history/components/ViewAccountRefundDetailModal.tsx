// Cores
import React, { useState } from 'react';

// Components
import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Button, PasswordInput } from '@woi/web-component';
import { TextGetter, TextValidation } from "@woi/core";

// Utils
import { useTranslation } from 'react-i18next';
import { useTransactionRefundFetcher } from '@woi/service/co';
import { useSnackbar } from 'notistack';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import { useController, useForm } from "react-hook-form";

// Types
import { OptionMap } from "@woi/option";
import { MerchantAccountHistory } from "@woi/service/co/merchant/merchantAccountHistoryList";

// Icons
import CloseIcon from '@mui/icons-material/Close';

type ViewAccountHistoryDetailModalProps = {
  isActive: boolean;
  onHide: () => void;
  refundReasonOptions: OptionMap<string>[];
  selectData: MerchantAccountHistory | null;
};

export interface RefundForm {
  selectReason: OptionMap<string> | null;
  inputOther: string;
  password: string;
}

const initialRefundForm: RefundForm = {
  selectReason: null,
  inputOther: '',
  password: '',
};

const ViewAccountRefundDetailModal = ({
  isActive,
  onHide,
  refundReasonOptions,
  selectData
}: ViewAccountHistoryDetailModalProps) => {
  const { t: tForm } = useTranslation('form');
  const { t: tAccount } = useTranslation('account');

  const { baseUrl } = useBaseUrl();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const formData = useForm<RefundForm>({
    defaultValues: initialRefundForm,
  });
  const {
    formState: { errors },
    control,
    handleSubmit,
    getValues,
  } = formData;

  const valueLabelReason = getValues('selectReason.label');

  const { field: fieldSelectReason } = useController({
    name: 'selectReason',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Reason' }),
    },
  });

  const { field: fieldInputOther } = useController({
    name: 'inputOther',
    control,
    rules: {
      validate: value => {
        if (!value && valueLabelReason === 'Input reasons') {
          return tForm('generalErrorRequired', { fieldName: 'Other reasons' });
        }
        return undefined;
      },
    },
  });

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

  const handleRefund = handleSubmit(async (form) => {
    const payload = {
      transactionId: selectData?.id || '',
      referenceNumber: selectData?.referenceNumber || '',
      refundReasonId: TextGetter.getterString(form.selectReason?.value),
      inputReason: valueLabelReason === 'Input reasons' ? form.inputOther : '',
      password: form.password,
    };

    try {
      setLoading(true);
      const { result, errorData } = await useTransactionRefundFetcher(baseUrl, payload);
      setLoading(false);
      const message = result?.description || errorData?.status?.text || errorData?.status?.message || errorData?.responseMessage || 'Something went wrong';

      if (result?.code === 'QRRFN000' || result?.code === 'MPMRFN000') {
        onHide();
        enqueueSnackbar(message, { variant: 'success' });
      } else {
        enqueueSnackbar(message, { variant: 'error' });
      }
    } catch (error) {
      console.error('Error processing refund:', error);
      setLoading(false);
    }
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
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">{tAccount('detailTitleRefund')}</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* Dropdown for Reason */}
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">Reason</Typography>
              {/* <Autocomplete
                value={{ label: selectedReason, value: selectedReasonId }}
                options={refundReasonOptions || []}
                getOptionLabel={option => option.label || ''}
                fullWidth
                size="medium"
                onChange={(_, value) => {
                  setSelectedReason(value?.label || null);
                  setSelectedReasonId(value?.value || null);
                }}
                aria-label="group code"
                renderInput={params => (
                  <TextField
                    {...params}
                    placeholder="Select lookup group"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                    error={Boolean(errors.reason)}
                    helperText={errors.reason?.message}
                  />
                )}
              /> */}
              <Autocomplete
                {...fieldSelectReason}
                onChange={(_, value) => {
                  fieldSelectReason.onChange(value);
                }}
                options={refundReasonOptions}
                fullWidth
                getOptionLabel={option => option.label}
                renderInput={params => (
                  <TextField
                    {...params}
                    placeholder={tForm('placeholderSelect', {
                      fieldName: 'reason',
                    })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                    type="search"
                    error={Boolean(errors.selectReason)}
                    helperText={errors.selectReason?.message}
                  />
                )}
                size="medium"
              />
            </Stack>
          </Grid>

          {/* 'Other' input field */}
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">
                {tAccount('detailOther')}
              </Typography>
              <TextField
                {...fieldInputOther}
                fullWidth
                type="text"
                disabled={valueLabelReason !== 'Input reasons'}
                placeholder={tForm('placeholderType', {
                  fieldName: 'reasons',
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
                multiline
                rows={4}
                size="medium"
                error={Boolean(errors.inputOther)}
                helperText={errors.inputOther?.message}
              />
            </Stack>
          </Grid>

          {/* Password input field */}
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">
                {tAccount('detailPassword')}
              </Typography>
              {/* <TextField
                fullWidth
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
                size="medium"
              /> */}
              <PasswordInput
                {...fieldPassword}
                fullWidth
                placeholder={tForm('placeholderType', {
                  fieldName: 'password',
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />
            </Stack>

            {/* Buttons */}
            <Grid item md={12} xs={12} mt={5}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="flex-end"
                sx={{ flex: 1 }}
              >
                <Button
                  variant="outlined"
                  onClick={onHide}
                  sx={{ py: 1, px: 5, borderRadius: 2 }}
                  disabled={loading}
                >
                  {tAccount('detailButtonCancel')}
                </Button>
                <Button
                  variant="contained"
                  sx={{ py: 1, px: 5, borderRadius: 2 }}
                  onClick={handleRefund}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : tAccount('detailButtonRefund')}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAccountRefundDetailModal;
