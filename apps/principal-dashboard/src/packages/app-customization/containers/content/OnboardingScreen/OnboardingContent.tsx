import React from 'react';

import { Stack, Typography, Card, Grid, Divider, useTheme } from '@mui/material';
import { ImagePreview, FormEditor, Markdown } from '@woi/web-component';
import ImageUpload from '@src/shared/components/FormUpload/ImageUpload';

import { ModelAppCustomizationOnboarding, useAppCustomization } from '@src/packages/app-customization/context/AppCustomizationContext';
import { useTranslation } from 'react-i18next';

type OnboardingContentProps = {
  index: number;
  onBoardingScreen: ModelAppCustomizationOnboarding;
}

function OnboardingContent(props: OnboardingContentProps) {
  const { index, onBoardingScreen } = props;
  const [{ themeColor }, dispatch] = useAppCustomization();
  const theme = useTheme();
  const { t: tAppCustomization } = useTranslation('appCustomization');

  return (
    <React.Fragment>
      {index > 0 && <Divider sx={{ my: 4, color: theme.palette.secondary.main }} />}
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Stack direction="column" spacing={2}>
            <Typography variant="h5">{tAppCustomization('onboardingScreen', { number: index + 1 })}</Typography>
            <ImageUpload
              type="APP_CUSTOMIZATION"
              selectedImage={onBoardingScreen.selectedImage}
              selectedFile={onBoardingScreen.selectedFile}
              onChange={(file) => {
                dispatch({
                  type: 'UPDATE_ONBOARDING_SCREEN',
                  payload: {
                    index,
                    onBoardingScreen: {
                      selectedFile: file,
                    },
                  }
                })
              }}
              onChangeImage={(file) => dispatch({
                type: 'UPDATE_ONBOARDING_SCREEN',
                payload: {
                  index,
                  onBoardingScreen: {
                    selectedImage: file,
                  },
                }
              })}
            />
            <Typography variant="body1">{tAppCustomization('onboardingText')}</Typography>
            <Stack direction="column" spacing={2}>
              <Typography variant="body2">{tAppCustomization('onboardingFormHeadline')}</Typography>
              <FormEditor
                value={onBoardingScreen.title}
                onChange={(value) => {
                  dispatch({
                    type: 'UPDATE_ONBOARDING_SCREEN',
                    payload: {
                      index,
                      onBoardingScreen: {
                        title: value
                      }
                    }
                  })
                }}
              />
            </Stack>
            <Stack direction="column" spacing={2}>
              <Typography variant="body2">{tAppCustomization('onboardingFormDescription')}</Typography>
              <FormEditor
                value={onBoardingScreen.description}
                onChange={(value) => {
                  dispatch({
                    type: 'UPDATE_ONBOARDING_SCREEN',
                    payload: {
                      index,
                      onBoardingScreen: {
                        description: value
                      }
                    }
                  })
                }}
              />
            </Stack>
          </Stack>
        </Grid>
        <Grid item md={6} xs={12}>
          <Card
            variant="outlined"
            sx={{ p: 3, borderRadius: 3, height: '100%' }}
          >
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
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

export default OnboardingContent;