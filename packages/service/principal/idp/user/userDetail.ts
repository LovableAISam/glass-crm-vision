import { apiUser } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { ResponseData } from '@woi/core/api';

export interface UserData extends ResponseData {
  activeDate: string;
  corporateId: string;
  description: string;
  inactiveDate: string;
  enabled: boolean;
  isLocked: boolean;
  name: string;
  roleId: string;
  type: string;
  username: string;
}

function useUserDetailFetcher(baseUrl: string, id: string) {
  return apiGet<UserData>({
    baseUrl,
    path: `${apiUser}/${id}`,
  });
}

export default useUserDetailFetcher;
