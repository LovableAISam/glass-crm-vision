// Core
import React, { useEffect } from 'react';

// Component
import {
  Autocomplete,
  Box,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ImageUpload from '@src/shared/components/FormUpload/ImageUpload';
import {
  Button,
  FormDatePicker,
  PasswordInput,
  PhoneInput,
} from '@woi/web-component';

// Hooks & Utils
import useMerchantPartnerUpsert from '@src/packages/merchant-management/hooks/useMerchantPartnerUpsert';
import { TextValidation } from '@woi/core';
import { matchIsValidTel } from 'mui-tel-input';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { CreateMerchantModalContentProps } from '../CreateMerchantModalContent';

// Asset

const CreateMerchantPartner = (props: CreateMerchantModalContentProps) => {
  const {
    merchantDetail,
    selectEdit,
    setSelectEdit,
    onHide,
    fetchMerchantList,
  } = props;
  const { t: tCommon } = useTranslation('common');
  const { t: tMerchant } = useTranslation('merchant');
  const { t: tForm } = useTranslation('form');

  const isUpdate = Boolean(selectEdit);

  const {
    onUpload,
    formData,
    isLoading,
    imageUpload,
    onChangeImage,
    statusOptions,
    handleGeneratePassword,
    handleCancel,
    handleSave,
    merchantTypeOptions,
    merchantCategoryOptions,
    merchantCategoryCodeOptions,
    setImageUpload,
  } = useMerchantPartnerUpsert({
    setSelectEdit,
    onHide,
    isUpdate,
    merchantDetail,
    fetchMerchantList,
  });

  const {
    formState: { errors },
    control,
    getValues,
    setValue,
  } = formData;

  // const EmailValidation = require('emailvalid');
  // const ev = new EmailValidation({
  //   allowFreemail: true,
  //   blacklist: ['baddomain.com', 'yopmail.rrr'],
  // });

  const { field: fieldMerchantName } = useController({
    name: 'merchantName',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Merchant name' }),
    },
  });

  const { field: fieldMerchantEmail } = useController({
    name: 'email',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'Merchant email',
      }),
      validate: value => {
        // const validate = ev.check(value);
        if (!TextValidation.isEmailFormat(value))
          return tForm('generalErrorEmail');
        // if (!validate.valid)
        //   return tForm('generalErrorEmailDisposible');
      },
    },
  });

  const { field: fieldPassword } = useController({
    name: 'password',
    control,
    rules: isUpdate
      ? {}
      : {
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

  const { field: fieldPasswordConfirm } = useController({
    name: 'passwordConfirm',
    control,
    rules: isUpdate
      ? {}
      : {
        required: tForm('generalErrorRequired', {
          fieldName: 'Password confirm',
        }),
        validate: value => {
          if (value !== getValues('password'))
            return tForm('generalErrorMissMatching', {
              fieldName: 'Password',
            });
          return undefined;
        },
      },
  });

  const { field: fieldPhoneNumber } = useController({
    name: 'phoneNumber',
    control,
    rules: {
      validate: value => {
        if (value === null) {
          return tForm('generalErrorRequired', { fieldName: 'Phone number' });
        }
        if (!matchIsValidTel(value)) {
          return tForm('generalErrorFormat', { fieldName: 'Phone number' });
        }
      },
    },
  });

  const { field: fieldStatus } = useController({
    name: 'status',
    control,
    rules: !isUpdate
      ? {}
      : {
        required: tForm('generalErrorRequired', { fieldName: 'Status' }),
      },
  });

  const { field: fieldEffectiveDate } = useController({
    name: 'effectiveDate',
    control,
    rules: {
      validate: value => {
        if (value.startDate === null || value.endDate === null) {
          return tForm('generalErrorRequired', { fieldName: 'Effective date' });
        }
      },
    },
  });

  const { field: fieldMerchantType } = useController({
    name: 'merchantType',
    control,
    rules: !isUpdate
      ? {}
      : {
        required: tForm('generalErrorRequired', {
          fieldName: 'merchant type',
        }),
      },
  });

  const { field: fieldMerchantCategory } = useController({
    name: 'merchantCategory',
    control,
    rules: !isUpdate
      ? {}
      : {
        required: tForm('generalErrorRequired', {
          fieldName: 'merchant category',
        }),
      },
  });

  const { field: fieldMerchantCategoryCode } = useController({
    name: 'merchantCategoryCode',
    control,
    rules: !isUpdate
      ? {}
      : {
        required: tForm('generalErrorRequired', {
          fieldName: 'merchant category',
        }),
      },
  });

  useEffect(() => {
    if (isUpdate) {
      setValue('email', 'test@load.com');
      setValue('password', 'Urqbqg31)');
      setValue('passwordConfirm', 'Urqbqg31)');

      setValue(
        'merchantType',
        merchantTypeOptions.find(
          item => item.label === merchantDetail?.merchantType,
        ) || null,
      );
      setValue(
        'merchantCategory',
        merchantCategoryOptions.find(
          item => item.value === merchantDetail?.merchantCriteriaSecureId,
        ) || null,
      );
      setValue(
        'phoneNumber',
        `+${merchantDetail?.countryCode}${merchantDetail?.phoneNumber}`,
      );
      setValue(
        'status',
        statusOptions.find(
          item =>
            item.value === (merchantDetail?.isActive ? 'ACTIVE' : 'INACTIVE'),
        ) || null,
      );
      setValue('effectiveDate', {
        startDate: merchantDetail?.effectiveDateFrom
          ? new Date(merchantDetail?.effectiveDateFrom)
          : null,
        endDate: merchantDetail?.effectiveDateTo
          ? new Date(merchantDetail?.effectiveDateTo)
          : null,
      });
      setImageUpload({
        selectedImage: merchantDetail?.photoLogo || '',
        selectedFile: {
          docPath: merchantDetail?.photoLogo || '',
          fileName: undefined,
          fileData: undefined,
          imageUri: undefined,
        },
      });
    }
  }, [merchantDetail]);

  return (
    <Box>
      <Stack direction="column" spacing={2}>
        <Grid container spacing={2} sx={{ pt: 1, width: 'fit-content' }}>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formMerchantName')}
            </Typography>
            <TextField
              {...fieldMerchantName}
              error={Boolean(errors.merchantName)}
              helperText={errors.merchantName?.message}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'merchant name',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formMerchantType')}
            </Typography>
            <Autocomplete
              {...fieldMerchantType}
              onChange={(_, value) => fieldMerchantType.onChange(value)}
              options={merchantTypeOptions}
              fullWidth
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', {
                    fieldName: 'merchant type',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.merchantType)}
                  helperText={errors.merchantType?.message}
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formMerchantCategory')}
            </Typography>
            <Autocomplete
              {...fieldMerchantCategory}
              onChange={(_, value) => fieldMerchantCategory.onChange(value)}
              options={merchantCategoryOptions}
              fullWidth
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', {
                    fieldName: 'merchant category',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.merchantCategory)}
                  helperText={errors.merchantCategory?.message}
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formMerchantCategoryCode')}
            </Typography>
            <Autocomplete
              {...fieldMerchantCategoryCode}
              onChange={(_, value) => fieldMerchantCategoryCode.onChange(value)}
              options={merchantCategoryCodeOptions}
              fullWidth
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', {
                    fieldName: 'merchant category code',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.merchantCategoryCode)}
                  helperText={errors.merchantCategoryCode?.message}
                />
              )}
            />
          </Grid>
          {merchantDetail === null && !isUpdate && (
            <React.Fragment>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {tMerchant('formEmail')}
                </Typography>
                <TextField
                  {...fieldMerchantEmail}
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  fullWidth
                  inputProps={{ maxLength: 100 }}
                  placeholder={tForm('placeholderType', {
                    fieldName: 'email',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>
              <Grid item md={6}>
                <Stack direction="column" spacing={1} alignItems="flex-start">
                  <Typography variant="subtitle2">
                    {tMerchant('formPassword')}
                  </Typography>
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
                  <Button
                    variant="text"
                    color="primary"
                    onClick={handleGeneratePassword}
                  >
                    {tMerchant('actionGeneratePassword')}
                  </Button>
                </Stack>
              </Grid>
              <Grid item md={6}>
                <Stack direction="column" spacing={1}>
                  <Typography variant="subtitle2">
                    {tMerchant('formConfirmPassword')}
                  </Typography>
                  <PasswordInput
                    {...fieldPasswordConfirm}
                    fullWidth
                    placeholder={tForm('placeholderType', {
                      fieldName: 'confirm password',
                    })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                    error={Boolean(errors.passwordConfirm)}
                    helperText={errors.passwordConfirm?.message}
                  />
                </Stack>
              </Grid>
            </React.Fragment>
          )}
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2">
              {tMerchant('formPhoneNo')}
            </Typography>
            <PhoneInput
              {...fieldPhoneNumber}
              error={Boolean(errors.phoneNumber)}
              helperText={errors.phoneNumber?.message}
              textFieldProps={{
                disableFormatting: true,
                onlyCountries: ['ID'],
                inputProps: { maxLength: 12 },
                disabled: !!merchantDetail,
              }}
            />
          </Grid>
          {isUpdate && (
            <Grid item md={12} xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                {tMerchant('formStatus')}
              </Typography>
              <Autocomplete
                {...fieldStatus}
                options={statusOptions}
                onChange={(_, select) =>
                  fieldStatus.onChange(select?.label || null)
                }
                fullWidth
                renderInput={params => (
                  <TextField
                    {...params}
                    placeholder={tForm('placeholderSelect', {
                      fieldName: 'status',
                    })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                    error={Boolean(errors.status)}
                    helperText={errors.status?.message}
                  />
                )}
              />
            </Grid>
          )}
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formLogo')}
            </Typography>

            <Box sx={{ display: 'flex' }}>
              <Stack sx={{ mt: 1 }} direction="column">
                <ImageUpload
                  type="MERCHANT"
                  selectedFile={imageUpload?.selectedFile || null}
                  selectedImage={imageUpload?.selectedImage || null}
                  onChange={onUpload}
                  onChangeImage={onChangeImage}
                  limitSize={2000000}
                />
              </Stack>

              <Card
                elevation={0}
                sx={{
                  mt: 1,
                  ml: 2,
                  pr: 3,
                  pt: 2,
                  borderRadius: 3,
                  backgroundColor: '#F2F4FF',
                  width: '100%',
                }}
              >
                <Typography variant="body2">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: tMerchant('logoInfo'),
                    }}
                  />
                </Typography>
              </Card>
            </Box>
          </Grid>
          <Grid item md={12} xs={12}>
            <FormDatePicker
              {...fieldEffectiveDate}
              error={Boolean(errors.effectiveDate)}
              helperText={errors.effectiveDate?.message}
              upcomingDate
              title={tMerchant('formEffectiveDate')}
              size="small"
              placeholder={tForm('placeholderSelect', { fieldName: 'date' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  height: '56px',
                },
              }}
            />
          </Grid>
        </Grid>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="flex-end"
          sx={{ p: 2 }}
        >
          <Button
            variant="outlined"
            disabled={isLoading}
            onClick={handleCancel}
            sx={{ py: 1, px: 5, borderRadius: 2 }}
          >
            {tCommon('confirmationUpdateNo')}
          </Button>
          <Button
            variant="contained"
            disabled={isLoading}
            onClick={e => handleSave(e)}
            sx={{ py: 1, px: 5, borderRadius: 2 }}
          >
            {tCommon('actionSave')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CreateMerchantPartner;
