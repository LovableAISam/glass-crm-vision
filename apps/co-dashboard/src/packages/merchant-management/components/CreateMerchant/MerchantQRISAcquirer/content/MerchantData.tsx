// Core
import { useEffect } from 'react';

// Component
import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Button, FormSingleDatePicker, PhoneInput } from '@woi/web-component';

// Hooks & Utils
import { TextValidation } from '@woi/core';
import { matchIsValidTel } from 'mui-tel-input';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { QRISAcquirerContentProps } from '../MerchantQRISAcquirerContent';
import TabAction from '../../TabAction';

const MerchantData = (props: QRISAcquirerContentProps) => {
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
    clearErrors,
    watch
  } = formData;

  const { field: fieldMerchantType } = useController({
    name: 'merchantType',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'merchant type',
      }),
    },
  });

  const { field: fieldMerchantBrand } = useController({
    name: 'merchantBrand',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'Merchant brand name or owner name',
      }),
    },
  });

  const { field: fieldIdentityNo } = useController({
    name: 'identityNo',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'identity no',
      }),
    },
  });

  const { field: fieldIdentityNumber } = useController({
    name: 'identityNumber',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'identity number',
      }),
    },
  });

  const { field: fieldExpiredDate } = useController({
    name: 'expiredDate',
    control,
    rules: {
      validate: value => {
        if (fieldIdentityNo.value === 'Passport' && value === null) {
          return tForm('generalErrorRequired', {
            fieldName: 'expired date',
          });
        }
      },
    },
  });

  const { field: fieldDateOfBirth } = useController({
    name: 'dateOfBirth',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Date' }),
    },
  });

  const { field: fieldAddress } = useController({
    name: 'address',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'address',
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
    // rules: {
    //   required: tForm('generalErrorRequired', { fieldName: 'District' }),
    // },
  });

  const { field: fieldVillage } = useController({
    name: 'village',
    control,
    // rules: {
    //   required: tForm('generalErrorRequired', { fieldName: 'Village' }),
    // },
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

  const { field: fieldPostCode } = useController({
    name: 'postCode',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Post code' }),
      validate: value => {
        if (!TextValidation.minChar(value, 5))
          return tForm('generalErrorMinChar', { number: 5 });
        else if (!TextValidation.maxChar(value, 5))
          return tForm('generalErrorMaxChar', { number: 5 });
      },
    },
  });

  const handleKeyPress = (event: any) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleKeyPressPassport = (event: any) => {
    const input = event.target as HTMLInputElement;
    const isLetter = /^[a-zA-Z]$/.test(event.key);
    const isDigit = /^[0-9]$/.test(event.key);
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    const currentValue = input.value;
    const newLength = currentValue.length - (end - start) + 1; // menghitung panjang setelah karakter baru ditambahkan
    if (newLength > 10) {
      event.preventDefault();
      return;
    }
    if (isDigit) {
      return; // angka diterima langsung
    }
    if (isLetter) {
      event.preventDefault(); // cegah input asli
      const upperChar = event.key.toUpperCase();

      input.value = currentValue.slice(0, start) + upperChar + currentValue.slice(end);
      setTimeout(() => {
        input.setSelectionRange(start + 1, start + 1);
      });
      return;
    }
    event.preventDefault();
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
          tMerchant('tabActionMerchantData2'),
          tMerchant('tabActionSettlementInformation'),
        ]}
      />
      <Stack direction="column" spacing={2}>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item md={12} xs={12}>
            <FormControl>
              <RadioGroup
                {...fieldMerchantType}
                row
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
              >
                <FormControlLabel
                  value="INDIVIDUAL"
                  control={<Radio />}
                  label={tMerchant('optionIndividual')}
                />
                <FormControlLabel
                  value="BUSINESS"
                  control={<Radio />}
                  label={tMerchant('optionBusinessEntity')}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formMerchantBrandNameorOwnerName')}
            </Typography>
            <TextField
              {...fieldMerchantBrand}
              error={Boolean(errors.merchantBrand)}
              helperText={errors.merchantBrand?.message}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'merchant brand name or owner name',
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
            <FormControl>
              <Typography variant="subtitle2" gutterBottom>
                {tMerchant('formIdentityNo')}
              </Typography>
              <RadioGroup
                {...fieldIdentityNo}
                onClick={value => {
                  fieldIdentityNo.onChange(value);
                  fieldIdentityNumber.onChange('');
                  clearErrors();
                }}
                row
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
              >
                <FormControlLabel
                  value="KTP"
                  control={<Radio />}
                  label={tMerchant('optionIdentityCard')}
                />
                <FormControlLabel
                  value="Passport"
                  control={<Radio />}
                  label={tMerchant('optionPassport')}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formIdentityNumber')}
            </Typography>
            <TextField
              {...fieldIdentityNumber}
              error={Boolean(errors.identityNumber)}
              helperText={errors.identityNumber?.message}
              fullWidth
              onKeyPress={watch().identityNo === 'Passport' ? handleKeyPressPassport : handleKeyPress}
              placeholder={tForm('placeholderType', {
                fieldName: 'identity number',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />
          </Grid>
          {fieldIdentityNo.value === 'Passport' && (
            <Grid item md={12} xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                {tMerchant('formPassportExpiredDate')}
              </Typography>
              <FormSingleDatePicker
                {...fieldExpiredDate}
                placeholder={tForm('placeholderSelect', {
                  fieldName: 'passpor expired date',
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
                error={Boolean(errors.expiredDate)}
                helperText={errors.expiredDate?.message}
              />
            </Grid>
          )}
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formDateOfBirth')}
            </Typography>
            <FormSingleDatePicker
              {...fieldDateOfBirth}
              placeholder={tForm('placeholderSelect', {
                fieldName: 'date of birth',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.dateOfBirth)}
              helperText={errors.dateOfBirth?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formAddress')}
            </Typography>
            <TextField
              {...fieldAddress}
              error={Boolean(errors.address)}
              helperText={errors.address?.message}
              fullWidth
              inputProps={{ maxLength: 300 }}
              placeholder={tForm('placeholderType', {
                fieldName: 'address',
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
          <Grid item md={12} xs={12} hidden>
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
          <Grid item md={12} xs={12} hidden>
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
              {tMerchant('formPostCode')}
            </Typography>
            <TextField
              {...fieldPostCode}
              type="text"
              fullWidth
              inputProps={{ maxLength: 5 }}
              onKeyPress={handleKeyPress}
              placeholder={tForm('placeholderType', {
                fieldName: 'post code',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.postCode)}
              helperText={errors.postCode?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2">
              {tMerchant('formPhoneNo')}
            </Typography>
            <PhoneInput
              {...fieldPhoneNumber}
              textFieldProps={{
                onlyCountries: ['PH'],
                inputProps: { maxLength: 14 },
                // disabled: !!merchantDetail,
              }}
              error={Boolean(errors.phoneNumber)}
              helperText={errors.phoneNumber?.message}
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
