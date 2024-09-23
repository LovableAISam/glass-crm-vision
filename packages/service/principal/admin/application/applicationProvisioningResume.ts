import { constructApiPath } from '@woi/core/api';
import { apiApplicationProvisioningResume } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPost from '@woi/common/api/apiPost';

interface ApplicationProvisioningResumeResponse { }

function useApplicationProvisioningResumeFetcher(baseUrl: string, id: string) {
  return apiPost<ApplicationProvisioningResumeResponse>({
    baseUrl,
    path: constructApiPath(`${apiApplicationProvisioningResume}`, { id }),
  });
}

export default useApplicationProvisioningResumeFetcher;
