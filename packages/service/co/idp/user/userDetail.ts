import { apiUser } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { ResponseData } from '@woi/core/api';

export interface UserData extends ResponseData {
  activeDate: string;
  corporateId: string;
  description: string;
  inactiveDate: string;
  enabled: boolean;
  name: string;
  roleId: string;
  type: string;
  username: string;
  isLocked: boolean;
}

function useUserDetailFetcher(baseUrl: string, id: string) {
  return apiGet<UserData>({
    baseUrl,
    path: `${apiUser}/${id}`,
  });
}

export default useUserDetailFetcher;
