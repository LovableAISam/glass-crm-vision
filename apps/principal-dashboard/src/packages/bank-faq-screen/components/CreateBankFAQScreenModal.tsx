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
  FormControl,
  FormHelperText,
  Box,
  Divider,
} from '@mui/material';
import { Button, FormEditor, Token } from '@woi/web-component';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { BankFAQData } from '@woi/service/principal/admin/bankFAQ/bankFAQList';
import useBankFAQUpsert from '../hooks/useBankFAQUpsert';
import { useController } from 'react-hook-form';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';
import { useTranslation } from 'react-i18next';

type CreateBankModalProps = {
  selectedData: BankFAQData | null;
  isActive: boolean;
  onHide: () => void;
  fetchBankFAQList: () => void;
}

const CreateBankFAQScreenModal = (props: CreateBankModalProps) => {
  const { isActive, selectedData, onHide, fetchBankFAQList } = props;

  const {
    bankOptions,
    formData,
    handleUpsert,
    handleDelete,
    handleCancel,
    handleActivateDeactivate,
  } = useBankFAQUpsert({ selectedData, onHide, fetchBankFAQList });
  const { t: tCommon } = useTranslation('common');
  const { t: tBankFAQ } = useTranslation('bankFAQ');
  const { t: tForm } = useTranslation('form');

  const isUpdate = Boolean(selectedData);

  const { formState: { errors }, control, getValues } = formData;

  const { field: fieldHeader } = useController({
    name: 'header',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Header' }),
    }
  });

  const { field: fieldContent } = useController({
    name: 'content',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Content' }),
    }
  });

  const { field: fieldBank } = useController({
    name: 'bank',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Bank' }),
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
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{isUpdate ? tBankFAQ('modalUpdateTitle') : tBankFAQ('modalCreateTitle')}</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tBankFAQ('formBankFAQHeader')}</Typography>
            <TextField
              {...fieldHeader}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'bank FAQ header' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
              error={Boolean(errors.header)}
              helperText={errors.header?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tBankFAQ('formBankFAQContent')}</Typography>
            <FormControl
              component="fieldset"
              variant="standard"
              sx={{ width: '100%' }}
            >
              <FormEditor
                {...fieldContent}
                onChange={(value) => fieldContent.onChange(value)}
              />
              {Boolean(errors.content) && (
                <FormHelperText sx={{ color: Token.color.redDark }}>
                  {errors.content?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tBankFAQ('formBankName')}</Typography>
            <Autocomplete
              {...fieldBank}
              onChange={(_, value) => fieldBank.onChange(value)}
              options={bankOptions}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', { fieldName: 'bank' })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3
                    }
                  }}
                  error={Boolean(errors.bank)}
                  helperText={errors.bank?.message}
                />
              )}
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
                {getValues('isActive') ? tBankFAQ('actionDectivate') : tBankFAQ('actionActivate')}
              </Button>
              <Box>
                <Divider orientation="vertical" />
              </Box>
              <AuthorizeView access="bank-faq" privileges={['delete']}>
                <Button
                  variant="text"
                  startIcon={<DeleteIcon />}
                  color="error"
                  onClick={handleDelete}
                  sx={{ py: 1, borderRadius: 2 }}
                >
                  {tBankFAQ('actionDelete')}
                </Button>
              </AuthorizeView>
            </Stack>
          )}
          <AuthorizeView access="bank-faq" privileges={['create', 'update']}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end" sx={{ flex: 1 }}>
              <Button variant="outlined" onClick={handleCancel} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tCommon('actionCancel')}</Button>
              <Button variant="contained" onClick={handleUpsert} sx={{ py: 1, px: 5, borderRadius: 2 }}>{tCommon('actionSave')}</Button>
            </Stack>
          </AuthorizeView>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default CreateBankFAQScreenModal;