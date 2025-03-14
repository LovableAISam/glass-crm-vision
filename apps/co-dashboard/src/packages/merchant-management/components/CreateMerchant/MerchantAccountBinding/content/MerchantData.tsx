// Core
import { useEffect } from 'react';

// Component
import {
  Autocomplete,
  Box,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Button,
  FormDatePicker,
  PasswordInput,
  PhoneInput,
} from '@woi/web-component';
import TabAction from '../../TabAction';

// Hooks & Utils
import { TextValidation } from '@woi/core';
import { matchIsValidTel } from 'mui-tel-input';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { AccountBindingContentProps } from '../MerchantAccountBindingContent';

const MerchantData = (props: AccountBindingContentProps) => {
  const {
    formData,
    isLoading,
    handleCancel,
    fetchCityList,
    provinceOptions,
    cityOptions,
    handleSave,
    fetchDistrictList,
    fetchVillageList,
    villageOptions,
    districtOptions,
    merchantDetail,
    activeStep,
    completed,
    setActiveStep,
    validateForm,
    fetchProvinceList
  } = props;

  const { t: tCommon } = useTranslation('common');
  const { t: tMerchant } = useTranslation('merchant');
  const { t: tForm } = useTranslation('form');

  const {
    formState: { errors },
    control,
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
      required: tForm('generalErrorRequired', {
        fieldName: 'Merchant name',
      }),
    },
  });

  const { field: fieldNIB } = useController({
    name: 'nib',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'nib',
      }),
    },
  });

  const { field: fieldMerchantEmail } = useController({
    name: 'merchantEmail',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'merchant email',
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
    rules: {
      required: 'Password must be filled.',
      validate: value => {
        if (!TextValidation.minChar(value, 8)) return 'Min. 8 characters.';
        else if (!TextValidation.maxChar(value, 20))
          return 'Max. 20 characters.';
        else if (!TextValidation.containsUppercase(value))
          return 'At least 1 uppercase letter.';
        else if (!TextValidation.containsSpecialChars(value))
          return 'At least 1 symbols.';
        else if (!TextValidation.containsNumber(value))
          return 'At least 1 number.';
      },
    },
  });

  const { field: fieldWebsiteMerchant } = useController({
    name: 'websiteMerchant',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'website merchant',
      }),
    },
  });

  const { field: fieldPaymentNotifyUrl } = useController({
    name: 'paymentNotifyUrl',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'payment notify url',
      }),
    },
  });

  const { field: fieldSecretKey } = useController({
    name: 'secretKey',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'secret key / client secret',
      }),
    },
  });

  const { field: fieldClientId } = useController({
    name: 'clientId',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'client id',
      }),
    },
  });

  const { field: fieldURLAccessTokenB2B } = useController({
    name: 'urlAccessTokenB2B',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'url access token b2b',
      }),
    },
  });

  const { field: fieldURLPaymentDirectSuccess } = useController({
    name: 'urlPaymentDirectSuccess',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'url payment direct success',
      }),
    },
  });

  const { field: fieldURLPaymentDirectFailed } = useController({
    name: 'urlPaymentDirectFailed',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'url payment direct failed',
      }),
    },
  });

  const { field: fieldPublicKey } = useController({
    name: 'publicKey',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'public key',
      }),
    },
  });

  const { field: fieldChannelID } = useController({
    name: 'channelID',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'channel id',
      }),
    },
  });

  const { field: fieldEffectiveDate } = useController({
    name: 'effectiveDate',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'effective date' }),
      validate: value => {
        if (value.startDate === null || value.endDate === null) {
          return tCommon('errorDatePickerGeneral');
        }
      },
    },
  });

  const { field: fieldFee } = useController({
    name: 'fee',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'fee',
      }),
    },
  });

  const { field: fieldMerchantAddress } = useController({
    name: 'merchantAddress',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'merchant address',
      }),
    },
  });

  const { field: fieldProvince } = useController({
    name: 'province',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Province' }),
    },
  });

  const { field: fieldCity } = useController({
    name: 'city',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'City' }),
    },
  });

  const { field: fieldDistrict } = useController({
    name: 'district',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'District' }),
    },
  });

  const { field: fieldVillage } = useController({
    name: 'village',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Village' }),
    },
  });

  const { field: fieldPostalCode } = useController({
    name: 'postalCode',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Postal code' }),
      validate: value => {
        if (!TextValidation.minChar(value, 5))
          return tForm('generalErrorMinChar', { number: 5 });
        else if (!TextValidation.maxChar(value, 5))
          return tForm('generalErrorMaxChar', { number: 5 });
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

  const handleKeyPress = (event: any) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (merchantDetail) {
      fetchProvinceList('c727a474-0ffc-4497-9b2c-6c7f291895bc', true);
    }
  }, [merchantDetail]);

  return (
    <Box>
      <TabAction
        activeStep={activeStep}
        completed={completed}
        setActiveStep={setActiveStep}
        validateForm={validateForm}
        steps={[
          tMerchant('tabActionMerchantData'),
          tMerchant('tabActionSettlementInformation'),
        ]}
      />

      <Stack direction="column" spacing={2}>
        <Grid container spacing={2} sx={{ pt: 1 }}>
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
              inputProps={{ maxLength: 50 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formNIB')}
            </Typography>
            <TextField
              {...fieldNIB}
              error={Boolean(errors.nib)}
              helperText={errors.nib?.message}
              fullWidth
              inputProps={{ maxLength: 13 }}
              onKeyPress={handleKeyPress}
              placeholder={tForm('placeholderType', {
                fieldName: 'nib',
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
              {tMerchant('formEmailOfMerchant')}
            </Typography>
            <TextField
              {...fieldMerchantEmail}
              error={Boolean(errors.merchantEmail)}
              helperText={errors.merchantEmail?.message}
              fullWidth
              inputProps={{ maxLength: 100 }}
              placeholder={tForm('placeholderType', {
                fieldName: 'merchant email',
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
              {tMerchant('formPassword')}
            </Typography>
            <PasswordInput
              {...fieldPassword}
              fullWidth
              placeholder={tForm('newPasswordFieldPlaceholder')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formWebsiteMerchant')}
            </Typography>
            <TextField
              {...fieldWebsiteMerchant}
              error={Boolean(errors.websiteMerchant)}
              helperText={errors.websiteMerchant?.message}
              fullWidth
              inputProps={{ maxLength: 100 }}
              placeholder={tForm('placeholderType', {
                fieldName: 'website merchant',
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
              {tMerchant('formPaymentNotifyURL')}
            </Typography>
            <TextField
              {...fieldPaymentNotifyUrl}
              error={Boolean(errors.paymentNotifyUrl)}
              helperText={errors.paymentNotifyUrl?.message}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'payment notify url',
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
              {tMerchant('formSecretKeyClientSecret')}
            </Typography>
            <TextField
              {...fieldSecretKey}
              error={Boolean(errors.secretKey)}
              helperText={errors.secretKey?.message}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'secret key',
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
              {tMerchant('formClientIdXClientId')}
            </Typography>
            <TextField
              {...fieldClientId}
              error={Boolean(errors.clientId)}
              helperText={errors.clientId?.message}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'client id / x-client-key',
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
              {tMerchant('formURLAccessTokenB2B')}
            </Typography>
            <TextField
              {...fieldURLAccessTokenB2B}
              error={Boolean(errors.urlAccessTokenB2B)}
              helperText={errors.urlAccessTokenB2B?.message}
              fullWidth
              inputProps={{ maxLength: 100 }}
              placeholder={tForm('placeholderType', {
                fieldName: 'url access token b2b',
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
              {tMerchant('formURLPaymentDirectSuccess')}
            </Typography>
            <TextField
              {...fieldURLPaymentDirectSuccess}
              error={Boolean(errors.urlPaymentDirectSuccess)}
              helperText={errors.urlPaymentDirectSuccess?.message}
              fullWidth
              inputProps={{ maxLength: 100 }}
              placeholder={tForm('placeholderType', {
                fieldName: 'url payment direct success',
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
              {tMerchant('formURLPaymentDirectFailed')}
            </Typography>
            <TextField
              {...fieldURLPaymentDirectFailed}
              error={Boolean(errors.urlPaymentDirectFailed)}
              helperText={errors.urlPaymentDirectFailed?.message}
              fullWidth
              inputProps={{ maxLength: 100 }}
              placeholder={tForm('placeholderType', {
                fieldName: 'url payment direct failed',
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
              {tMerchant('formPublicKey')}
            </Typography>
            <TextField
              {...fieldPublicKey}
              error={Boolean(errors.publicKey)}
              helperText={errors.publicKey?.message}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'public key',
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
              {tMerchant('formChannelID')}
            </Typography>
            <TextField
              {...fieldChannelID}
              error={Boolean(errors.channelID)}
              helperText={errors.channelID?.message}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'public key',
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
              {tMerchant('formEffectiveDate')}
            </Typography>
            <FormDatePicker
              {...fieldEffectiveDate}
              placeholder={tForm('placeholderSelect', { fieldName: 'date' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              upcomingDate
              dateRangeProps={{
                minDate: new Date(),
              }}
              error={Boolean(errors.effectiveDate)}
              helperText={errors.effectiveDate?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formFee')}
            </Typography>
            <TextField
              {...fieldFee}
              error={Boolean(errors.fee)}
              helperText={errors.fee?.message}
              fullWidth
              inputProps={{ maxLength: 30 }}
              onKeyPress={handleKeyPress}
              placeholder={tForm('placeholderType', {
                fieldName: 'fee',
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
              {tMerchant('formMerchantAddress')}
            </Typography>
            <TextField
              {...fieldMerchantAddress}
              error={Boolean(errors.merchantAddress)}
              helperText={errors.merchantAddress?.message}
              fullWidth
              inputProps={{ maxLength: 300 }}
              placeholder={tForm('placeholderType', {
                fieldName: 'merchant address',
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
              {tMerchant('formProvince')}
            </Typography>
            <Autocomplete
              {...fieldProvince}
              onChange={(_, value) => {
                fieldProvince.onChange(value);
                if (value) {
                  fetchCityList(value.value);
                }
                if (value && value !== fieldProvince.value) {
                  setValue('city', null);
                  setValue('district', null);
                  setValue('village', null);
                }
              }}
              options={provinceOptions}
              fullWidth
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', {
                    fieldName: 'province',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.province)}
                  helperText={errors.province?.message}
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formCity')}
            </Typography>
            <Autocomplete
              {...fieldCity}
              onChange={(_, value) => {
                fieldCity.onChange(value);
                if (value) {
                  fetchDistrictList(value.value);
                }
                if (value && value !== fieldCity.value) {
                  setValue('district', null);
                  setValue('village', null);
                }
              }}
              options={cityOptions}
              fullWidth
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', {
                    fieldName: 'city',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.city)}
                  helperText={errors.city?.message}
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formDistrict')}
            </Typography>
            <Autocomplete
              {...fieldDistrict}
              onChange={(_, value) => {
                fieldDistrict.onChange(value);
                if (value) {
                  fetchVillageList(value.value);
                }
                if (value && value !== fieldDistrict.value) {
                  setValue('village', null);
                }
              }}
              options={districtOptions}
              fullWidth
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', {
                    fieldName: 'district',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.district)}
                  helperText={errors.district?.message}
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formVillage')}
            </Typography>
            <Autocomplete
              {...fieldVillage}
              onChange={(_, value) => {
                fieldVillage.onChange(value);
              }}
              options={villageOptions}
              fullWidth
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', {
                    fieldName: 'village',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.village)}
                  helperText={errors.village?.message}
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formPostalCode')}
            </Typography>
            <TextField
              {...fieldPostalCode}
              type="text"
              fullWidth
              inputProps={{ maxLength: 5 }}
              onKeyPress={handleKeyPress}
              placeholder={tForm('placeholderType', {
                fieldName: 'postal code',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.postalCode)}
              helperText={errors.postalCode?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2">
              {tMerchant('formPhoneNo')}
            </Typography>
            <PhoneInput
              {...fieldPhoneNumber}
              error={Boolean(errors.phoneNumber)}
              helperText={errors.phoneNumber?.message}
              textFieldProps={{
                onlyCountries: ['PH'],
                inputProps: { maxLength: 14 },
                // disabled: !!merchantDetail,
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
            {tCommon('actionNext')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default MerchantData;
