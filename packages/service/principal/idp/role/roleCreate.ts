import { DefaultRequest } from '@woi/core/api';
import { apiRole } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPost from '@woi/common/api/apiPost';

export type RoleCreateResponse = {
  id: number;
}

interface RoleDataPrivilege {
  menuId: string;
  privilegeType: string;
}

export type RoleCreateRequest = DefaultRequest & {
  name: string;
  description: string;
  menuPrivileges: RoleDataPrivilege[];
}

function useRoleCreateFetcher(baseUrl: string, payload: RoleCreateRequest) {
  return apiPost<RoleCreateResponse>({
    baseUrl,
    path: `${apiRole}`,
    payload,
  });
}

export default useRoleCreateFetcher;
