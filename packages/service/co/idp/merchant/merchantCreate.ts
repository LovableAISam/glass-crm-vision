import { DefaultRequest } from '@woi/core/api';
import { apiMerchant } from '@woi/common/meta/apiPaths/coApiPaths';
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
  countryCode: string | undefined;
}

function userMerchantCreateFetcher(baseUrl: string, payload: MerchantCreateRequest) {
  return apiPost<MerchantCreateResponse>({
    baseUrl,
    path: `${apiMerchant}`,
    payload,
  });
}

export default userMerchantCreateFetcher;
