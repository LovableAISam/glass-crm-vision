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

// Icons
import CloseIcon from '@mui/icons-material/Close';

import { AccountRuleValueData } from '@woi/service/principal/admin/accountRuleValue/accountRuleValueList';
import useAccountRuleValueUpsert from '../hooks/useAccountRuleValueUpsert';
import { useController } from 'react-hook-form';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';
import { useTranslation } from 'react-i18next';

type CreateAccountRuleValueModalProps = {
  selectedData: AccountRuleValueData | null;
  isActive: boolean;
  onHide: () => void;
  fetchAccountRuleValueList: () => void;
}

const CreateAccountRuleValueModal = (props: CreateAccountRuleValueModalProps) => {
  const {
    selectedData,
    isActive,
    onHide,
    fetchAccountRuleValueList,
  } = props;
  const {
    currencyOptions,
    accountRuleOptions,
    transactionTypeOptions,
    formData,
    handleUpsert,
    handleDelete,
    handleCancel,
  } = useAccountRuleValueUpsert({ selectedData, onHide, fetchAccountRuleValueList });
  const { formState: { errors }, control } = formData;
  const { t: tCommon } = useTranslation('common');
  const { t: tAccountRuleValue } = useTranslation('accountRuleValue');
  const { t: tForm } = useTranslation('form');

  const isUpdate = Boolean(selectedData);

  const { field: fieldAccountRuleId } = useController({
    name: 'accountRulesId',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'account rule id' }),
    }
  });

  const { field: fieldTransactionType } = useController({
    name: 'transactionType',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'transaction type' }),
    }
  });

  const { field: fieldValueRegisterMember } = useController({
    name: 'valueRegisterMember',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'value register member' }),
    }
  });

  const { field: fieldValueUnregisterMember } = useController({
    name: 'valueUnregisterMember',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'value unregister member' }),
    }
  });

  const { field: fieldCurrency } = useController({
    name: 'currency',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'currency' }),
    }
  });

  const { field: fieldEffectiveDate } = useController({
    name: 'effectiveDate',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'effective date' }),
      validate: value => {
        if (value.startDate === null || value.endDate === null) return tForm('generalErrorRequired', { fieldName: 'effective date' });
      }
    }
  });

  return (
    <Dialog
      open={isActive}
      onClose={onHide}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 5,
        }
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{isUpdate ? tAccountRuleValue('modalUpdateTitle') : tAccountRuleValue('modalCreateTitle')}</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tAccountRuleValue('formAccountRuleName')}</Typography>
            <Autocomplete
              {...fieldAccountRuleId}
              onChange={(_, value) => fieldAccountRuleId.onChange(value)}
              options={accountRuleOptions}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', { fieldName: 'account rule' })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3
                    }
                  }}
                  error={Boolean(errors.accountRulesId)}
                  helperText={errors.accountRulesId?.message}
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tAccountRuleValue('formTransactionType')}</Typography>
            <Autocomplete
              {...fieldTransactionType}
              onChange={(_, value) => fieldTransactionType.onChange(value)}
              options={transactionTypeOptions}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', { fieldName: 'transaction type' })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3
                    }
                  }}
                  error={Boolean(errors.transactionType)}
                  helperText={errors.transactionType?.message}
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tAccountRuleValue('formValue')}</Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tAccountRuleValue('formForRegisteredMember')}</Typography>
            <TextField
              {...fieldValueRegisterMember}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'for registered member' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
              InputProps={{ inputComponent: NumberFormat as any }}
              error={Boolean(errors.valueRegisterMember)}
              helperText={errors.valueRegisterMember?.message}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tAccountRuleValue('formForUnregisteredMember')}</Typography>
            <TextField
              {...fieldValueUnregisterMember}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'for unregistered member' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
              InputProps={{ inputComponent: NumberFormat as any }}
              error={Boolean(errors.valueUnregisterMember)}
              helperText={errors.valueUnregisterMember?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tAccountRuleValue('formCurrency')}</Typography>
            <Autocomplete
              {...fieldCurrency}
              onChange={(_, value) => fieldCurrency.onChange(value)}
              options={currencyOptions}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', { fieldName: 'currency' })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3
                    }
                  }}
                  error={Boolean(errors.currency)}
                  helperText={errors.currency?.message}
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tAccountRuleValue('formEffectiveDate')}</Typography>
            <FormDatePicker
              {...fieldEffectiveDate}
              placeholder={tForm('placeholderSelect', { fieldName: 'date' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
              }}
              dateRangeProps={{
                minDate: new Date(),
              }}
              error={Boolean(errors.effectiveDate)}
              helperText={errors.effectiveDate?.message}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" alignItems="center" justifyContent={isUpdate ? 'space-between' : 'flex-end'} sx={{ p: 2, flex: 1 }}>
          {isUpdate && (
            <AuthorizeView access="account-rule-value" privileges={['delete']}>
              <Button variant="text" onClick={handleDelete} sx={{ py: 1, borderRadius: 2 }}>{tAccountRuleValue('actionDelete')}</Button>
            </AuthorizeView>
          )}
          <AuthorizeView access="account-rule-value" privileges={['create', 'update']}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
              <Button variant="outlined" onClick={handleCancel} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tCommon('actionCancel')}</Button>
              <Button variant="contained" onClick={handleUpsert} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tCommon('actionSave')}</Button>
            </Stack>
          </AuthorizeView>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default CreateAccountRuleValueModal;
