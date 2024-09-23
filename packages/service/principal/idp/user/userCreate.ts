import { DefaultRequest } from '@woi/core/api';
import { apiUser } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPost from '@woi/common/api/apiPost';

export interface UserCreateResponse {}

export interface UserCreateRequest extends DefaultRequest {
  activeDate: string;
  description: string;
  inactiveDate: string;
  name: string;
  password: string;
  roleId: string;
  type: string;
  username: string;
}

function useUserCreateFetcher(baseUrl: string, payload: UserCreateRequest) {
  return apiPost<UserCreateResponse>({
    baseUrl,
    path: `${apiUser}`,
    payload,
  });
}

export default useUserCreateFetcher;
