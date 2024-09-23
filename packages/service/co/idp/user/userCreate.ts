import { DefaultRequest } from '@woi/core/api';
import { apiUser } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';
import { UserType } from './userList';

export interface UserCreateResponse {}

export interface UserCreateRequest extends DefaultRequest {
  activeDate: string;
  description: string;
  inactiveDate: string;
  name: string;
  password: string;
  roleId: string;
  type: UserType;
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
