import React from 'react';
import dynamic from 'next/dynamic';
import { CommunityOwnerDetailData } from '@woi/service/principal/admin/communityOwner/communityOwnerDetail';

const AppIcon = dynamic(() => import('./content/AppIcon/AppIcon'));
const ColorTheme = dynamic(() => import('./content/ColorTheme/ColorTheme'));
const SplashScreen = dynamic(() => import('./content/SplashScreen/SplashScreen'));
const OnboardingScreens = dynamic(() => import('./content/OnboardingScreen/OnboardingScreens'));
const Confirmation = dynamic(() => import('./content/Confirmation/Confirmation'));

export type AppCustomizationContentProps = {
  activeStep: number;
  isDisabled: boolean;
  handleStep: (step: number) => void;
  handleComplete: (step: number) => void;
  handleSubmit: () => void;
  handleCancel: () => void;
  coId?: string;
  coData: CommunityOwnerDetailData | null;
  applicationId?: string;
};

function AppCustomizationContent(props: AppCustomizationContentProps) {
  const { activeStep } = props;

  switch (activeStep) {
    case 0:
      // @ts-ignore
      return <AppIcon {...props} />;
    case 1:
      // @ts-ignore
      return <ColorTheme {...props} />;
    case 2:
      // @ts-ignore
      return <SplashScreen {...props} />;
    case 3:
      // @ts-ignore
      return <OnboardingScreens {...props} />;
    case 4:
      // @ts-ignore
      return <Confirmation {...props} />;
    default:
      return null;
  }
}

export default AppCustomizationContent;
