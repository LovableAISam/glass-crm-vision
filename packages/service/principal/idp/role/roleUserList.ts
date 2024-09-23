import { constructApiPath, constructUrlSearchParams, DefaultQueryPageRequest, ResultData } from '@woi/core/api';
import { apiRoleUsers } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface RoleUserListResponse extends ResultData<string[]> {}

export interface RoleUserListRequest extends DefaultQueryPageRequest {}

function useRoleUserListFetcher(baseUrl: string, id: string, payload: RoleUserListRequest) {
  return apiGet<RoleUserListResponse>({
    baseUrl,
    path: constructApiPath(`${apiRoleUsers}`, { id }),
    config: { params: constructUrlSearchParams(payload)},
  });
}

export default useRoleUserListFetcher;
