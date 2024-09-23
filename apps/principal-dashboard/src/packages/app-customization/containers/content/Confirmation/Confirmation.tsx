import React from 'react';

import { Stack, Typography, Card, Box, Grid, useTheme } from '@mui/material';
import { Markdown, ImagePreview, Button, useConfirmationDialog } from '@woi/web-component';
import { AppCustomizationContentProps } from '../../AppCustomizationContent';
import EditIcon from '@mui/icons-material/Edit';

import { useAppCustomization } from '@src/packages/app-customization/context/AppCustomizationContext';
import useCreateAction from '../../../hooks/useCreateAction';
import { useTranslation } from 'react-i18next';

function Confirmation(props: AppCustomizationContentProps) {
  const { activeStep, isDisabled, handleStep } = props;
  const [{ themeColor, splashScreen, appIcon, onBoardingScreens }] = useAppCustomization();
  const theme = useTheme();
  const { onSubmit } = useCreateAction(props);
  const { getConfirmation } = useConfirmationDialog();
  const { t: tCommon } = useTranslation('common');
  const { t: tAppCustomization } = useTranslation('appCustomization');

  const onSubmitAppCustomization = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationSubmitTitle', { text: 'App Customization' }),
      message: tCommon('confirmationSubmitDescription', { text: 'App Customization' }),
      primaryText: tCommon('confirmationSubmitYes'),
      secondaryText: tCommon('confirmationSubmitNo'),
    });

    if (confirmed) {
      onSubmit();
    }
  }

  const renderAction = () => {
    if (isDisabled) {
      return (
        <Stack direction="row" justifyContent="center" spacing={2} sx={{ py: 5 }}>
          <Button
            color="primary"
            variant="outlined"
            sx={{ px: 8, py: 1, borderRadius: 2 }}
            disabled={activeStep <= 0}
            onClick={() => handleStep(activeStep - 1)}
          >
            {tCommon('actionGoBack')}
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
          disabled={activeStep <= 0}
          onClick={() => handleStep(activeStep - 1)}
        >
          {tCommon('actionGoBack')}
        </Button>
        <Button
          color="primary"
          variant="contained"
          sx={{ px: 8, py: 1, borderRadius: 2 }}
          onClick={onSubmitAppCustomization}
        >
          {tCommon('actionConfirmAll')}
        </Button>
      </Stack>
    )
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>{tAppCustomization('confirmationTitle')}</Typography>
      <Card elevation={0} sx={{ p: 1, pr: 2, borderRadius: 3, backgroundColor: theme.palette.secondary.main, mb: 2 }}>
        <Typography variant="body2">
          <div dangerouslySetInnerHTML={{ __html: tAppCustomization('confirmationInfo') }} />
        </Typography>
      </Card>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item md={12} xs={12}>
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h5">
                {tAppCustomization('appIconTitle')}
              </Typography>
              <Button
                variant="text"
                color="primary"
                sx={{ textTransform: 'none' }}
                startIcon={<EditIcon />}
                size="large"
                onClick={() => handleStep(0)}
              >
                {tCommon('actionEdit')}
              </Button>
            </Stack>
            <Grid container spacing={2} sx={{ pt: 2 }}>
              <Grid item md={2.2}>
                <Stack direction="column" spacing={2} alignItems="center">
                  <ImagePreview
                    type="APP_ICON"
                    selectedFile={appIcon.selectedFile}
                    selectedImage={appIcon.selectedImage}
                    background={themeColor}
                    displayText={appIcon.appName}
                  />
                  {/** @ts-ignore */}
                  <Typography variant="subtitle3" textAlign="center">{tAppCustomization('appIconTitle')}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item md={12} xs={12}>
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h5">
                {tAppCustomization('colorThemeFormHexColor')} <Typography variant="inherit" component='span' sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{themeColor}</Typography>
              </Typography>
              <Button
                variant="text"
                color="primary"
                // @ts-ignore
                sx={{ textTransform: 'none' }}
                startIcon={<EditIcon />}
                size="large"
                onClick={() => handleStep(1)}
              >
                {tCommon('actionEdit')}
              </Button>
            </Stack>
          </Card>
        </Grid>
        <Grid item md={12} xs={12}>
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h5">
                {tAppCustomization('splashScreenTitle')}
              </Typography>
              <Button
                variant="text"
                color="primary"
                sx={{ textTransform: 'none' }}
                startIcon={<EditIcon />}
                size="large"
                onClick={() => handleStep(2)}
              >
                {tCommon('actionEdit')}
              </Button>
            </Stack>
            <Grid container spacing={2} sx={{ pt: 2 }}>
              <Grid item md={2.2}>
                <Stack direction="column" spacing={2} alignItems="center">
                  <ImagePreview
                    selectedFile={splashScreen.selectedFile}
                    selectedImage={splashScreen.selectedImage}
                    background={themeColor}
                  />
                  {/** @ts-ignore */}
                  <Typography variant="subtitle3" textAlign="center">{tAppCustomization('splashScreenPreview')}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item md={12} xs={12}>
          <Card variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h5">
                {tAppCustomization('onboardingTitle')}
              </Typography>
              <Button
                variant="text"
                color="primary"
                sx={{ textTransform: 'none' }}
                startIcon={<EditIcon />}
                size="large"
                onClick={() => handleStep(3)}
              >
                {tCommon('actionEdit')}
              </Button>
            </Stack>
            <Grid container spacing={2} sx={{ pt: 2 }}>
              {onBoardingScreens.map((onBoardingScreen, index) => (
                <Grid item md={2.2}>
                  <Stack direction="column" spacing={2} alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                    <ImagePreview
                      selectedImage={onBoardingScreen.selectedImage}
                      selectedFile={onBoardingScreen.selectedFile}
                      background={themeColor}
                      type={'ONBOARD'}
                      displayText={(
                        <Stack direction="column" sx={{ height: '100%', background: '#fff', p: 1 }}>
                          <Stack
                            direction="column"
                            sx={{
                              flexGrow: 1,
                              mt: onBoardingScreen.selectedFile ? -3 : 0,
                              zIndex: 2
                            }}
                            spacing={0.5}
                          >
                            <Markdown
                              typographyProps={{
                                variant: 'subtitle2',
                                sx: {
                                  lineHeight: 1.4,
                                  fontSize: 10,
                                  display: '-webkit-box',
                                  overflow: 'hidden',
                                  WebkitBoxOrient: 'vertical',
                                  WebkitLineClamp: 2,
                                }
                              }}
                            >
                              {onBoardingScreen.title}
                            </Markdown>
                            <Markdown
                              typographyProps={{
                                variant: 'caption',
                                sx: {
                                  lineHeight: 1.4,
                                  fontSize: 8,
                                  display: '-webkit-box',
                                  overflow: 'hidden',
                                  WebkitBoxOrient: 'vertical',
                                  WebkitLineClamp: 2,
                                }
                              }}
                            >
                              {onBoardingScreen.description}
                            </Markdown>
                          </Stack>
                          {onBoardingScreen.selectedFile ? null : (
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="caption" sx={{ fontSize: 8 }} color={themeColor}>{tAppCustomization('onboardingPlaceholderSkipButton')}</Typography>
                              <Card variant="outlined" sx={{ borderWidth: 1, borderColor: themeColor, px: 1, pb: 0.5, borderRadius: 3 }}>
                                <Typography variant="caption" color={themeColor} sx={{ fontSize: 8 }}>{tAppCustomization('onboardingPlaceholderNextButton')}</Typography>
                              </Card>
                            </Stack>
                          )}
                        </Stack>
                      )}
                    />
                    {/** @ts-ignore */}
                    <Typography variant="subtitle3" textAlign="center">{tAppCustomization('onboardingPreview', { number: index + 1 })}</Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>
      {renderAction()}
    </Box>
  )
}

export default Confirmation;