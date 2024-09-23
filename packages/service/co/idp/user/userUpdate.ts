import { DefaultRequest, ResponseData } from '@woi/core/api';
import { apiUser } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPut from '@woi/common/api/apiPut';
import { UserType } from './userList';

export interface UserUpdateResponse extends ResponseData {}

export interface UserUpdateRequest extends DefaultRequest {
  activeDate: string;
  description: string;
  inactiveDate: string;
  enabled: boolean;
  name: string;
  password: string;
  roleId: string;
  type: UserType;
  username: string;
}

function useUserUpdateFetcher(baseUrl: string, id: string, payload: UserUpdateRequest) {
  return apiPut<UserUpdateResponse>({
    baseUrl,
    path: `${apiUser}/${id}`,
    payload,
  });
}

export default useUserUpdateFetcher;
