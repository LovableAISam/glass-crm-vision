import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  IconButton,
  Grid,
  Card,
  TextField,
  Autocomplete,
  DialogActions,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NumberFormat, Token } from '@woi/web-component';
import { useController } from 'react-hook-form';
import { BalanceCorrectionHistoryData } from '@woi/service/co/admin/balanceCorrection/balanceCorrectionHistory';
import { PriceConverter } from '@woi/core';
import { useRouter } from 'next/router';
import { stringify } from 'json5';
import useBalanceCorrectionHistoryView from '../hooks/useBalanceCorrectionHistoryView';

// Icons
import CloseIcon from '@mui/icons-material/Close';

type ViewBalanceCorrectionModalProps = {
  isActive: boolean;
  onHide: () => void;
  selectedData: BalanceCorrectionHistoryData;
};

const ViewBalanceCorrectionModal = (props: ViewBalanceCorrectionModalProps) => {
  const { isActive, onHide, selectedData } = props;

  const { t: tForm } = useTranslation('form');
  const { t: tBalanceCorrection } = useTranslation('balanceCorrection');
  const router = useRouter();

  const { formData, actionOptions } = useBalanceCorrectionHistoryView();

  const {
    formState: { errors },
    control,
    setValue,
  } = formData;

  const { field: fieldAction } = useController({
    name: 'action',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Action' }),
    },
  });

  const { field: fieldAmount } = useController({
    name: 'amount',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Amount' }),
    },
  });

  const { field: fieldBalance } = useController({
    name: 'balance',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Balance' }),
    },
  });

  const { field: fieldReason } = useController({
    name: 'reason',
    control,
  });

  useEffect(() => {
    const { type } = selectedData;
    setValue('action', {
      label:
        type === 'DEDUCT'
          ? tBalanceCorrection('optionDeduct')
          : tBalanceCorrection('optionTopUp'),
      value: type || '',
    });
    setValue('amount', stringify(selectedData.amount));
    setValue('balance', stringify(selectedData.balanceAfter));
    setValue('reason', selectedData.reason || '-');
  }, [selectedData]);

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
          <Typography variant="h5">
            {tBalanceCorrection('detailTitle')}
          </Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12 / 3} xs={12}>
            <Card sx={{ borderRadius: 4, p: 2 }}>
              <Stack direction="column" spacing={2}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  {tBalanceCorrection('detailVANumber')}
                </Typography>
                <Typography variant="subtitle2" sx={{ py: 0.8 }}>
                  {selectedData.accountPhoneNumber}
                </Typography>
              </Stack>
            </Card>
          </Grid>
          <Grid item md={12 / 3} xs={12}>
            <Card sx={{ borderRadius: 4, p: 2 }}>
              <Stack direction="column" spacing={2}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  {tBalanceCorrection('detailVAName')}
                </Typography>
                <Typography variant="subtitle2" sx={{ py: 0.8 }}>
                  {selectedData.accountName}
                </Typography>
              </Stack>
            </Card>
          </Grid>
          <Grid item md={12 / 3} xs={12}>
            <Card sx={{ borderRadius: 4, p: 2 }}>
              <Stack direction="column" spacing={2}>
                <Typography
                  variant="body2"
                  color={Token.color.greyscaleGreyDarkest}
                >
                  {tBalanceCorrection('detailBalance')}
                </Typography>
                <Typography variant="subtitle2" sx={{ py: 0.8 }}>
                  {PriceConverter.formatPrice(
                    selectedData.balanceBefore,
                    router.locale,
                  )}
                </Typography>
              </Stack>
            </Card>
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tBalanceCorrection('detailAction')}
            </Typography>
            <Autocomplete
              {...fieldAction}
              disabled
              onChange={(_, value) => fieldAction.onChange(value)}
              options={actionOptions}
              getOptionLabel={option => option.label}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              fullWidth
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', {
                    fieldName: 'action',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.action)}
                  helperText={errors.action?.message}
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tBalanceCorrection('detailAmountToCorrect')}
            </Typography>
            <TextField
              {...fieldAmount}
              disabled
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'amount',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              InputProps={{ inputComponent: NumberFormat as any }}
              error={Boolean(errors.amount)}
              helperText={errors.amount?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tBalanceCorrection('detailBalanceCorrected')}
            </Typography>
            <TextField
              {...fieldBalance}
              disabled
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'balance',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              InputProps={{ inputComponent: NumberFormat as any }}
              error={Boolean(errors.balance)}
              helperText={errors.balance?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tBalanceCorrection('detailReason')}
            </Typography>
            <TextField
              {...fieldReason}
              disabled
              fullWidth
              multiline
              minRows={2}
              maxRows={4}
              placeholder={tForm('placeholderType', {
                fieldName: 'reason',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.reason)}
              helperText={errors.reason?.message}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={'flex-end'}
          sx={{ p: 2, flex: 1 }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="flex-end"
          >
            <Button
              variant="contained"
              onClick={onHide}
              sx={{ py: 1, px: 5, borderRadius: 2 }}
            >
              OK
            </Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default ViewBalanceCorrectionModal;
