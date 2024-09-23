import { constructApiPath } from '@woi/core/api';
import { apiCommunityOwnerActivationResume } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPost from '@woi/common/api/apiPost';

interface CommunityOwnerActivationResumeResponse {}

function useCommunityOwnerActivationResumeFetcher(baseUrl: string, id: string) {
  return apiPost<CommunityOwnerActivationResumeResponse>({
    baseUrl,
    path: constructApiPath(`${apiCommunityOwnerActivationResume}`, { id }),
  });
}

export default useCommunityOwnerActivationResumeFetcher;
