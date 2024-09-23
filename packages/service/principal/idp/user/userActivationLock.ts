import { apiUserActivation } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPut from '@woi/common/api/apiPut';

export interface UserActivationLockResponse { }

export interface UserActivationLockRequest {
  principalSecureId: string;
  status: 'ACTIVATE' | 'DEACTIVATE' | 'LOCK' | 'UNLOCK';
}

function useUserActivationLockFetcher(baseUrl: string, payload: UserActivationLockRequest) {
  return apiPut<UserActivationLockResponse>({
    baseUrl,
    path: `${apiUserActivation}`,
    payload,
  });
}

export default useUserActivationLockFetcher;
