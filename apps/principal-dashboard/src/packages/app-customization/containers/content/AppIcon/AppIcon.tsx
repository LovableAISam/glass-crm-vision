import React, { useEffect } from 'react';

import { Stack, Typography, Card, Box, Grid, useTheme, TextField } from '@mui/material';
import { ImagePreview, Button } from '@woi/web-component';
import { AppCustomizationContentProps } from '../../AppCustomizationContent';
import useAppIcon from './hooks/useAppIcon';
import ImageUpload from '@src/shared/components/FormUpload/ImageUpload';
import { useController, useForm } from 'react-hook-form';
import { TextValidation } from '@woi/core';
import { useTranslation } from 'react-i18next';

function AppIcon(props: AppCustomizationContentProps) {
  const { activeStep, isDisabled, handleComplete, handleStep, handleCancel } = props;
  const { themeColor, appIcon, onUpload, onChangeImage, onChangeAppName } = useAppIcon(props);
  const { selectedFile, selectedImage, appName } = appIcon;
  const theme = useTheme();
  const { t: tCommon } = useTranslation('common');
  const { t: tAppCustomization } = useTranslation('appCustomization');
  const { t: tForm } = useTranslation('form');

  const { control, handleSubmit, formState: { errors }, getValues, setValue } = useForm({
    defaultValues: {
      appName,
    }
  });

  const { field: fieldAppName } = useController({
    name: 'appName',
    control,
    rules: {
      required: tForm('generalErrorRequired', { fieldName: 'App name' }),
      validate: value => {
        if (!TextValidation.maxChar(value, 16)) return tForm('generalErrorMaxChar', { number: 16 });
      }
    }
  });

  useEffect(() => {
    if (appName !== getValues('appName')) {
      setValue('appName', appName)
    }
  }, [appName])

  const renderAction = () => {
    if (isDisabled) {
      return (
        <Stack direction="row" justifyContent="center" spacing={2} sx={{ py: 5 }}>
          <Button
            color="primary"
            variant="outlined"
            sx={{ px: 8, py: 1, borderRadius: 2 }}
            disabled={activeStep <= 0}
            onClick={handleSubmit(() => handleStep(activeStep - 1))}
          >
            {tCommon('actionGoBack')}
          </Button>
          <Button
            color="primary"
            variant="contained"
            sx={{ px: 8, py: 1, borderRadius: 2 }}
            onClick={handleSubmit(() => handleStep(activeStep + 1))}
          >
            {tCommon('actionNext')}
          </Button>
        </Stack>
      )
    }

    return (
      <Stack direction="row" justifyContent="center" spacing={2} sx={{ py: 5 }}>
        <Button
          color="primary"
          variant="outlined"
          sx={{ px: 8, py: 1, borderRadius: 2 }}
          onClick={handleSubmit(() => handleCancel)}
        >
          {tCommon('actionGoBack')}
        </Button>
        <Button
          color="primary"
          variant="contained"
          sx={{ px: 8, py: 1, borderRadius: 2 }}
          onClick={handleSubmit(() => handleComplete(activeStep + 1))}
          disabled={!Boolean(selectedImage) || !Boolean(appName)}
        >
          {tCommon('actionSave')}
        </Button>
      </Stack>
    )
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>{tAppCustomization('appIconTitle')}</Typography>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Card elevation={0} sx={{ p: 1, pr: 2, borderRadius: 3, backgroundColor: theme.palette.secondary.main }}>
              <Typography variant="body2">
                <div dangerouslySetInnerHTML={{ __html: tAppCustomization('appIconInfo') }} />
              </Typography>
            </Card>
            <Stack direction="column" spacing={1}>
              <ImageUpload
                type="APP_CUSTOMIZATION"
                selectedFile={selectedFile}
                selectedImage={selectedImage}
                onChange={onUpload}
                onChangeImage={onChangeImage}
                acceptExt=".png"
              />
            </Stack>
            <Stack direction="column" spacing={1}>
              <Typography variant="subtitle2">{tAppCustomization('appIconFormAppName')}</Typography>
              <TextField
                {...fieldAppName}
                onChange={e => {
                  fieldAppName.onChange(e.target.value);
                  onChangeAppName(e.target.value);
                }}
                fullWidth
                type="search"
                placeholder={tForm('placeholderType', { fieldName: 'your app name' })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3
                  }
                }}
                error={Boolean(errors.appName)}
                helperText={errors.appName?.message}
              />
            </Stack>
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Card
            variant="outlined"
            sx={{ p: 3, borderRadius: 3 }}
          >
            <Stack direction="column" spacing={2} alignItems="center">
              <ImagePreview
                type="APP_ICON"
                selectedFile={selectedFile}
                selectedImage={selectedImage}
                background={themeColor}
                displayText={appName}
              />
              {/** @ts-ignore */}
              <Typography variant="subtitle3" textAlign="center">{tAppCustomization('appIconPreview')}</Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>
      {renderAction()}
    </Box>
  )
}

export default AppIcon;