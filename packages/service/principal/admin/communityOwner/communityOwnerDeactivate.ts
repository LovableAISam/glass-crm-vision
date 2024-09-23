import { apiCommunityOwnerDeactivate } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPatch from '@woi/common/api/apiPatch';

interface CommunityOwnerDeactivateResponse { }

interface CommunityOwnerDeactivateRequest {
  isActive: boolean;
}

function useCommunityOwnerDeactivateFetcher(baseUrl: string, id: string, payload: CommunityOwnerDeactivateRequest) {
  return apiPatch<CommunityOwnerDeactivateResponse>({
    baseUrl,
    path: `${apiCommunityOwnerDeactivate}/${id}`,
    payload,
  });
}

export default useCommunityOwnerDeactivateFetcher;
