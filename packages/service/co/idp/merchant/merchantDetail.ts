import { apiMerchant } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { ResponseData } from '@woi/core/api';

export interface UserData extends ResponseData {
  balance: number;
  createdDate: string;
  effectiveDateFrom: string;
  effectiveDateTo: string;
  status: boolean;
  email: string;
  id: string;
  merchantCode: string;
  merchantName: string;
  modifiedDate: string;
  phoneNumber: string;
  photoLogo: string;
  principalId: string;
  countryCode: string;
  isLocked: boolean;
}

function useMerchantDetailFetcher(baseUrl: string, id: string) {
  return apiGet<UserData>({
    baseUrl,
    path: `${apiMerchant}/${id}`,
  });
}

export default useMerchantDetailFetcher;
