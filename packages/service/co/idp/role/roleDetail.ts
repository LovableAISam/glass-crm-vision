import { apiRole } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { RoleData } from './roleList';

function useRoleDetailFetcher(baseUrl: string, id: string) {
  return apiGet<RoleData>({
    baseUrl,
    path: `${apiRole}/${id}`,
  });
}

export default useRoleDetailFetcher;
