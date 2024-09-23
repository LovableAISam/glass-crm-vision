import React, { useState } from 'react';
import {
  Grid,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  FormControlLabel,
  Radio,
  Button,
  Avatar,
  Box,
  Divider,
  FormControl,
  FormHelperText,
} from '@mui/material';
import Image from 'next/legacy/image';

import { FormDatePicker, FormUpload, Token } from '@woi/web-component';
import { FileConvert, TextValidation } from '@woi/core';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useController, useFormContext } from 'react-hook-form';
import { CommunityOwnerData } from '@woi/communityOwner';
import { CreateCOModalContentProps } from './CreateCOModalContent';
import { useUploadTemporaryImageFetcher } from '@woi/service/principal';
import { useSnackbar } from 'notistack';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';
import TabAction from './TabAction';
import IdentityDataUserCredentialList from './IdentityDataUserCredentialList';
import IdentityDataAddressList from './IdentityDataAddressList';
import IdentityDataContactList from './IdentityDataContactList';
import { useTranslation } from 'react-i18next';

function IdentityData(props: CreateCOModalContentProps) {
  const { activeStep, handleComplete, handleCancel, selectedData } = props;
  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useFormContext<CommunityOwnerData>();
  const { enqueueSnackbar } = useSnackbar();
  const { baseUrl } = useBaseUrl();
  const [touched, setTouched] = useState<boolean>(false);
  const isUpdate = Boolean(selectedData);
  const { t: tCommon } = useTranslation('common');
  const { t: tCO } = useTranslation('co');
  const { t: tForm } = useTranslation('form');

  const handleSubmitForm = handleSubmit(form => {
    if (
      form.contacts.length === 0 ||
      form.addresses.length === 0 ||
      form.usersOTP.length === 0
    ) {
      setTouched(true);
      return;
    }
    handleComplete(activeStep + 1);
  });

  const validateForm = (callback: () => void) => {
    handleSubmit(form => {
      if (
        form.contacts.length === 0 ||
        form.addresses.length === 0 ||
        form.usersOTP.length === 0
      ) {
        setTouched(true);
        return;
      }
      handleComplete(activeStep + 1);
      callback();
    })();
  };

  const handleUploadBankLogo = async (file: File | null) => {
    if (!file) {
      setValue('bankLogo', null);
      return;
    }
    const { result, error, errorData } = await useUploadTemporaryImageFetcher(
      baseUrl,
      {
        upload: file,
      },
    );
    if (result && !error) {
      const dataUri = await FileConvert.getDataUriFromFile(file);
      setValue('bankLogo', {
        docPath: result.url,
        fileName: file.name,
        fileData: file,
        imageUri: dataUri as string,
      });
    } else {
      enqueueSnackbar(errorData?.details?.[0] || 'Upload Gagal!', {
        variant: 'error',
      });
    }
  };

  const handleUploadBackgroundCard = async (file: File | null) => {
    if (!file) {
      setValue('backgroundCard', null);
      return;
    }
    const { result, error, errorData } = await useUploadTemporaryImageFetcher(
      baseUrl,
      {
        upload: file,
      },
    );
    if (result && !error) {
      const dataUri = await FileConvert.getDataUriFromFile(file);
      setValue('backgroundCard', {
        docPath: result.url,
        fileName: file.name,
        fileData: file,
        imageUri: dataUri as string,
      });
    } else {
      enqueueSnackbar(errorData?.details?.[0] || 'Upload Gagal!', {
        variant: 'error',
      });
    }
  };

  const { field: fieldCode } = useController({
    name: 'code',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Code' }),
    },
  });

  const { field: fieldName } = useController({
    name: 'name',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Name' }),
    },
  });

  const { field: fieldSiupNo } = useController({
    name: 'siupNo',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'SIUP no' }),
    },
  });

  const { field: fieldEmail } = useController({
    name: 'email',
    control,
    rules: {
      required: 'Email no must be filled.',
      validate: value => {
        if (!TextValidation.isEmailFormat(value))
          return tForm('generalErrorEmail');
      },
    },
  });

  const { field: fieldBackgroundCard } = useController({
    name: 'backgroundCard',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Background card' }),
    },
  });

  const { field: fieldBankLogo } = useController({
    name: 'bankLogo',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Bank logo' }),
    },
  });

  const { field: fieldCardable } = useController({
    name: 'cardable',
    control,
  });

  const { field: fieldLoyaltySupport } = useController({
    name: 'loyaltySupport',
    control,
  });

  const { field: fieldLoyaltyMerchantId } = useController({
    name: 'loyaltyMerchantId',
    control,
  });

  const { field: fieldLoyaltyMerchantCode } = useController({
    name: 'loyaltyMerchantCode',
    control,
  });

  const { field: fieldActiveDate } = useController({
    name: 'activeDate',
    control,
  });

  const { field: fieldInActiveDate } = useController({
    name: 'inactiveDate',
    control,
  });

  return (
    <Box>
      <TabAction {...props} validateForm={validateForm} />
      <Typography variant="h5" sx={{ mb: 2 }}>
        {tCO('tabActionConfiguration')}
      </Typography>
      <Grid container spacing={2} sx={{ pt: 1 }}>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('identityDataFormSuffixUrl')}
            </Typography>
            <TextField
              {...fieldCode}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'suffix url',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              disabled={isUpdate}
              error={Boolean(errors.code)}
              helperText={errors.code?.message}
            />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('identityDataFormCoName')}
            </Typography>
            <TextField
              {...fieldName}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'co name' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
          </Stack>
        </Grid>
        <Grid item md={12} xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            {tCO('identityDataFormEffectiveDate')}
          </Typography>
          <FormDatePicker
            value={{
              startDate: fieldActiveDate.value,
              endDate: fieldInActiveDate.value,
            }}
            onChange={({ startDate, endDate }) => {
              fieldActiveDate.onChange(startDate);
              fieldInActiveDate.onChange(endDate);
            }}
            placeholder={tForm('placeholderSelect', { fieldName: 'date' })}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('identityDataFormSIUPNo')}
            </Typography>
            <TextField
              {...fieldSiupNo}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'siup no' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.siupNo)}
              helperText={errors.siupNo?.message}
            />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('identityDataFormEmail')}
            </Typography>
            <TextField
              {...fieldEmail}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'email' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('identityDataFormBackLogo')}
            </Typography>
            <FormControl
              {...fieldBankLogo}
              component="fieldset"
              variant="standard"
              sx={{ width: '100%' }}
            >
              <FormUpload
                handleUpload={handleUploadBankLogo}
                uploadType={'Image'}
              >
                {({ triggerUpload }) => {
                  if (fieldBankLogo.value) {
                    return (
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: 50,
                              height: 50,
                              background: 'transparent',
                            }}
                          >
                            <Image
                              unoptimized
                              src={
                                fieldBankLogo.value.imageUri ||
                                fieldBankLogo.value.docPath
                              }
                              layout="fill"
                              style={{
                                objectFit: 'contain',
                              }}
                              alt="bankLogo"
                            />
                          </Avatar>
                          <Typography variant="body2">
                            {fieldBankLogo.value.fileName}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="text"
                            size="small"
                            onClick={triggerUpload}
                          >
                            {tCommon('actionReplace')}
                          </Button>
                          <Box>
                            <Divider orientation="vertical" />
                          </Box>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => handleUploadBankLogo(null)}
                          >
                            {tCommon('actionDelete')}
                          </Button>
                        </Stack>
                      </Stack>
                    );
                  }

                  return (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<FileUploadIcon />}
                      sx={{ borderRadius: 2 }}
                      onClick={triggerUpload}
                    >
                      {tCommon('actionUploadImage')}
                    </Button>
                  );
                }}
              </FormUpload>
              {Boolean(errors.bankLogo) && (
                <FormHelperText sx={{ color: Token.color.redDark }}>
                  {errors.bankLogo?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('identityDataFormBackgroupCard')}
            </Typography>
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
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: 50,
                              height: 50,
                              background: 'transparent',
                            }}
                          >
                            <Image
                              unoptimized
                              src={
                                fieldBackgroundCard.value.imageUri ||
                                fieldBackgroundCard.value.docPath
                              }
                              layout="fill"
                              style={{
                                objectFit: 'contain',
                              }}
                              alt="bgCard"
                            />
                          </Avatar>
                          <Typography variant="body2">
                            {fieldBackgroundCard.value.fileName}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="text"
                            size="small"
                            onClick={triggerUpload}
                          >
                            Replace
                          </Button>
                          <Box>
                            <Divider orientation="vertical" />
                          </Box>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => handleUploadBackgroundCard(null)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </Stack>
                    );
                  }

                  return (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<FileUploadIcon />}
                      sx={{ borderRadius: 2 }}
                      onClick={triggerUpload}
                    >
                      {tCommon('actionUploadImage')}
                    </Button>
                  );
                }}
              </FormUpload>
              {Boolean(errors.backgroundCard) && (
                <FormHelperText sx={{ color: Token.color.redDark }}>
                  {errors.backgroundCard?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Stack>
        </Grid>
        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('identityDataFormCardable')}
            </Typography>
            <FormControl
              component="fieldset"
              variant="standard"
              sx={{ width: '100%' }}
            >
              <RadioGroup
                {...fieldCardable}
                value={fieldCardable.value ? 'yes' : 'no'}
                onChange={(_, value) => fieldCardable.onChange(value === 'yes')}
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
              {Boolean(errors.cardable) && (
                <FormHelperText sx={{ color: Token.color.redDark }}>
                  {errors.cardable?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Stack>
        </Grid>
        <Grid item md={12} xs={12}>
          <IdentityDataUserCredentialList touched={touched} />
        </Grid>
        <Grid item md={12} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('identityDataFormLoyaltySupport')}
            </Typography>
            <FormControl
              component="fieldset"
              variant="standard"
              sx={{ width: '100%' }}
            >
              <RadioGroup
                {...fieldLoyaltySupport}
                value={fieldLoyaltySupport.value ? 'yes' : 'no'}
                onChange={(_, value) =>
                  fieldLoyaltySupport.onChange(value === 'yes')
                }
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
              {Boolean(errors.loyaltySupport) && (
                <FormHelperText sx={{ color: Token.color.redDark }}>
                  {errors.loyaltySupport?.message}
                </FormHelperText>
              )}
            </FormControl>
          </Stack>
        </Grid>
        {fieldLoyaltySupport.value && (
          <Grid item md={6} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">
                {tCO('identityDataFormLoyaltyMerchantID')}
              </Typography>
              <TextField
                {...fieldLoyaltyMerchantId}
                fullWidth
                placeholder={tForm('placeholderType', {
                  fieldName: 'loyalty merchant id',
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
                error={Boolean(errors.loyaltyMerchantId)}
                helperText={errors.loyaltyMerchantId?.message}
              />
            </Stack>
          </Grid>
        )}
        {fieldLoyaltySupport.value && (
          <Grid item md={6} xs={12}>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">
                {tCO('identityDataFormLoyaltyMerchantCode')}
              </Typography>
              <TextField
                {...fieldLoyaltyMerchantCode}
                fullWidth
                placeholder={tForm('placeholderType', {
                  fieldName: 'loyalty merchant code',
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
                error={Boolean(errors.loyaltyMerchantCode)}
                helperText={errors.loyaltyMerchantCode?.message}
              />
            </Stack>
          </Grid>
        )}
        <Grid item md={12} xs={12}>
          <IdentityDataAddressList touched={touched} />
        </Grid>
        <Grid item md={12} xs={12}>
          <IdentityDataContactList touched={touched} />
        </Grid>
      </Grid>
      <AuthorizeView access="co" privileges={['create', 'update']}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="flex-end"
          sx={{ pt: 2 }}
        >
          <Button
            size="large"
            variant="outlined"
            onClick={handleCancel}
            sx={{ py: 1, px: 5, borderRadius: 2 }}
          >
            {tCommon('actionCancel')}
          </Button>
          <Button
            size="large"
            variant="contained"
            onClick={handleSubmitForm}
            sx={{ py: 1, px: 5, borderRadius: 2 }}
          >
            {tCommon('actionNext')}
          </Button>
        </Stack>
      </AuthorizeView>
    </Box>
  );
}

export default IdentityData;
