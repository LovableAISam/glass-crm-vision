import { apiRole } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiDelete from '@woi/common/api/apiDelete';

export type RoleDeleteResponse = {
  id: number;
}

function useRoleDeleteFetcher(baseUrl: string, id: string) {
  return apiDelete<RoleDeleteResponse>({
    baseUrl,
    path: `${apiRole}/${id}`,
  });
}

export default useRoleDeleteFetcher;
