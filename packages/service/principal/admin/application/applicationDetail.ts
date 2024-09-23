import { apiApplication } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { ResponseData } from '@woi/core/api';
import { ApplicationStatus } from './applicationList';

interface ApplicationDataOnboardingScreen {
  description: string;
  headline: string;
  imageUrl: string;
}

export interface ApplicationData extends ResponseData {
  name: string;
  color: string;
  iconUrl: string;
  splashScreenUrl: string;
  status: ApplicationStatus;
  createdBy: string;
  onboardingScreenDTOList: ApplicationDataOnboardingScreen[];
  communityOwnerId: string;
}

function useApplicationDetailFetcher(baseUrl: string, id: string) {
  return apiGet<ApplicationData>({
    baseUrl,
    path: `${apiApplication}/${id}`,
  });
}

export default useApplicationDetailFetcher;
