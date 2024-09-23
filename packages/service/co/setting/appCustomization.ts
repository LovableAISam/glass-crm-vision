import { apiAppCustomization } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';

export type AppCustomizationResponse = {}

export type AppCustomizationOnboardingRequest = {
  imageKey: string;
  headline: string;
  description: string;
}

export type AppCustomizationRequest = {
  baseColor: string;
  splashScreenKey: string;
  iconKey: string;
  onboardingScreenDTOList: AppCustomizationOnboardingRequest[];
}

function useAppCustomizationFetcher(baseUrl: string, payload: AppCustomizationRequest) {
  return apiPost<AppCustomizationResponse>({
    baseUrl,
    path: `${apiAppCustomization}`,
    payload,
  });
}

export default useAppCustomizationFetcher;
