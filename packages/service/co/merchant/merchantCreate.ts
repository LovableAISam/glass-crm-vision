import { DefaultRequest } from '@woi/core/api';
import { apiMerchantCreate } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';

export interface MerchantCreateResponse { }

export interface MerchantCreateRequest extends DefaultRequest {
  effectiveDateFrom: string;
  effectiveDateTo: string;
  email: string;
  merchantName: string;
  password: string;
  phoneNumber: string;
  photoLogo: string;
  active: boolean;
  merchantCategory: string;
  merchantCodeCategory: string,
  merchantType: string;
  countryCode: string;
}

function userMerchantCreateFetcher(baseUrl: string, payload: MerchantCreateRequest) {
  return apiPost<MerchantCreateResponse>({
    baseUrl,
    path: `${apiMerchantCreate}`,
    payload,
  });
}

export default userMerchantCreateFetcher;
