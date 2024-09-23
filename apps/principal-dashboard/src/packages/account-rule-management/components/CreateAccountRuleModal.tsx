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
  Box,
  Divider,
} from '@mui/material';
import { Button } from '@woi/web-component';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { AccountRuleData } from '@woi/service/principal/admin/accountRule/accountRuleList';
import useAccountRuleUpsert from '../hooks/useAccountRuleUpsert';
import { useController } from 'react-hook-form';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';
import { useTranslation } from 'react-i18next';

type CreateAccountRuleModalProps = {
  selectedData: AccountRuleData | null;
  isActive: boolean;
  onHide: () => void;
  fetchAccountRuleList: () => void;
}

const CreateAccountRuleModal = (props: CreateAccountRuleModalProps) => {
  const {
    selectedData,
    isActive,
    onHide,
    fetchAccountRuleList,
  } = props;
  const {
    formData,
    handleUpsert,
    handleDelete,
    handleCancel,
    handleActivateDeactivate,
  } = useAccountRuleUpsert({ selectedData, onHide, fetchAccountRuleList });
  const { formState: { errors }, control, getValues } = formData;
  const { t: tCommon } = useTranslation('common');
  const { t: tAccountRule } = useTranslation('accountRule');
  const { t: tForm } = useTranslation('form');

  const isUpdate = Boolean(selectedData);

  const { field: fieldCode } = useController({
    name: 'code',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Account rule code' }),
    }
  });

  const { field: fieldName } = useController({
    name: 'name',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Account rule name' }),
    }
  });

  const { field: fieldDescription } = useController({
    name: 'description',
    control,
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
          <Typography variant="h5">{isUpdate ? tAccountRule('modalUpdateTitle') : tAccountRule('modalCreateTitle')}</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tAccountRule('formAccountRuleCode')}</Typography>
            <TextField
              {...fieldCode}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'account rule code' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
              error={Boolean(errors.code)}
              helperText={errors.code?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tAccountRule('formAccountRuleName')}</Typography>
            <TextField
              {...fieldName}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'account rule name' })}
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
            <Typography variant="subtitle2" gutterBottom>{tAccountRule('formDescription')}</Typography>
            <TextField
              {...fieldDescription}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'description' })}
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
            <Stack direction="row" spacing={2}>
              <Button
                variant="text"
                startIcon={getValues('isActive') ? <ToggleOffIcon /> : <ToggleOnIcon />}
                color={getValues('isActive') ? "warning" : "success"}
                onClick={handleActivateDeactivate}
                sx={{ py: 1, borderRadius: 2 }}
              >
                {getValues('isActive') ? tAccountRule('actionDectivate') : tAccountRule('actionActivate')}
              </Button>
              <Box>
                <Divider orientation="vertical" />
              </Box>
              <AuthorizeView access="account-rule" privileges={['delete']}>
                <Button
                  variant="text"
                  startIcon={<DeleteIcon />}
                  color="error"
                  onClick={handleDelete}
                  sx={{ py: 1, borderRadius: 2 }}
                >
                  {tAccountRule('actionDelete')}
                </Button>
              </AuthorizeView>
            </Stack>
          )}
          <AuthorizeView access="account-rule" privileges={['create', 'update']}>
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

export default CreateAccountRuleModal;