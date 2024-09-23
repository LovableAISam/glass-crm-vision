import { apiCommunityOwnerPICLock } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPatch from '@woi/common/api/apiPatch';

interface CommunityOwnerPICLockResponse { }

interface CommunityOwnerPICLockRequest {
  isLock: boolean;
}

function useCommunityOwnerPICLockFetcher(baseUrl: string, id: string, payload: CommunityOwnerPICLockRequest) {
  return apiPatch<CommunityOwnerPICLockResponse>({
    baseUrl,
    path: `${apiCommunityOwnerPICLock}/${id}`,
    payload,
  });
}

export default useCommunityOwnerPICLockFetcher;
