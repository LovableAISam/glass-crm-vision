import React, { useEffect, useState } from 'react';
import {
  Grid,
  Stack,
  TextField,
  Typography,
  Box,
  Autocomplete,
  Button,
} from '@mui/material';

import {
  FormColor,
  PasswordInput,
  useConfirmationDialog,
} from '@woi/web-component';
import { useController, useFormContext } from 'react-hook-form';
import { CommunityOwnerData } from '@woi/communityOwner';
import {
  useCommunityOwnerCreateFetcher,
  useCommunityOwnerUpdateFetcher,
  useSMTPListFetcher,
} from '@woi/service/principal';
import { OptionMap } from '@woi/option';
import { SMTPData } from '@woi/service/principal/admin/smtp/smtpList';
import useSCPListFetcher, {
  SCPData,
} from '@woi/service/principal/admin/scp/scpList';
import { CreateCOModalContentProps } from './CreateCOModalContent';
import { useSnackbar } from 'notistack';
import { stringToDateFormat } from '@woi/core/utils/date/dateConvert';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import { CommunityOwnerCreateRequest } from '@woi/service/principal/admin/communityOwner/communityOwnerCreate';
import AuthorizeView from '@src/shared/components/AuthorizeView/AuthorizeView';
import TabAction from './TabAction';
import { TextGetter } from '@woi/core';
import { useTranslation } from 'react-i18next';

function Configuration(props: CreateCOModalContentProps) {
  const { selectedData, handleCancel, handleHide, handleReloadList } = props;
  const isUpdate = Boolean(selectedData);
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    handleSubmit,
  } = useFormContext<CommunityOwnerData>();
  const [smtpOptions, setSmtpOptions] = useState<OptionMap<string>[]>([]);
  const [smtpData, setSmtpData] = useState<SMTPData[]>([]);
  const [scpOptions, setScpOptions] = useState<OptionMap<string>[]>([]);
  const [scpData, setScpData] = useState<SCPData[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { getConfirmation } = useConfirmationDialog();
  const { baseUrl } = useBaseUrl();
  const { t: tCommon } = useTranslation('common');
  const { t: tCO } = useTranslation('co');
  const { t: tForm } = useTranslation('form');

  const handleSubmitForm = handleSubmit(async form => {
    const payload: CommunityOwnerCreateRequest = {
      addresses: form.addresses.map(data => ({
        address: data.address,
        cityId: TextGetter.getterString(data.cityId?.value),
        countryId: TextGetter.getterString(data.countryId?.value),
        postalCode: data.postalCode,
        provinceId: TextGetter.getterString(data.provinceId?.value),
      })),
      authenticationOtp: form.authenticationOtp,
      backgroundCard: TextGetter.getterString(form.backgroundCard?.docPath),
      bankAccounts: form.bankAccounts.map(data => ({
        bankId: TextGetter.getterString(data.bankId?.value),
        bin: data.bin,
        currencyId: TextGetter.getterString(data.currencyId?.value),
        fundType: TextGetter.getterString(data.fundType?.value),
        name: data.name,
        number: data.number,
        vaLength: data.vaLength,
      })),
      bankLogo: TextGetter.getterString(form.bankLogo?.docPath),
      cardable: form.cardable,
      code: form.code,
      configuration: {
        billerInquiryUrl: form.configuration.billerInquiryUrl,
        billerInquiryProductUrl: form.configuration.billerInquiryProductUrl,
        billerPaymentUrl: form.configuration.billerPaymentUrl,
        billerSourceId: form.configuration.billerSourceId,
        billerSourcePassword: form.configuration.billerSourcePassword,
        billerSourceUser: form.configuration.billerSourceUser,
        color: form.configuration.color,
        scp: {
          id: TextGetter.getterString(form.configuration.scp.id?.value),
          merchantId: form.configuration.scp.merchantId,
          name: form.configuration.scp.name,
          secretKey: form.configuration.scp.secretKey,
          userCredential: form.configuration.scp.userCredential,
        },
        smtp: {
          id: TextGetter.getterString(form.configuration.smtp.id?.value),
          name: form.configuration.smtp.name,
          password: form.configuration.smtp.password,
          port: form.configuration.smtp.port,
          server: form.configuration.smtp.server,
          startTls: form.configuration.smtp.startTls,
          username: form.configuration.smtp.username,
        },
      },
      contacts: form.contacts.map(data => ({
        number: data.number,
        type: TextGetter.getterString(data.type?.value),
      })),
      email: form.email,
      activeDate: stringToDateFormat(form.activeDate),
      inactiveDate: stringToDateFormat(form.inactiveDate),
      loyaltyMerchantCode: form.loyaltyMerchantCode,
      loyaltyMerchantId: form.loyaltyMerchantId,
      loyaltySupport: form.loyaltySupport,
      name: form.name,
      registrationNeedOtp: form.registrationNeedOtp,
      siupNo: form.siupNo,
      usersOTP: form.usersOTP,
      usersPIC: form.usersPIC.map(data => ({
        id: data.id,
        isLocked: data.isLocked,
        activeDate: stringToDateFormat(data.activeDate),
        inactiveDate: stringToDateFormat(data.inactiveDate),
        password: data.password,
        username: data.username,
        role: TextGetter.getterString(data.role?.value),
      })),
    };

    if (isUpdate) {
      const confirmed = await getConfirmation({
        title: tCommon('confirmationUpdateTitle', { text: 'Community Owner' }),
        message: tCommon('confirmationUpdateDescription', {
          text: 'community owner',
        }),
        primaryText: tCommon('confirmationUpdateYes'),
        secondaryText: tCommon('confirmationUpdateNo'),
      });
      if (confirmed) {
        handleUpdate(payload);
      }
    } else {
      const confirmed = await getConfirmation({
        title: tCommon('confirmationCreateTitle', { text: 'Community Owner' }),
        message: tCommon('confirmationCreateDescription', {
          text: 'community owner',
        }),
        primaryText: tCommon('confirmationCreateYes'),
        secondaryText: tCommon('confirmationCreateNo'),
      });
      if (confirmed) {
        handleCreate(payload);
      }
    }
  });

  const handleCreate = async (payload: CommunityOwnerCreateRequest) => {
    const { error, errorData } = await useCommunityOwnerCreateFetcher(
      `${baseUrl}`,
      payload,
    );
    if (!error) {
      enqueueSnackbar(tCO('submitConfirmationCreateSuccess'), {
        variant: 'success',
      });
      handleHide();
      handleReloadList();
    } else {
      enqueueSnackbar(
        errorData?.details?.[0] || tCO('submitConfirmationCreateFailed'),
        { variant: 'error' },
      );
    }
  };

  const handleUpdate = async (payload: CommunityOwnerCreateRequest) => {
    const { error, errorData } = await useCommunityOwnerUpdateFetcher(
      `${baseUrl}`,
      selectedData!.id,
      payload,
    );
    if (!error) {
      enqueueSnackbar(tCO('submitConfirmationUpdateSuccess'), {
        variant: 'success',
      });
      handleHide();
      handleReloadList();
    } else {
      enqueueSnackbar(
        errorData?.details?.[0] || tCO('submitConfirmationUpdateFailed'),
        { variant: 'error' },
      );
    }
  };

  const validateForm = (callback: () => void) => {
    handleSubmit(() => {
      callback();
    })();
  };

  const { field: fieldColor } = useController({
    name: 'configuration.color',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'Color' }),
    },
  });

  const { field: fieldSMTP } = useController({
    name: 'configuration.smtp.id',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'SMTP id' }),
    },
  });

  const { field: fieldSMTPUsername } = useController({
    name: 'configuration.smtp.username',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'SMTP username' }),
    },
  });

  const { field: fieldSMTPPassword } = useController({
    name: 'configuration.smtp.password',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'SMTP password' }),
    },
  });

  const { field: fieldSMTPPasswordConfirm } = useController({
    name: 'configuration.smtp.passwordConfirm',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'SMTP password confirm',
      }),
      validate: value => {
        if (value !== getValues('configuration.smtp.password'))
          return tForm('generalErrorMissMatching', {
            fieldName: 'SMTP password',
          });
        return undefined;
      },
    },
  });

  const { field: fieldSMTPPort } = useController({
    name: 'configuration.smtp.port',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'SMTP port' }),
    },
  });

  const { field: fieldSMTPServer } = useController({
    name: 'configuration.smtp.server',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'SMTP server' }),
    },
  });

  const { field: fieldSMTPStartTLS } = useController({
    name: 'configuration.smtp.startTls',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'SMTP start' }),
    },
  });

  const { field: fieldSCP } = useController({
    name: 'configuration.scp.id',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'SCP id' }),
    },
  });

  const { field: fieldSCPMerchantId } = useController({
    name: 'configuration.scp.merchantId',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'SCP merchant id' }),
    },
  });

  const { field: fieldSCPSecretKey } = useController({
    name: 'configuration.scp.secretKey',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'SCP secret key' }),
    },
  });

  const { field: fieldSCPUserCredential } = useController({
    name: 'configuration.scp.userCredential',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'SCP user credential',
      }),
    },
  });

  const { field: fieldBillerInquiryUrl } = useController({
    name: 'configuration.billerInquiryUrl',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'Biller inquiry url',
      }),
    },
  });

  const { field: fieldBillerInquiryProductUrl } = useController({
    name: 'configuration.billerInquiryProductUrl',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'Biller inquiry product url',
      }),
    },
  });

  const { field: fieldBillerPaymentUrl } = useController({
    name: 'configuration.billerPaymentUrl',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'Biller payment url',
      }),
    },
  });

  const { field: fieldBillerSourceId } = useController({
    name: 'configuration.billerSourceId',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'Biller source id',
      }),
    },
  });

  const { field: fieldBillerSourcePassword } = useController({
    name: 'configuration.billerSourcePassword',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'Biller source password',
      }),
    },
  });

  const { field: fieldBillerSourcePasswordConfirm } = useController({
    name: 'configuration.billerSourcePasswordConfirm',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'Biller source password confirm',
      }),
      validate: value => {
        if (value !== getValues('configuration.billerSourcePassword'))
          return tForm('generalErrorMissMatching', {
            fieldName: 'Biller source password',
          });
        return undefined;
      },
    },
  });

  const { field: fieldBillerSourceUser } = useController({
    name: 'configuration.billerSourceUser',
    control,
    rules: {
      required: tForm('generalErrorRequired', {
        fieldName: 'Biller source user',
      }),
    },
  });

  const fetchSMTPList = async () => {
    const { result, error } = await useSMTPListFetcher(baseUrl, {
      page: 0,
      limit: 1000,
    });

    if (result && !error) {
      setSmtpData(result.data);
      setSmtpOptions(
        result.data.map(data => ({
          label: data.name,
          value: data.id,
        })),
      );
    }
  };

  const fetchSCPList = async () => {
    const { result, error } = await useSCPListFetcher(baseUrl, {
      page: 0,
      limit: 1000,
    });

    if (result && !error) {
      setScpData(result.data);
      setScpOptions(
        result.data.map(data => ({
          label: data.name,
          value: data.id,
        })),
      );
    }
  };

  useEffect(() => {
    fetchSMTPList();
    fetchSCPList();
  }, []);

  return (
    <Box>
      <TabAction {...props} validateForm={validateForm} />
      <Typography variant="h5" sx={{ mb: 2 }}>
        {tCO('tabActionConfiguration')}
      </Typography>
      <Grid container spacing={2} sx={{ pt: 1 }}>
        <Grid item md={12} xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            {tCO('configurationFormHexColor')}
          </Typography>
          <FormColor
            {...fieldColor}
            fullWidth
            placeholder={tForm('placeholderSelect', {
              fieldName: 'your hex color',
            })}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
            error={Boolean(errors.configuration?.color)}
            helperText={errors.configuration?.color?.message}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <Typography variant="subtitle1" sx={{ my: 2 }}>
            {tCO('configurationSMTPInformation')}
          </Typography>
        </Grid>
        <Grid item md={12} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('configurationFormSMTPData')}
            </Typography>
            <Autocomplete
              {...fieldSMTP}
              onChange={(_, value) => {
                fieldSMTP.onChange(value);
                const selectedSMTP = smtpData.find(
                  data => data.id === value?.value,
                );
                if (selectedSMTP) {
                  setValue('configuration.smtp.name', selectedSMTP.name);
                  setValue(
                    'configuration.smtp.username',
                    selectedSMTP.username,
                  );
                  setValue(
                    'configuration.smtp.password',
                    selectedSMTP.password,
                  );
                  setValue(
                    'configuration.smtp.passwordConfirm',
                    selectedSMTP.password,
                  );
                  setValue('configuration.smtp.port', selectedSMTP.port);
                  setValue('configuration.smtp.server', selectedSMTP.server);
                  setValue(
                    'configuration.smtp.startTls',
                    selectedSMTP.startTls,
                  );
                }
              }}
              options={smtpOptions}
              fullWidth
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderType', {
                    fieldName: 'smtp data',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.configuration?.smtp?.id)}
                  helperText={errors.configuration?.smtp?.id?.message}
                />
              )}
            />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('configurationFormSMTP')}
            </Typography>
            <TextField
              {...fieldSMTPServer}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'smtp' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.configuration?.smtp?.server)}
              helperText={errors.configuration?.smtp?.server?.message}
            />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('configurationFormSMTPUsername')}
            </Typography>
            <TextField
              {...fieldSMTPUsername}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'smtp username',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.configuration?.smtp?.username)}
              helperText={errors.configuration?.smtp?.username?.message}
            />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('configurationFormSMTPPassword')}
            </Typography>
            <PasswordInput
              {...fieldSMTPPassword}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'smtp password',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.configuration?.smtp?.password)}
              helperText={errors.configuration?.smtp?.password?.message}
            />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('configurationFormConfirmSMTPPassword')}
            </Typography>
            <PasswordInput
              {...fieldSMTPPasswordConfirm}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'confirm smtp password',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.configuration?.smtp?.passwordConfirm)}
              helperText={errors.configuration?.smtp?.passwordConfirm?.message}
            />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('configurationFormSMTPPort')}
            </Typography>
            <TextField
              {...fieldSMTPPort}
              fullWidth
              placeholder={tForm('placeholderType', { fieldName: 'smtp port' })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.configuration?.smtp?.port)}
              helperText={errors.configuration?.smtp?.port?.message}
            />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('configurationFormStartTTLS')}
            </Typography>
            <TextField
              {...fieldSMTPStartTLS}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'start ttls',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.configuration?.smtp?.startTls)}
              helperText={errors.configuration?.smtp?.startTls?.message}
            />
          </Stack>
        </Grid>
        <Grid item md={12} xs={12}>
          <Typography variant="subtitle1" sx={{ my: 2 }}>
            {tCO('configurationSCPInformation')}
          </Typography>
        </Grid>
        <Grid item md={12} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('configurationFormSCPData')}
            </Typography>
            <Autocomplete
              {...fieldSCP}
              onChange={(_, value) => {
                fieldSCP.onChange(value);
                const selectedSCP = scpData.find(
                  data => data.id === value?.value,
                );
                if (selectedSCP) {
                  setValue(
                    'configuration.scp.merchantId',
                    selectedSCP.merchantId,
                  );
                  setValue('configuration.scp.name', selectedSCP.name);
                  setValue(
                    'configuration.scp.secretKey',
                    selectedSCP.secretKey,
                  );
                  setValue(
                    'configuration.scp.userCredential',
                    selectedSCP.userCredential,
                  );
                }
              }}
              options={scpOptions}
              fullWidth
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder={tForm('placeholderSelect', {
                    fieldName: 'scp data',
                  })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                  error={Boolean(errors.configuration?.scp?.id)}
                  helperText={errors.configuration?.scp?.id?.message}
                />
              )}
            />
          </Stack>
        </Grid>
        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('configurationFormSCPUserCredential')}
            </Typography>
            <TextField
              {...fieldSCPUserCredential}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'scp user credential',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.configuration?.scp?.userCredential)}
              helperText={errors.configuration?.scp?.userCredential?.message}
            />
          </Stack>
        </Grid>
        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('configurationFormSCPSecretKey')}
            </Typography>
            <TextField
              {...fieldSCPSecretKey}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'scp secret key',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.configuration?.scp?.secretKey)}
              helperText={errors.configuration?.scp?.secretKey?.message}
            />
          </Stack>
        </Grid>
        <Grid item md={4} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('configurationFormSCPMerchantId')}
            </Typography>
            <TextField
              {...fieldSCPMerchantId}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'scp merchant id',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.configuration?.scp?.merchantId)}
              helperText={errors.configuration?.scp?.merchantId?.message}
            />
          </Stack>
        </Grid>
        <Grid item md={12} xs={12}>
          <Typography variant="subtitle1" sx={{ my: 2 }}>
            {tCO('configurationBillerInformation')}
          </Typography>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('configurationFormBillerSourceID')}
            </Typography>
            <TextField
              {...fieldBillerSourceId}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'biller source id',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.configuration?.billerSourceId)}
              helperText={errors.configuration?.billerSourceId?.message}
            />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('configurationFormBillerSourceUser')}
            </Typography>
            <TextField
              {...fieldBillerSourceUser}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'biller source user',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.configuration?.billerSourceUser)}
              helperText={errors.configuration?.billerSourceUser?.message}
            />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('configurationFormBillerSourcePassword')}
            </Typography>
            <PasswordInput
              {...fieldBillerSourcePassword}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'biller source password',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.configuration?.billerSourcePassword)}
              helperText={errors.configuration?.billerSourcePassword?.message}
            />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('configurationFormConfirmBillerSourcePassword')}
            </Typography>
            <PasswordInput
              {...fieldBillerSourcePasswordConfirm}
              placeholder={tForm('placeholderType', {
                fieldName: 'confirm biller source password',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.configuration?.billerSourcePasswordConfirm)}
              helperText={
                errors.configuration?.billerSourcePasswordConfirm?.message
              }
            />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('configurationFormBillerInquiryURL')}
            </Typography>
            <TextField
              {...fieldBillerInquiryUrl}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'biller inquiry url',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.configuration?.billerInquiryUrl)}
              helperText={errors.configuration?.billerInquiryUrl?.message}
            />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('configurationFormBillerPaymentURL')}
            </Typography>
            <TextField
              {...fieldBillerPaymentUrl}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'biller payment url',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.configuration?.billerPaymentUrl)}
              helperText={errors.configuration?.billerPaymentUrl?.message}
            />
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">
              {tCO('configurationFormBillerInquiryProductURL')}
            </Typography>
            <TextField
              {...fieldBillerInquiryProductUrl}
              fullWidth
              placeholder={tForm('placeholderType', {
                fieldName: 'biller inquiry url',
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
              error={Boolean(errors.configuration?.billerInquiryProductUrl)}
              helperText={
                errors.configuration?.billerInquiryProductUrl?.message
              }
            />
          </Stack>
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
            {tCommon('actionSubmit')}
          </Button>
        </Stack>
      </AuthorizeView>
    </Box>
  );
}

export default Configuration;
