import { apiApplication } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPost from '@woi/common/api/apiPost';

export type ApplicationResponse = {}

export type ApplicationOnboardingRequest = {
  imageUrl: string;
  headline: string;
  description: string;
}

export type ApplicationCreateRequest = {
  communityOwnerId: string;
  name: string;
  color: string;
  splashScreenUrl: string;
  iconUrl: string;
  onboardingScreenDTOList: ApplicationOnboardingRequest[];
}

function useApplicationFetcher(baseUrl: string, payload: ApplicationCreateRequest) {
  return apiPost<ApplicationResponse>({
    baseUrl,
    path: `${apiApplication}`,
    payload,
  });
}

export default useApplicationFetcher;
