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
} from '@mui/material';
import { Button } from '@woi/web-component';
import { useController } from 'react-hook-form';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { TransactionTypeData } from '@woi/service/principal/admin/transactionType/transactionTypeList';
import useTransactionTypeUpsert from '../hooks/useTransactionTypeUpsert';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';
import { useTranslation } from 'react-i18next';

type CreateTransactionTypeModalProps = {
  selectedData: TransactionTypeData | null;
  isActive: boolean;
  onHide: () => void;
  fetchTransactionTypeList: () => void;
}

const CreateTransactionTypeModal = (props: CreateTransactionTypeModalProps) => {
  const { isActive, selectedData, onHide, fetchTransactionTypeList } = props;

  const {
    formData,
    handleUpsert,
    handleCancel,
    handleActivateDeactivate,
  } = useTransactionTypeUpsert({ selectedData, onHide, fetchTransactionTypeList });
  const { t: tCommon } = useTranslation('common');
  const { t: tTransactionType } = useTranslation('transactionType');
  const { t: tForm } = useTranslation('form');

  const isUpdate = Boolean(selectedData);

  const { formState: { errors }, control, getValues } = formData;

  const { field: fieldCode } = useController({
    name: 'code',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Code' }),
    }
  });

  const { field: fieldName } = useController({
    name: 'name',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Name' }),
    }
  });

  const { field: fieldDescription } = useController({
    name: 'description',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Description' }),
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
          <Typography variant="h5">{isUpdate ? tTransactionType('modalUpdateTitle') : tTransactionType('modalCreateTitle')}</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tTransactionType('formTransactionTypeCode')}</Typography>
            <TextField
              {...fieldCode}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'transaction type code' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
              error={Boolean(errors.code)}
              helperText={errors.code?.message}
              disabled={isUpdate}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tTransactionType('formTransactionTypeName')}</Typography>
            <TextField
              {...fieldName}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'transaction type name' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tTransactionType('formTransactionTypeDescription')}</Typography>
            <TextField
              {...fieldDescription}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'transaction type description' })}
              multiline
              rows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
              error={Boolean(errors.description)}
              helperText={errors.description?.message}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" alignItems="center" justifyContent={isUpdate ? 'space-between' : 'flex-end'} sx={{ p: 2, flex: 1 }}>
          {isUpdate && (
            <Button
              variant="text"
              startIcon={getValues('isActive') ? <ToggleOffIcon /> : <ToggleOnIcon />}
              color={getValues('isActive') ? "warning" : "success"}
              onClick={handleActivateDeactivate}
              sx={{ py: 1, borderRadius: 2 }}
            >
              {getValues('isActive') ? tTransactionType('actionDectivate') : tTransactionType('actionActivate')}
            </Button>
          )}
          <AuthorizeView access="transaction-type" privileges={['create', 'update']}>
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

export default CreateTransactionTypeModal;