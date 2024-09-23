import React from 'react';
import { 
  Dialog, 
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  IconButton,
  Grid,
  TextField,
  Autocomplete,
  Card,
  useTheme,
} from '@mui/material';


// Components
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@woi/web-component';

// Types
import { CommunityOwnerBankAccount } from '@woi/communityOwner';
import usePoolBankAccountUpsert from '../hooks/usePoolBankAccountUpsert';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type PoolBankAccountModalProps = {
  isActive: boolean;
  lists: CommunityOwnerBankAccount[];
  selectedData: CommunityOwnerBankAccount | null;
  onHide: () => void;
  onSubmit: (form: CommunityOwnerBankAccount) => void;
  onDelete: (form: CommunityOwnerBankAccount) => void;
}

const PoolBankAccountModal = (props: PoolBankAccountModalProps) => {
  const {
    isActive,
    lists,
    onHide,
    selectedData,
    onSubmit,
    onDelete,
  } = props;
  const theme = useTheme();
  
  const { 
    fundTypeOptions,
    bankOptions,
    currencyOptions,
    formData,
    handleSave,
    handleCancel,
  } = usePoolBankAccountUpsert({ selectedData, onHide, onSubmit });
  const { t: tCommon } = useTranslation('common');
  const { t: tCO } = useTranslation('co');
  const { t: tForm } = useTranslation('form');

  const isOnlyMain = selectedData && selectedData.fundType?.label === 'MAIN';
  const isEmpty = lists.length === 0 || isOnlyMain;

  const { control, formState: { errors } } = formData;
  
  const { field: fieldBank } = useController({
    name: 'bankId',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Bank name' }),
    }
  });

  const { field: fieldAccountNumber } = useController({
    name: 'number',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Account number' }),
    }
  });

  const { field: fieldAccountName } = useController({
    name: 'name',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Account name' }),
    }
  });

  const { field: fieldBin } = useController({
    name: 'bin',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Bin' }),
    }
  });

  const { field: fieldCurrency } = useController({
    name: 'currencyId',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Currency' }),
    }
  });

  const { field: fieldFundType } = useController({
    name: 'fundType',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Fund type' })
    }
  });

  const { field: fieldVALength } = useController({
    name: 'vaLength',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'VA length' })
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
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{tCO('poolBankAccountAdd')}</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers={true}>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          {isOnlyMain && (
            <Grid item md={12} xs={12}>
              <Card elevation={0} sx={{ p: 2, borderRadius: 3, mb: 1, backgroundColor: theme.palette.secondary.main }}>
                <Typography variant="body2">{tCO('poolBankAccountDisclaimer')}</Typography>
              </Card>
            </Grid>
          )}
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('poolBankAccountFormBank')}</Typography>
              <Autocomplete
                {...fieldBank}
                onChange={(_, value) => fieldBank.onChange(value)}
                options={bankOptions}
                fullWidth
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={tForm('placeholderSelect', { fieldName: 'bank' })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3
                      }
                    }}
                    error={Boolean(errors.bankId)}
                    helperText={errors.bankId?.message}
                  />
                )}
              />
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('poolBankAccountFormAccountNumber')}</Typography>
              <TextField
                {...fieldAccountNumber}
                fullWidth
                placeholder={tForm('placeholderType', { fieldName: 'account number' })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
                error={Boolean(errors.number)}
                helperText={errors.number?.message}
              />
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('poolBankAccountFormAccountName')}</Typography>
              <TextField
                {...fieldAccountName}
                fullWidth
                placeholder={tForm('placeholderType', { fieldName: 'account name' })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('poolBankAccountFormBin')}</Typography>
              <TextField
                {...fieldBin}
                fullWidth
                placeholder={tForm('placeholderType', { fieldName: 'bin' })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
                error={Boolean(errors.bin)}
                helperText={errors.bin?.message}
              />
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('poolBankAccountFormCurrency')}</Typography>
              <Autocomplete
                {...fieldCurrency}
                onChange={(_, value) => fieldCurrency.onChange(value)}
                options={currencyOptions}
                fullWidth
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={tForm('placeholderSelect', { fieldName: 'currency' })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3
                      }
                    }}
                    error={Boolean(errors.currencyId)}
                    helperText={errors.currencyId?.message}
                  />
                )}
              />
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('poolBankAccountFormFundType')}</Typography>
              <Autocomplete
                {...fieldFundType}
                onChange={(_, value) => fieldFundType.onChange(value)}
                options={fundTypeOptions.filter(option => !isEmpty || (isEmpty && option.label === 'MAIN'))}
                fullWidth
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={tForm('placeholderSelect', { fieldName: 'fund type' })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3
                      }
                    }}
                    error={Boolean(errors.fundType)}
                    helperText={errors.fundType?.message}
                  />
                )}
              />
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tCO('poolBankAccountFormVALength')}</Typography>
              <TextField
                {...fieldVALength}
                fullWidth
                placeholder={tForm('placeholderSelect', { fieldName: 'virtual account length' })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
                error={Boolean(errors.vaLength)}
                helperText={errors.vaLength?.message}
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: (selectedData && !isOnlyMain) ? 'space-between' : 'flex-end', p: 2 }}>
        {(selectedData && !isOnlyMain) && (
          <Button
            size="large"
            variant="text"
            onClick={() => onDelete(selectedData)}
            sx={{ py: 1, px: 5, borderRadius: 2 }}
          >{tCO('poolBankAccountDelete')}</Button>
        )}
        <Stack direction="row" spacing={2} alignItems="center">
          <Button size="large" variant="outlined" onClick={handleCancel} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tCommon('actionCancel')}</Button>
          <Button size="large" variant="contained" onClick={handleSave} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tCommon('actionSave')}</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default PoolBankAccountModal;