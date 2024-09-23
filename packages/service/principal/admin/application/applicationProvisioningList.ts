import { constructApiPath } from '@woi/core/api';
import { apiApplicationProvisioning } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { ApplicationStatus } from './applicationList';

export interface ApplicationProvisioningData {
  name: string;
  status: ApplicationStatus;
}

export interface ApplicationProvisioningDataStep {
  steps: ApplicationProvisioningData[];
}

interface ApplicationProvisioningListResponse extends ApplicationProvisioningDataStep { }

function useApplicationProvisioningListFetcher(baseUrl: string, id: string) {
  return apiGet<ApplicationProvisioningListResponse>({
    baseUrl,
    path: constructApiPath(`${apiApplicationProvisioning}`, { id }),
  });
}

export default useApplicationProvisioningListFetcher;
