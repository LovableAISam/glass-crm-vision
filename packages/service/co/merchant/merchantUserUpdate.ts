import { DefaultRequest, ResponseData } from '@woi/core/api';
import { apiMerchantUserUpdate } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPut from '@woi/common/api/apiPut';

export interface MerchantUserUpdateResponse extends ResponseData { failure: boolean; }

export interface MerchantUserUpdateRequest extends DefaultRequest {
  activeDate: string;
  description: string;
  inactiveDate: string;
  enabled: boolean;
  name: string;
  password: string;
  roleId: string;
  username: string;
}

function useMerchantUserUpdateFetcher(baseUrl: string, id: string, payload: MerchantUserUpdateRequest) {
  return apiPut<MerchantUserUpdateResponse>({
    baseUrl,
    path: `${apiMerchantUserUpdate}/${id}`,
    payload,
  });
}

export default useMerchantUserUpdateFetcher;
