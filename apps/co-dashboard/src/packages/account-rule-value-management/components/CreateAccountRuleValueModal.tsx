import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  IconButton,
  TextField,
  Grid,
  Autocomplete,
} from '@mui/material';
import { Button, FormDatePicker, NumberFormat } from '@woi/web-component';
import { useTranslation } from 'react-i18next';

// Icons
import CloseIcon from '@mui/icons-material/Close';

import { AccountRuleValueData } from '@woi/service/co/admin/accountRuleValue/accountRuleValueList';
import useAccountRuleValueUpsert from '../hooks/useAccountRuleValueUpsert';
import { useController } from 'react-hook-form';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';

type CreateAccountRuleValueModalProps = {
  selectedData: AccountRuleValueData | null;
  isActive: boolean;
  onHide: () => void;
  fetchAccountRuleValueList: () => void;
};

const CreateAccountRuleValueModal = (
  props: CreateAccountRuleValueModalProps,
) => {
  const { selectedData, isActive, onHide, fetchAccountRuleValueList } = props;
  const {
    currencyOptions,
    accountRuleOptions,
    transactionTypeOptions,
    formData,
    handleUpsert,
    handleCancel,
  } = useAccountRuleValueUpsert({
    selectedData,
    onHide,
    fetchAccountRuleValueList,
  });
  const {
    formState: { errors },
    control,
    getValues
  } = formData;
  const { t: tCommon } = useTranslation('common');
  const { t: tAccountRuleValue } = useTranslation('accountRuleValue');
  const { t: tForm } = useTranslation('form');

  const accountRule = getValues('accountRuleId.label');
  const isUpdate = Boolean(selectedData);

  const { field: fieldAccountRuleId } = useController({
    name: 'accountRuleId',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'account rule id' }),
    },
  });

  const { field: fieldTransactionType } = useController({
    name: 'transactionType',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'transaction type',
      }),
    },
  });

  const { field: fieldValueUnregisterMember } = useController({
    name: 'valueUnregisterMember',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'value lite member',
      }),
    },
  });

  const { field: fieldValueRegisterMember } = useController({
    name: 'valueRegisterMember',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'value regular member',
      }),
    },
  });

  const { field: fieldValueProMember } = useController({
    name: 'valueProMember',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'value pro member',
      }),
    },
  });

  const { field: fieldCurrency } = useController({
    name: 'currency',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'currency' }),
    },
  });

  const { field: fieldEffectiveDate } = useController({
    name: 'effectiveDate',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'effective date' }),
      validate: value => {
        if (value.startDate === null || value.endDate === null)
          return tForm('generalErrorRequired', { fieldName: 'effective date' });
      },
    },
  });

  const { field: fieldInterval } = useController({
    name: 'intervalTime',
    control,
    rules: {
      validate: value => {
        if (!value && accountRule === 'Fraud Detection System') {
          return tForm('generalErrorRequired', { fieldName: 'interval' });
        }
        return undefined;
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
            {isUpdate
              ? tAccountRuleValue('modalUpdateTitle')
              : tAccountRuleValue('modalCreateTitle')}
          </Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tAccountRuleValue('formAccountRuleName')}
            </Typography>
            <Autocomplete
              {...fieldAccountRuleId}
              onChange={(_, value) => fieldAccountRuleId.onChange(value)}
              options={accountRuleOptions}
              fullWidth
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', {
                    fieldName: 'account rule',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.accountRuleId)}
                  helperText={errors.accountRuleId?.message}
                />
              )}
              disabled
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tAccountRuleValue('formTransactionType')}
            </Typography>
            <Autocomplete
              {...fieldTransactionType}
              onChange={(_, value) => fieldTransactionType.onChange(value)}
              options={transactionTypeOptions}
              fullWidth
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', {
                    fieldName: 'transaction type',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.transactionType)}
                  helperText={errors.transactionType?.message}
                />
              )}
              disabled
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tAccountRuleValue('formValue')}
            </Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tAccountRuleValue('formForUnregisterMember')}
            </Typography>
            <TextField
              {...fieldValueUnregisterMember}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'for lite member',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              InputProps={{ inputComponent: NumberFormat as any }}
              error={Boolean(errors.valueUnregisterMember)}
              helperText={errors.valueUnregisterMember?.message}
              disabled
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tAccountRuleValue('formForRegisterMember')}
            </Typography>
            <TextField
              {...fieldValueRegisterMember}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'for regular member',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              InputProps={{ inputComponent: NumberFormat as any }}
              error={Boolean(errors.valueRegisterMember)}
              helperText={errors.valueRegisterMember?.message}
              disabled
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tAccountRuleValue('formForProMember')}
            </Typography>
            <TextField
              {...fieldValueProMember}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'for pro member',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              InputProps={{ inputComponent: NumberFormat as any }}
              error={Boolean(errors.valueProMember)}
              helperText={errors.valueProMember?.message}
              disabled
            />
          </Grid>
          {accountRule === 'Fraud Detection System' && (
            <Grid item md={6} xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                {tAccountRuleValue('formInterval')}
              </Typography>
              <TextField
                {...fieldInterval}
                fullWidth
                placeholder={tAccountRuleValue('placeholderInterval')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
                InputProps={{ inputComponent: NumberFormat as any }}
                error={Boolean(errors.intervalTime)}
                helperText={errors.intervalTime?.message}
                disabled
              />
            </Grid>
          )}
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tAccountRuleValue('formCurrency')}
            </Typography>
            <Autocomplete
              {...fieldCurrency}
              onChange={(_, value) => fieldCurrency.onChange(value)}
              options={currencyOptions}
              fullWidth
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', {
                    fieldName: 'currency',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.currency)}
                  helperText={errors.currency?.message}
                />
              )}
              disabled
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tAccountRuleValue('formEffectiveDate')}
            </Typography>
            <FormDatePicker
              {...fieldEffectiveDate}
              placeholder={tForm('placeholderSelect', { fieldName: 'date' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              dateRangeProps={{
                minDate: new Date(),
              }}
              error={Boolean(errors.effectiveDate)}
              helperText={errors.effectiveDate?.message}
              disabled
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ display: 'none' }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ p: 2, flex: 1 }}
        >
          <AuthorizeView
            access="account-rule-value"
            privileges={['create', 'update']}
          >
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
              >
                {tCommon('actionCancel')}
              </Button>
              <Button
                variant="contained"
                onClick={handleUpsert}
                sx={{ py: 1, px: 5, borderRadius: 2 }}
              >
                {tCommon('actionSave')}
              </Button>
            </Stack>
          </AuthorizeView>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAccountRuleValueModal;
