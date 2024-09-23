import React, { useEffect, useState } from 'react';

import { Card, Stepper, Step, StepButton, Typography, useTheme, useMediaQuery, Stack } from '@mui/material';
import AppCustomizationContent from './containers/AppCustomizationContent';
import {
  AppCustomization,
  AppCustomizationAppIcon,
  AppCustomizationContextAction,
  AppCustomizationContextState,
  AppCustomizationFile,
  AppCustomizationReducer,
  useAppCustomizationAction,
} from './context/AppCustomizationContext';
import { Button, Token, useConfirmationDialog } from '@woi/web-component';
import { useSnackbar } from 'notistack';
import { useApplicationDetailFetcher, useCommunityOwnerDetailFetcher } from '@woi/service/principal';
import useBaseUrl from '@src/shared/hooks/useBaseUrl';
import useMenuPrivilege from '@src/shared/hooks/useMenuPrivilege';
import useRouteRedirection from '@src/shared/hooks/useRouteRedirection';
import { CommunityOwnerDetailData } from '@woi/service/principal/admin/communityOwner/communityOwnerDetail';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useTranslation } from 'react-i18next';

type AppCustomizationProps = {
  coId?: string;
  applicationId?: string;
}

function AppCustomizationWrapper(props: AppCustomizationProps) {
  const { coId, applicationId } = props;
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{
    [k: number]: boolean;
  }>({});
  const [coData, setCoData] = useState<CommunityOwnerDetailData | null>(null);
  const theme = useTheme();
  const desktopView = useMediaQuery(theme.breakpoints.up('sm'));
  const { getConfirmation } = useConfirmationDialog();
  const { enqueueSnackbar } = useSnackbar();
  const { baseUrl } = useBaseUrl();
  const { checkAuthority } = useMenuPrivilege();
  const { onNavigate } = useRouteRedirection();
  const dispatch = useAppCustomizationAction();
  const { t: tCommon } = useTranslation('common');
  const { t: tAppCustomization } = useTranslation('appCustomization');
  const steps = [
    tAppCustomization('tabTitleAppIcon'),
    tAppCustomization('tabTitleColorTheme'),
    tAppCustomization('tabTitleSplashScreen'),
    tAppCustomization('tabTitleOnboardingScreens'),
    tAppCustomization('tabTitleConfirmation'),
  ];

  const handleStep = (step: number) => {
    setActiveStep(step);
  };

  const handleComplete = (step: number) => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleStep(step);
  };

  const handleSubmit = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationSubmitTitle', { text: 'App Customization' }),
      message: tCommon('confirmationSubmitDescription', { text: 'App Customization' }),
      primaryText: tCommon('confirmationSubmitYes'),
      secondaryText: tCommon('confirmationSubmitNo'),
    });

    if (confirmed) {
      enqueueSnackbar(tCommon('successUpdate', { text: 'App Customization' }), {
        variant: 'success',
      });
    }
  };

  const handleCancel = async () => {
    const confirmed = await getConfirmation({
      title: tCommon('confirmationCancelCreateTitle', { text: 'App Customization' }),
      message: tCommon('confirmationCancelCreateTitle', { text: 'App Customization' }),
      primaryText: tCommon('confirmationCancelCreateYes'),
      secondaryText: tCommon('confirmationCancelCreateNo'),
      btnPrimaryColor: 'inherit',
      btnSecondaryColor: 'error',
    });

    if (confirmed) {
      onNavigate('/app-customization');
    }
  }

  const fetchCODetail = async (_coId: string) => {
    const { result, error } = await useCommunityOwnerDetailFetcher(baseUrl, _coId);

    if (result && !error) {
      setCoData(result);
    }
  }

  const fetchAppCustomizationDetail = async (_applicationId: string) => {
    const { result, error } = await useApplicationDetailFetcher(baseUrl, _applicationId);

    if (result && !error) {
      dispatch({
        type: 'SET_INIT_STATE',
        payload: {
          themeColor: result.color ? `#${result.color}` : '',
          appIcon: {
            ...AppCustomizationAppIcon(),
            appName: result.name,
            selectedImage: result.iconUrl,
          },
          splashScreen: {
            ...AppCustomizationFile(),
            selectedImage: result.splashScreenUrl
          },
          numberOfOnboarding: {
            label: `${result.onboardingScreenDTOList.length} Onboarding Screens`,
            value: result.onboardingScreenDTOList.length
          },
          onBoardingScreens: result.onboardingScreenDTOList.map(data => ({
            ...AppCustomizationFile(),
            title: data.headline,
            description: data.description,
            selectedImage: data.imageUrl,
          })),
        }
      });
      if (result.communityOwnerId) {
        fetchCODetail(result.communityOwnerId);
      }
    }
  }

  useEffect(() => {
    if (coId) {
      fetchCODetail(coId);
    }
  }, [coId])

  useEffect(() => {
    if (applicationId) {
      fetchAppCustomizationDetail(applicationId);
    }
  }, [applicationId])

  return (
    <Stack direction="column" spacing={2} sx={{ pb: 3 }} alignItems="flex-start">
      <Button
        variant="text"
        color="primary"
        startIcon={<ChevronLeftIcon sx={{ fontSize: 20 }} />}
        onClick={handleCancel}
      >
        {tAppCustomization('actionBackToList')}
      </Button>
      <Card sx={{ px: 3, pt: 3, borderRadius: 4, width: '100%' }}>
        <Stack direction="column" spacing={1}>
          <Typography textAlign="center" variant="body2" color={Token.color.greyscaleGreyDarker}>{tAppCustomization('pageTitle')}</Typography>
          <Typography textAlign="center" variant="h4">{coData?.name}</Typography>
        </Stack>
        <Stepper nonLinear alternativeLabel={!desktopView} activeStep={activeStep} sx={{ px: { xl: 10, md: 5, xs: 0 }, my: 5 }}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]} disabled={!completed[index]}>
              <StepButton color="inherit" onClick={() => handleStep(index)}>
                {desktopView ? label : ''}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <AppCustomizationContent
          activeStep={activeStep}
          isDisabled={!checkAuthority('app-customization', ['create', 'update'])}
          handleStep={handleStep}
          handleComplete={handleComplete}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          coId={coId}
          coData={coData}
          applicationId={applicationId}
        />
      </Card>
    </Stack>
  )
}

function AppCustomizationContainer(props: AppCustomizationProps) {
  const [rootState, rootDispatch] = React.useReducer(AppCustomizationReducer, AppCustomization());

  return (
    <AppCustomizationContextState.Provider value={rootState}>
      <AppCustomizationContextAction.Provider value={rootDispatch}>
        <AppCustomizationWrapper {...props} />
      </AppCustomizationContextAction.Provider>
    </AppCustomizationContextState.Provider>
  )
}

export default AppCustomizationContainer;