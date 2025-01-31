// Core
import React from 'react';

// Component
import {
  Box,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Button } from '@woi/web-component';
import TabAction from '../../TabAction';

// Hooks & Utils
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

// Types & Consts
import { AccountBindingContentProps } from '../MerchantAccountBindingContent';

// Assets
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { TextValidation } from "@woi/core";

const SettlementInformation = (props: AccountBindingContentProps) => {
  const {
    formData,
    isLoading,
    handleSave,
    activeStep,
    doubleAuthorize,
    setDoubleAuthorize,
    completed,
    setActiveStep,
    validateForm,
    handleBack
  } = props;

  const { t: tCommon } = useTranslation('common');
  const { t: tMerchant } = useTranslation('merchant');
  const { t: tForm } = useTranslation('form');

  const {
    formState: { errors },
    control,
  } = formData;

  // const EmailValidation = require('emailvalid');
  // const ev = new EmailValidation({
  //   allowFreemail: true,
  //   blacklist: ['baddomain.com', 'yopmail.rrr'],
  // });

  const { field: fieldNameCooperationAgree } = useController({
    name: 'nameCooperationAgree',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'name of authorize official for cooperation agreement',
      }),
    },
  });

  const { field: fieldPosition } = useController({
    name: 'position',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'position',
      }),
    },
  });

  const { field: fieldNameCooperationAgree2 } = useController({
    name: 'nameCooperationAgree2',
    control,
    rules: !doubleAuthorize
      ? {}
      : {
        required: tForm('generalErrorRequired', {
          fieldName: 'name of authorize official for cooperation agreement',
        }),
      },
  });

  const { field: fieldPosition2 } = useController({
    name: 'position2',
    control,
    rules: !doubleAuthorize
      ? {}
      : {
        required: tForm('generalErrorRequired', {
          fieldName: 'position',
        }),
      },
  });

  const { field: fieldPICNameOfFinance } = useController({
    name: 'nameOfFinance',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'pic name of finance',
      }),
    },
  });

  const { field: fieldPICEmailOfFinance } = useController({
    name: 'emailOfFinance',
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

  const { field: fieldBankName } = useController({
    name: 'bankName',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'bank name / branch',
      }),
    },
  });

  const { field: fieldAccountNo } = useController({
    name: 'accountNo',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'account no',
      }),
    },
  });

  const { field: fieldAccountName } = useController({
    name: 'accountName',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'account name',
      }),
    },
  });

  const handleKeyPress = (event: any) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };

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
        ]} />

      <Stack direction="column" spacing={2}>
        <Stack gap={6} mt={4}>
          <Stack gap={3}>
            <Typography variant="h5">
              {tMerchant('detailCooperationAgreement')}
            </Typography>
            <Grid container spacing={2} sx={{ pt: 0 }}>
              <Grid item md={6} xs={6}>
                <Typography variant="subtitle2" gutterBottom>
                  {tMerchant('labelNameOfAuthorizedOfficial')}
                </Typography>
                <TextField
                  {...fieldNameCooperationAgree}
                  error={Boolean(errors.nameCooperationAgree)}
                  helperText={errors.nameCooperationAgree?.message}
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                  placeholder={tForm('placeholderType', {
                    fieldName:
                      'name of authorize official for cooperation agreement',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>
              <Grid item md={6} xs={6} gap={2}>
                <Typography variant="subtitle2" gutterBottom>
                  {tMerchant('labelPosition')}
                </Typography>
                <Stack
                  width="100%"
                  flexDirection="row"
                  alignItems="center"
                  gap={2}
                >
                  <TextField
                    {...fieldPosition}
                    error={Boolean(errors.position)}
                    helperText={errors.position?.message}
                    fullWidth
                    inputProps={{ maxLength: 50 }}
                    placeholder={tForm('placeholderType', {
                      fieldName: 'position',
                    })}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                  />
                  {!doubleAuthorize && (
                    <IconButton
                      aria-label="delete"
                      size="large"
                      sx={{ height: 'fit-content' }}
                      onClick={() => setDoubleAuthorize(true)}
                    >
                      <AddIcon />
                    </IconButton>
                  )}
                </Stack>
              </Grid>
              {doubleAuthorize && (
                <React.Fragment>
                  <Grid item md={6} xs={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      {tMerchant('labelNameOfAuthorizedOfficial')}
                    </Typography>
                    <TextField
                      {...fieldNameCooperationAgree2}
                      error={Boolean(errors.nameCooperationAgree2)}
                      helperText={errors.nameCooperationAgree2?.message}
                      fullWidth
                      inputProps={{ maxLength: 50 }}
                      placeholder={tForm('placeholderType', {
                        fieldName:
                          'name of authorize official for cooperation agreement',
                      })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item md={6} xs={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      {tMerchant('labelPosition')}
                    </Typography>
                    <Stack
                      width="100%"
                      flexDirection="row"
                      alignItems="center"
                      gap={2}
                    >
                      <TextField
                        {...fieldPosition2}
                        error={Boolean(errors.position2)}
                        helperText={errors.position2?.message}
                        fullWidth
                        inputProps={{ maxLength: 50 }}
                        placeholder={tForm('placeholderType', {
                          fieldName: 'position',
                        })}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                          },
                        }}
                      />
                      <IconButton
                        aria-label="delete"
                        size="large"
                        sx={{ height: 'fit-content' }}
                        onClick={() => setDoubleAuthorize(false)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Grid>
                </React.Fragment>
              )}
            </Grid>
          </Stack>

          <Stack gap={3}>
            <Typography variant="h5">
              {tMerchant('detailSettlementInformation')}
            </Typography>
            <Grid container spacing={2} sx={{ pt: 0 }}>
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  {tMerchant('labelPICNameOfFinance')}
                </Typography>
                <TextField
                  {...fieldPICNameOfFinance}
                  error={Boolean(errors.nameOfFinance)}
                  helperText={errors.nameOfFinance?.message}
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                  placeholder={tForm('placeholderType', {
                    fieldName: 'pic name of finance',
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
                  {tMerchant('labelPICEmailOfFinance')}
                </Typography>
                <TextField
                  {...fieldPICEmailOfFinance}
                  error={Boolean(errors.emailOfFinance)}
                  helperText={errors.emailOfFinance?.message}
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                  placeholder={tForm('placeholderType', {
                    fieldName: 'pic email of finance',
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
                  {tMerchant('labelBankNameBranch')}
                </Typography>
                <TextField
                  {...fieldBankName}
                  error={Boolean(errors.bankName)}
                  helperText={errors.bankName?.message}
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                  placeholder={tForm('placeholderType', {
                    fieldName: 'bank name / branch',
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
                  {tMerchant('labelAccountNo')}
                </Typography>
                <TextField
                  {...fieldAccountNo}
                  error={Boolean(errors.accountNo)}
                  helperText={errors.accountNo?.message}
                  fullWidth
                  inputProps={{ maxLength: 20 }}
                  onKeyPress={handleKeyPress}
                  placeholder={tForm('placeholderType', {
                    fieldName: 'account no',
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
                  {tMerchant('labelAccountName')}
                </Typography>
                <TextField
                  {...fieldAccountName}
                  error={Boolean(errors.accountName)}
                  helperText={errors.accountName?.message}
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                  placeholder={tForm('placeholderType', {
                    fieldName: 'account name',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Stack>
        </Stack>

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
            {tCommon('actionSave')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SettlementInformation;
