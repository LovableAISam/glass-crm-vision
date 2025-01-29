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
  Avatar,
  Box,
  Divider,
  FormControl,
  FormHelperText,
} from '@mui/material';
import Image from 'next/image';
import { Button, FormColor, FormUpload, Token } from '@woi/web-component';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useController } from 'react-hook-form';
import { BankData } from '@woi/service/principal/admin/bank/bankList';
import useBankUpsert from '../hooks/useBankUpsert';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';
import { useTranslation } from 'react-i18next';

type CreateBankModalProps = {
  selectedData: BankData | null;
  isActive: boolean;
  onHide: () => void;
  fetchBankList: () => void;
}

const CreateBankModal = (props: CreateBankModalProps) => {
  const { isActive, selectedData, onHide, fetchBankList } = props;

  const {
    handleUploadBankLogo,
    handleUploadBackgroundCard,
    statusOptions,
    formData,
    handleUpsert,
    handleCancel,
    handleActivateDeactivate,
  } = useBankUpsert({ selectedData, onHide, fetchBankList });
  const { t: tCommon } = useTranslation('common');
  const { t: tBank } = useTranslation('bank');
  const { t: tForm } = useTranslation('form');

  const isUpdate = Boolean(selectedData);

  const { formState: { errors }, control, getValues } = formData;

  const { field: fieldBackgroundCard } = useController({
    name: 'backgroundCard',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Background card' }),
    }
  });

  const { field: fieldColor } = useController({
    name: 'color',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Color' }),
    }
  });

  const { field: fieldFullname } = useController({
    name: 'fullName',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Fullname' }),
    }
  });

  const { field: fieldLogo } = useController({
    name: 'logo',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Logo' }),
    }
  });

  const { field: fieldName } = useController({
    name: 'name',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Name' }),
    }
  });

  const { field: fieldStatus } = useController({
    name: 'status',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Status' }),
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
          <Typography variant="h5">{isUpdate ? tBank('modalUpdateTitle') : tBank('modalCreateTitle')}</Typography>
          <IconButton onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tBank('formName')}</Typography>
            <TextField
              {...fieldName}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'bank name' })}
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
            <Typography variant="subtitle2" gutterBottom>{tBank('formFullname')}</Typography>
            <TextField
              {...fieldFullname}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'bank full name' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
              error={Boolean(errors.fullName)}
              helperText={errors.fullName?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tBank('formColorCode')}</Typography>
            <FormColor
              {...fieldColor}
              fullWidth
              placeholder={tForm('placeholderSelect', { fieldName: 'bank color code' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
              error={Boolean(errors.color)}
              helperText={errors.color?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tBank('formLogo')}</Typography>
            <FormControl
              {...fieldLogo}
              component="fieldset"
              variant="standard"
              sx={{ width: '100%' }}
            >
              <FormUpload
                handleUpload={handleUploadBankLogo}
                uploadType={'Image'}
              >
                {({ triggerUpload }) => {
                  if (fieldLogo.value) {
                    return (
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar variant="rounded" sx={{ width: 50, height: 50, background: 'transparent' }}>
                            <Image unoptimized src={fieldLogo.value.imageUri || fieldLogo.value.docPath} layout="fill" objectFit="contain" />
                          </Avatar>
                          <Typography variant="body2">{fieldLogo.value.fileName}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Button variant="text" size="small" onClick={triggerUpload}>
                            {tCommon('actionReplace')}
                          </Button>
                          <Box>
                            <Divider orientation="vertical" />
                          </Box>
                          <Button variant="text" size="small" onClick={() => handleUploadBankLogo(null)}>
                            {tCommon('actionDelete')}
                          </Button>
                        </Stack>
                      </Stack>
                    )
                  }

                  return (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<FileUploadIcon />}
                      sx={{ py: 2, borderRadius: 2 }}
                      onClick={triggerUpload}
                      fullWidth
                    >
                      {tCommon('actionUploadImage')}
                    </Button>
                  )
                }}
              </FormUpload>
              {Boolean(errors.logo) && (
                <FormHelperText sx={{ color: Token.color.redDark }}>
                  {errors.logo?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tBank('formBackgroudCard')}</Typography>
            <FormControl
              {...fieldBackgroundCard}
              component="fieldset"
              variant="standard"
              sx={{ width: '100%' }}
            >
              <FormUpload
                handleUpload={handleUploadBackgroundCard}
                uploadType={'Image'}
              >
                {({ triggerUpload }) => {
                  if (fieldBackgroundCard.value) {
                    return (
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar variant="rounded" sx={{ width: 50, height: 50, background: 'transparent' }}>
                            <Image unoptimized src={fieldBackgroundCard.value.imageUri || fieldBackgroundCard.value.docPath} layout="fill" objectFit="contain" />
                          </Avatar>
                          <Typography variant="body2">{fieldBackgroundCard.value.fileName}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Button variant="text" size="small" onClick={triggerUpload}>
                            {tCommon('actionReplace')}
                          </Button>
                          <Box>
                            <Divider orientation="vertical" />
                          </Box>
                          <Button variant="text" size="small" onClick={() => handleUploadBackgroundCard(null)}>
                            {tCommon('actionDelete')}
                          </Button>
                        </Stack>
                      </Stack>
                    )
                  }

                  return (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<FileUploadIcon />}
                      sx={{ py: 2, borderRadius: 2 }}
                      onClick={triggerUpload}
                      fullWidth
                    >
                      {tCommon('actionUploadImage')}
                    </Button>
                  )
                }}
              </FormUpload>
              {Boolean(errors.backgroundCard) && (
                <FormHelperText sx={{ color: Token.color.redDark }}>
                  {errors.backgroundCard?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>{tBank('formStatus')}</Typography>
            <Autocomplete
              {...fieldStatus}
              onChange={(_, value) => fieldStatus.onChange(value)}
              options={statusOptions}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', { fieldName: 'postal status' })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3
                    }
                  }}
                  error={Boolean(errors.status)}
                  helperText={errors.status?.message}
                />
              )}
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
              {getValues('isActive') ? tBank('modalActionDeactivate') : tBank('modalActionActivate')}
            </Button>
          )}
          <AuthorizeView access="bank" privileges={['create', 'update']}>
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

export default CreateBankModal;