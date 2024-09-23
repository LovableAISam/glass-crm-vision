import { apiUserActivation } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPut from '@woi/common/api/apiPut';

export interface UserActivationResponse { }

export interface UserActivationRequest {
  status: boolean;
}

function useUserActivationFetcher(baseUrl: string, id: string, payload: UserActivationRequest) {
  return apiPut<UserActivationResponse>({
    baseUrl,
    path: `${apiUserActivation}/${id}`,
    payload,
  });
}

export default useUserActivationFetcher;
