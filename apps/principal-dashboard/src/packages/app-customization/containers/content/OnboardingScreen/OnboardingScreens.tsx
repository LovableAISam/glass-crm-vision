import React, { useEffect, useState } from 'react';

import { Stack, Typography, Card, Box, Grid, TextField, Autocomplete, useTheme } from '@mui/material';
import { Button } from '@woi/web-component';
import { AppCustomizationContentProps } from '../../AppCustomizationContent';
import { OptionMap } from '@woi/option';
import OnboardingContent from './OnboardingContent';

import { useAppCustomization } from '@src/packages/app-customization/context/AppCustomizationContext';
import { useTranslation } from 'react-i18next';

function OnboardingScreens(props: AppCustomizationContentProps) {
  const { activeStep, isDisabled, handleComplete, handleStep } = props;
  const [{ numberOfOnboarding, onBoardingScreens }, dispatch] = useAppCustomization();
  const [screens] = useState<OptionMap<number>[]>([
    { label: '2 Onboarding Screens', value: 2 },
    { label: '3 Onboarding Screens', value: 3 },
    { label: '4 Onboarding Screens', value: 4 },
  ]);
  const theme = useTheme();
  const { t: tCommon } = useTranslation('common');
  const { t: tAppCustomization } = useTranslation('appCustomization');
  const { t: tForm } = useTranslation('form');

  useEffect(() => {
    if (onBoardingScreens.length === 0) {
      dispatch({
        type: 'SET_NUMBER_OF_ONBOARDING',
        payload: {
          numberOfOnboarding: screens[0]
        }
      })
    }
  }, [onBoardingScreens])

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
          <Button 
            color="primary" 
            variant="contained" 
            sx={{ px: 8, py: 1, borderRadius: 2 }} 
            onClick={() => handleStep(activeStep + 1)}
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
          disabled={activeStep <= 0} 
          onClick={() => handleStep(activeStep - 1)}
        >
          {tCommon('actionGoBack')}
        </Button>
        <Button 
          color="primary" 
          variant="contained" 
          sx={{ px: 8, py: 1, borderRadius: 2 }} 
          onClick={() => handleComplete(activeStep + 1)}
          disabled={!(
            onBoardingScreens.length > 0 && 
            onBoardingScreens.every(onBoardingScreen => 
              Boolean(onBoardingScreen.title) && 
              Boolean(onBoardingScreen.description) && 
              Boolean(onBoardingScreen.selectedImage)
            )
          )}
        >
          {tCommon('actionSave')}
        </Button>
      </Stack>
    )
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>{tAppCustomization('onboardingTitle')}</Typography>
      <Card elevation={0} sx={{ p: 1, pr: 2, borderRadius: 3, backgroundColor: theme.palette.secondary.main, mb: 2 }}>
        <Typography variant="body2">
          <div dangerouslySetInnerHTML={{ __html: tAppCustomization('onboardingInfo') }} />
        </Typography>
      </Card>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item md={12} xs={12}>
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2">{tAppCustomization('onboardingFormHowMany')}</Typography>
            <Autocomplete
              value={numberOfOnboarding}
              onChange={(_, value) => dispatch({
                type: 'SET_NUMBER_OF_ONBOARDING',
                payload: {
                  numberOfOnboarding: value
                }
              })}
              options={screens}
              fullWidth
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  placeholder={tForm('placeholderSelect', { fieldName: 'how many' })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3
                    }
                  }}
                />
              )}
            />
          </Stack>
        </Grid>
      </Grid>
      {onBoardingScreens.map((onBoardingScreen, index) => (
        <OnboardingContent index={index} onBoardingScreen={onBoardingScreen} />
      ))}
      {renderAction()}
    </Box>
  )
}

export default OnboardingScreens;