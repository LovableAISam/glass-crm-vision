import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiRole } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface RoleDataPrivilege {
  menuId: string;
  privilegeType: string;
}

export interface RoleData extends ResponseData {
  name: string;
  description: string;
  menuPrivileges: RoleDataPrivilege[];
  numberOfUser: number;
}

interface RoleListResponse extends ResultData<RoleData[]> {}

export interface RoleListRequest extends DefaultQueryPageRequest {}

function useRoleListFetcher(baseUrl: string, payload: RoleListRequest) {
  return apiGet<RoleListResponse>({
    baseUrl,
    path: `${apiRole}`,
    config: { params: constructUrlSearchParams(payload)},
  });
}

export default useRoleListFetcher;
