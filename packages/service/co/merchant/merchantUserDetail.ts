import { apiMerchantUserDetail } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { ResponseData } from '@woi/core/api';

export interface MerchantUserData extends ResponseData {
  activeDate: string;
  coCode: string;
  description: string;
  enabled: boolean;
  inactiveDate: string;
  isLocked: boolean;
  merchantCode: string;
  name: string;
  roleId: string;
  roleName: string;
  type: string;
  username: string;
}

function useMerchantUserDetailFetcher(baseUrl: string, id: string) {
  return apiGet<MerchantUserData>({
    baseUrl,
    path: `${apiMerchantUserDetail}/${id}`,
  });
}

export default useMerchantUserDetailFetcher;
