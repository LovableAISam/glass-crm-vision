// Core
import { useEffect, useState } from 'react';

// Component
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Button,
  FormDatePicker,
  PasswordInput,
  FormSingleDatePicker,
} from '@woi/web-component';

// Hooks & Utils
import { useTranslation } from 'react-i18next';
import { TextValidation } from '@woi/core';
import { useController } from 'react-hook-form';

// Types & Consts
import { QRISAcquirerContentProps } from '../MerchantQRISAcquirerContent';
import TabAction from '../../TabAction';

const MerchantData2 = (props: QRISAcquirerContentProps) => {
  const {
    formData,
    isLoading,
    fetchCityList,
    handleSave,
    provinceOptions,
    cityOptions,
    qrTypeOptions,
    merchantTypeOptions,
    merchantCriteriaOptions,
    merchantCategoryOptions,
    merchantLocationOptions,
    fetchVillageList,
    districtOptions,
    villageOptions,
    fetchDistrictList,
    handleBack,
    merchantDetail,
    activeStep,
    completed,
    setActiveStep,
    validateForm,
    fetchProvinceList,
    fetchMerchantCriteriaList
  } = props;

  const { t: tCommon } = useTranslation('common');
  const { t: tMerchant } = useTranslation('merchant');
  const { t: tForm } = useTranslation('form');

  const [disable, setDisable] = useState(true);

  const {
    formState: { errors },
    control,
    setValue,
    watch
  } = formData;

  // const EmailValidation = require('emailvalid');
  // const ev = new EmailValidation({
  //   allowFreemail: true,
  //   blacklist: ['baddomain.com', 'yopmail.rrr'],
  // });

  const { field: fieldMerchantCompleteName } = useController({
    name: 'merchantCompleteName',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'Merchant complete name',
      }),
    },
  });

  const { field: fieldMerchantShortName } = useController({
    name: 'merchantShortName',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'Merchant short name',
      }),
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

  const { field: fieldIsQrisTag51 } = useController({
    name: 'isQrisTag51',
    control,
  });

  const { field: fieldQRType } = useController({
    name: 'qrType',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'QR type',
      }),
    },
  });

  const { field: fieldMerchantType2 } = useController({
    name: 'merchantType2',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'merchant type',
      }),
    },
  });

  const { field: fieldMerchantCriteria } = useController({
    name: 'merchantCriteria',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'merchant criteria',
      }),
    },
  });

  const { field: fieldMerchantCategoryCode } = useController({
    name: 'merchantCategoryCode',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'merchant category code',
      }),
    },
  });

  const { field: fieldGrossRevenue } = useController({
    name: 'grossRevenue',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'gross revenue',
      }),
    },
  });

  const { field: fieldComparisonOfTransactionFrom } = useController({
    name: 'comparisonOfTransactionFrom',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'comparison of transaction',
      }),
    },
  });

  const { field: fieldComparisonOfTransactionTo } = useController({
    name: 'comparisonOfTransactionTo',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'comparison of transaction',
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

  const { field: fieldNIKOrNIB } = useController({
    name: 'nikOrNIB',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'ID Number/NIB',
      }),
    },
  });

  const { field: fieldDateOfMerchantRelease } = useController({
    name: 'dateOfMerchantRelease',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'date of merchant release',
      }),
    },
  });

  const { field: fieldMDRPercentage } = useController({
    name: 'mdrPercentage',
    control,
  });

  const { field: fieldNMID } = useController({
    name: 'nmid',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'nmid',
      }),
    },
  });

  const { field: fieldAuthTokenUrl } = useController({
    name: 'authTokenUrl',
    control,
    // rules: {
    //   required: tForm('generalErrorRequired', {
    //     fieldName: 'auth token url',
    //   }),
    // },
  });

  const { field: fieldPaymentNotifyUrl } = useController({
    name: 'paymentNotifyUrl',
    control,
    // rules: {
    //   required: tForm('generalErrorRequired', {
    //     fieldName: 'payment notify url',
    //   }),
    // },
  });

  const { field: fieldSecretKey } = useController({
    name: 'secretKey',
    control,
    // rules: {
    //   required: tForm('generalErrorRequired', {
    //     fieldName: 'secret key',
    //   }),
    // },
  });

  const { field: fieldClientId } = useController({
    name: 'clientId',
    control,
    // rules: {
    //   required: tForm('generalErrorRequired', {
    //     fieldName: 'client id',
    //   }),
    // },
  });

  const { field: fieldPublicKey } = useController({
    name: 'publicKey',
    control,
    // rules: {
    //   required: tForm('generalErrorRequired', {
    //     fieldName: 'public key',
    //   }),
    // },
  });

  const { field: fieldMerchantAddressCorrespondence } = useController({
    name: 'merchantAddressCorrespondence',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'merchant address correspondence',
      }),
    },
  });

  const { field: fieldProvince2 } = useController({
    name: 'province2',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'province',
      }),
    },
  });

  const { field: fieldCity2 } = useController({
    name: 'city2',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'city',
      }),
    },
  });

  const { field: fieldDistrict2 } = useController({
    name: 'district2',
    control,
    // rules: {
    //   required: tForm('generalErrorRequired', {
    //     fieldName: 'district',
    //   }),
    // },
  });

  const { field: fieldVillage2 } = useController({
    name: 'village2',
    control,
    // rules: {
    //   required: tForm('generalErrorRequired', {
    //     fieldName: 'village',
    //   }),
    // },
  });

  const { field: fieldPostCode2 } = useController({
    name: 'postCode2',
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

  const { field: fieldMerchantLocation } = useController({
    name: 'merchantLocation',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'merchant location',
      }),
    },
  });

  const { field: fieldAnotherMerchantLocation } = useController({
    name: 'anotherMerchantLocation',
    control,
    rules: {
      validate: value => {
        if (fieldMerchantLocation?.value?.label === 'Other' && value === '') {
          return tForm('generalErrorRequired', {
            fieldName: 'merchant location',
          });
        }
      },
    },
  });

  const { field: fieldNPWP } = useController({
    name: 'npwp',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'npwp',
      }),
    },
  });

  const { field: fieldTipsType } = useController({
    name: 'tipsType',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'tips type',
      }),
    },
  });

  const { field: fieldTipsTypePercentage } = useController({
    name: 'tipsTypePercentage',
    control,
    rules: {
      validate: value => {
        if (
          fieldTipsType.value !== 'NO_TIPS' &&
          fieldTipsType.value !== 'STATIC' &&
          value === ''
        ) {
          return tForm('generalErrorRequired', {
            fieldName: 'tips type',
          });
        }
      },
    },
  });

  const { field: fieldSocialMedia } = useController({
    name: 'socialmedia',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'social media',
      }),
    },
  });

  const { field: fieldWebsite } = useController({
    name: 'website',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'website',
      }),
    },
  });

  const { field: fieldTerminalID } = useController({
    name: 'terminalId',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'terminal id',
      }),
    },
  });

  const { field: fieldEffectiveDate } = useController({
    name: 'effectiveDate',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'effective date',
      }),
    },
  });

  const tipsType = watch('tipsType');

  useEffect(() => {
    if (tipsType === 'PERCENTAGE') {
      setValue('tipsTypePercentage', '');
    }
  }, [tipsType]);

  const handleKeyPress = (event: any) => {
    if (!/^[a-zA-Z0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleKeyPercentagePress = (event: any) => {
    // Terima hanya angka dan titik
    if (!/^[0-9.]$/.test(event.key)) {
      event.preventDefault();
      return;
    }
    // Ambil nilai current + karakter baru yang akan diinput
    const currentValue = event.target.value;
    const newValue =
      currentValue.slice(0, event.target.selectionStart) +
      event.key +
      currentValue.slice(event.target.selectionEnd);
    // Cek jika ada lebih dari 1 titik
    if (event.key === '.' && currentValue.includes('.')) {
      event.preventDefault();
      return;
    }
    // Convert ke number untuk cek nilai
    const numberValue = parseFloat(newValue);
    // Prevent jika nilai lebih dari 100 atau invalid number
    if (isNaN(numberValue) || numberValue > 100) {
      event.preventDefault();
      return;
    }
  };

  useEffect(() => {
    if (merchantDetail) {
      fetchProvinceList('c727a474-0ffc-4497-9b2c-6c7f291895bc', true);
    }
  }, [merchantDetail]);

  useEffect(() => {
    if (merchantDetail) {
      if (merchantLocationOptions) {
        const selectMerchantLocation = merchantLocationOptions.find(
          el => el.label === merchantDetail.merchantLocation,
        );
        if (selectMerchantLocation) {
          setValue('merchantLocation', selectMerchantLocation);
        } else {
          setValue('merchantLocation', { label: merchantDetail.merchantLocation, value: '' });
        }
      }
    }
  }, [merchantLocationOptions]);

  useEffect(() => {
    if (merchantDetail) {
      if (merchantCriteriaOptions) {
        const selectMerchantCriteria = merchantCriteriaOptions.find(
          el => el.value === merchantDetail.merchantCriteriaSecureId,
        );
        if (selectMerchantCriteria) {
          setValue('merchantCriteria', selectMerchantCriteria);
        }
      }
    }
  }, [merchantCriteriaOptions]);

  useEffect(() => {
    if (merchantDetail) {
      if (merchantTypeOptions) {
        const selectMerchantType = merchantTypeOptions.find(
          el => el.label === merchantDetail.merchantType,
        );
        if (selectMerchantType) {
          setValue('merchantType2', selectMerchantType);
        }
      }
    }
  }, [merchantTypeOptions]);

  useEffect(() => {
    if (merchantDetail) {
      if (merchantCategoryOptions) {
        const selectMerchantCategory = merchantCategoryOptions.find(
          el => el.label === merchantDetail.merchantCategoryCodeName,
        );
        if (selectMerchantCategory) {
          setValue('merchantCategoryCode', selectMerchantCategory);
        }
      }
    }
  }, [merchantCategoryOptions]);

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
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formMerchantCompleteName')}
            </Typography>
            <TextField
              {...fieldMerchantCompleteName}
              error={Boolean(errors.merchantCompleteName)}
              helperText={errors.merchantCompleteName?.message}
              fullWidth
              inputProps={{ maxLength: 50 }}
              placeholder={tForm('placeholderType', {
                fieldName: 'merchant complete name',
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
              {tMerchant('formMerchantShortName')}
            </Typography>
            <TextField
              {...fieldMerchantShortName}
              error={Boolean(errors.merchantShortName)}
              helperText={errors.merchantShortName?.message}
              fullWidth
              inputProps={{ maxLength: 25 }}
              placeholder={tForm('placeholderType', {
                fieldName: 'merchant short name',
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
          <Grid item md={12} xs={12} hidden>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('detailIsQrisTag51')}
            </Typography>
            <FormControlLabel
              {...fieldIsQrisTag51}
              control={
                <Checkbox
                  checked={fieldIsQrisTag51.value}
                  onChange={fieldIsQrisTag51.onChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="Yes"
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom onDoubleClick={() => setDisable(!disable)}>
              {tMerchant('formQRType')}
            </Typography>
            <Autocomplete
              {...fieldQRType}
              onChange={(_, value) => fieldQRType.onChange(value)}
              options={qrTypeOptions}
              fullWidth
              getOptionLabel={option => option.label}
              disabled={Boolean(merchantDetail) && disable}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', {
                    fieldName: 'qr type',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.qrType)}
                  helperText={errors.qrType?.message}
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formMerchantType')}
            </Typography>
            <Autocomplete
              {...fieldMerchantType2}
              onChange={(_, value) => {
                fieldMerchantType2.onChange(value);
                if (value === null) {
                  setValue('merchantCriteria', null);
                } else {
                  fetchMerchantCriteriaList(value.value);
                }
              }}
              options={merchantTypeOptions}
              fullWidth
              getOptionLabel={option => option.label}
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
                  error={Boolean(errors.merchantType2)}
                  helperText={errors.merchantType2?.message}
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formMerchantCriteria')}
            </Typography>
            <Autocomplete
              {...fieldMerchantCriteria}
              onChange={(_, value) => {
                fieldMerchantCriteria.onChange(value);
                switch (value?.label) {
                  case 'Usaha Mikro (UMI)':
                    fieldMDRPercentage.onChange(0.3);
                    break;
                  case 'Usaha Kecil (UKE)':
                  case 'Usaha Menengah (UME)':
                  case 'Usaha Besar (UBE)':
                  case 'Usaha Reguler (URE)':
                    fieldMDRPercentage.onChange(0.7);
                    break;
                  case 'Layanan Pendidikan':
                    fieldMDRPercentage.onChange(0.6);
                    break;
                  case 'SPBU, BLU dan PSO':
                    fieldMDRPercentage.onChange(0.4);
                    break;
                  default:
                    fieldMDRPercentage.onChange(0);
                    break;
                }
              }}
              options={merchantCriteriaOptions}
              fullWidth
              disabled={watch('merchantType2') === null}
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={watch('merchantType2') === null ? 'Please select a merchant type first.' : tForm('placeholderSelect', {
                    fieldName: 'merchant criteria',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.merchantCriteria)}
                  helperText={errors.merchantCriteria?.message}
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
              options={merchantCategoryOptions}
              fullWidth
              getOptionLabel={option => option.label}
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
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formMDRPercentage')}
            </Typography>
            <TextField
              {...fieldMDRPercentage}
              error={Boolean(errors.mdrPercentage)}
              helperText={errors.mdrPercentage?.message}
              fullWidth
              disabled
              placeholder={tForm('placeholderType', {
                fieldName: 'mdr percentage',
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
              {tMerchant('formMonthlyGrossRevenue')}
            </Typography>
            <TextField
              {...fieldGrossRevenue}
              error={Boolean(errors.grossRevenue)}
              helperText={errors.grossRevenue?.message}
              fullWidth
              inputProps={{ maxLength: 30 }}
              onKeyPress={handleKeyPress}
              placeholder={tForm('placeholderType', {
                fieldName: 'gross revenue',
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
              {tMerchant('formComparisonOfTransaction')}
            </Typography>
            <Stack flexDirection="row" gap={4}>
              <TextField
                {...fieldComparisonOfTransactionFrom}
                error={Boolean(errors.comparisonOfTransactionFrom)}
                helperText={errors.comparisonOfTransactionFrom?.message}
                fullWidth
                inputProps={{ maxLength: 30 }}
                onKeyPress={handleKeyPress}
                placeholder={tForm('placeholderType', {
                  fieldName: 'comparison of transaction',
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
              <TextField
                {...fieldComparisonOfTransactionTo}
                error={Boolean(errors.comparisonOfTransactionTo)}
                helperText={errors.comparisonOfTransactionTo?.message}
                fullWidth
                inputProps={{ maxLength: 30 }}
                onKeyPress={handleKeyPress}
                placeholder={tForm('placeholderType', {
                  fieldName: 'comparison of transaction',
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formMerchantEmail')}
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
              {tMerchant('formIDNumberOrNIB')}
            </Typography>
            <TextField
              {...fieldNIKOrNIB}
              error={Boolean(errors.nikOrNIB)}
              helperText={errors.nikOrNIB?.message}
              fullWidth
              inputProps={{ maxLength: 13 }}
              onKeyPress={handleKeyPress}
              placeholder={tForm('placeholderType', {
                fieldName: 'id number / nib',
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
              {tMerchant('formDateOfMerchantRelease')}
            </Typography>
            <FormSingleDatePicker
              {...fieldDateOfMerchantRelease}
              placeholder={tForm('placeholderSelect', {
                fieldName: 'date of merchant release',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.dateOfMerchantRelease)}
              helperText={errors.dateOfMerchantRelease?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formNMID')}
            </Typography>
            <TextField
              {...fieldNMID}
              error={Boolean(errors.nmid)}
              helperText={errors.nmid?.message}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'nmid',
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
              {tMerchant('formAuthTokenURL')}
            </Typography>
            <TextField
              {...fieldAuthTokenUrl}
              error={Boolean(errors.authTokenUrl)}
              helperText={errors.authTokenUrl?.message}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'auth token url',
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
              {tMerchant('formSecretKey')}
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
              {tMerchant('formClientID')}
            </Typography>
            <TextField
              {...fieldClientId}
              error={Boolean(errors.clientId)}
              helperText={errors.clientId?.message}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'client id',
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
              {tMerchant('formTerminalID')}
            </Typography>
            <TextField
              {...fieldTerminalID}
              error={Boolean(errors.terminalId)}
              helperText={errors.terminalId?.message}
              fullWidth
              onKeyPress={handleKeyPress}
              placeholder={tForm('placeholderType', {
                fieldName: 'terminalId',
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
              {tMerchant('formMerchantAddressCorrespondence')}
            </Typography>
            <TextField
              {...fieldMerchantAddressCorrespondence}
              error={Boolean(errors.merchantAddressCorrespondence)}
              helperText={errors.merchantAddressCorrespondence?.message}
              fullWidth
              inputProps={{ maxLength: 50 }}
              placeholder={tForm('placeholderType', {
                fieldName: 'merchant address correspondence',
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
              {...fieldProvince2}
              onChange={(_, value) => {
                fieldProvince2.onChange(value);
                if (value) {
                  fetchCityList(value.value);
                }
                if (value && value !== fieldProvince2.value) {
                  setValue('city2', null);
                  setValue('district2', null);
                  setValue('village2', null);
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
                  error={Boolean(errors.province2)}
                  helperText={errors.province2?.message}
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formCity')}
            </Typography>
            <Autocomplete
              {...fieldCity2}
              onChange={(_, value) => {
                fieldCity2.onChange(value);
                if (value) {
                  fetchDistrictList(value.value);
                }
                if (value && value !== fieldCity2.value) {
                  setValue('district2', null);
                  setValue('village2', null);
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
                  error={Boolean(errors.city2)}
                  helperText={errors.city2?.message}
                />
              )}
            />
          </Grid>
          <Grid item md={12} xs={12} hidden>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formDistrict')}
            </Typography>
            <Autocomplete
              {...fieldDistrict2}
              onChange={(_, value) => {
                fieldDistrict2.onChange(value);
                if (value) {
                  fetchVillageList(value.value);
                }
                if (value && value !== fieldDistrict2.value) {
                  setValue('village2', null);
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
              {...fieldVillage2}
              onChange={(_, value) => {
                fieldVillage2.onChange(value);
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
              {...fieldPostCode2}
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
              error={Boolean(errors.postCode2)}
              helperText={errors.postCode2?.message}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formMerchantLocation')}
            </Typography>
            <Autocomplete
              {...fieldMerchantLocation}
              onChange={(_, value) => fieldMerchantLocation.onChange(value)}
              options={merchantLocationOptions}
              fullWidth
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', {
                    fieldName: 'merchant location',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.merchantLocation)}
                  helperText={errors.merchantLocation?.message}
                />
              )}
            />
          </Grid>
          {fieldMerchantLocation?.value?.label === 'Other' && (
            <Grid item md={12} xs={12}>
              <TextField
                {...fieldAnotherMerchantLocation}
                error={Boolean(errors.anotherMerchantLocation)}
                helperText={errors.anotherMerchantLocation?.message}
                fullWidth
                placeholder={tForm('placeholderType', {
                  fieldName: 'merchant location',
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
            </Grid>
          )}
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formTaxpayerIdentificationNumber')}
            </Typography>
            <TextField
              {...fieldNPWP}
              error={Boolean(errors.npwp)}
              helperText={errors.npwp?.message}
              fullWidth
              inputProps={{ maxLength: 30 }}
              onKeyPress={handleKeyPress}
              placeholder={tForm('placeholderType', {
                fieldName: 'taxpayer identification number',
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
              {tMerchant('formTipsType')}
            </Typography>
            <FormControl>
              <RadioGroup
                {...fieldTipsType}
                row
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
              >
                <FormControlLabel
                  value="NO_TIPS"
                  control={<Radio />}
                  label={tMerchant('labelNoTips')}
                />
                <FormControlLabel
                  value="STATIC"
                  control={<Radio />}
                  label={tMerchant('labelStatic')}
                  disabled
                />
                <FormControlLabel
                  value="FIXED"
                  control={<Radio />}
                  label={tMerchant('labelFix')}
                  disabled
                />
                <FormControlLabel
                  value="PERCENTAGE"
                  control={<Radio />}
                  label={tMerchant('labelPercentage')}
                  disabled
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          {fieldTipsType.value !== 'NO_TIPS' &&
            fieldTipsType.value !== 'STATIC' && (
              <Grid item md={12} xs={12}>
                <TextField
                  {...fieldTipsTypePercentage}
                  error={Boolean(errors.tipsTypePercentage)}
                  helperText={errors.tipsTypePercentage?.message}
                  fullWidth
                  inputProps={{ maxLength: 30 }}
                  onKeyPress={fieldTipsType.value === 'PERCENTAGE' ? handleKeyPercentagePress : handleKeyPress}
                  placeholder={tForm('placeholderType', {
                    fieldName: 'tips type',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>
            )}
          <Grid item md={12} xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {tMerchant('formSocialMedia')}
            </Typography>
            <TextField
              {...fieldSocialMedia}
              error={Boolean(errors.socialmedia)}
              helperText={errors.socialmedia?.message}
              fullWidth
              inputProps={{ maxLength: 30 }}
              placeholder={tForm('placeholderType', {
                fieldName: 'social media',
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
              {tMerchant('formWebsite')}
            </Typography>
            <TextField
              {...fieldWebsite}
              error={Boolean(errors.website)}
              helperText={errors.website?.message}
              fullWidth
              inputProps={{ maxLength: 100 }}
              placeholder={tForm('placeholderType', {
                fieldName: 'website',
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
            onClick={handleBack}
            sx={{ py: 1, px: 5, borderRadius: 2 }}
          >
            {tCommon('actionBack')}
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

export default MerchantData2;
