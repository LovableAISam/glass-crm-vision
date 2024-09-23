import { DefaultRequest } from '@woi/core/api';
import { apiRole } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPut from '@woi/common/api/apiPut';

export type RoleUpdateResponse = {
  id: number;
}

interface RoleDataPrivilege {
  menuId: string;
  privilegeType: string;
}

export type RoleUpdateRequest = DefaultRequest & {
  name: string;
  description: string;
  menuPrivileges: RoleDataPrivilege[];
}

function useRoleUpdateFetcher(baseUrl: string, id: string, payload: RoleUpdateRequest) {
  return apiPut<RoleUpdateResponse>({
    baseUrl,
    path: `${apiRole}/${id}`,
    payload,
  });
}

export default useRoleUpdateFetcher;
