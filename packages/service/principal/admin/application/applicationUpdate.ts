import { apiApplicationUpdate } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPost from '@woi/common/api/apiPost';
import { constructApiPath } from '@woi/core/api';

export type ApplicationResponse = {}

export type ApplicationOnboardingRequest = {
  imageUrl: string;
  headline: string;
  description: string;
}

export type ApplicationUpdateRequest = {
  applicationId: string;
  color: string;
  splashScreenUrl: string;
  iconUrl: string;
  onboardingScreenDTOList: ApplicationOnboardingRequest[];
}

function useApplicationFetcher(baseUrl: string, id: string, payload: ApplicationUpdateRequest) {
  return apiPost<ApplicationResponse>({
    baseUrl,
    path: constructApiPath(`${apiApplicationUpdate}`, { id }),
    payload,
  });
}

export default useApplicationFetcher;
