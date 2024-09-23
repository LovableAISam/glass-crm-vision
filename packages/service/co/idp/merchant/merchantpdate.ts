import { DefaultRequest, ResponseData } from '@woi/core/api';
import { apiMerchant } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPut from '@woi/common/api/apiPut';

export interface MerchantUpdateResponse extends ResponseData { }

export interface MerchantUpdateRequest extends DefaultRequest {
  effectiveDateFrom: string;
  effectiveDateTo: string;
  merchantName: string;
  phoneNumber: string;
  photoLogo: string;
  principalId: string;
  status: boolean;
}

function useMerchantUpdateFetcher(baseUrl: string, id: string, payload: MerchantUpdateRequest) {
  return apiPut<MerchantUpdateResponse>({
    baseUrl,
    path: `${apiMerchant}/${id}`,
    payload,
  });
}

export default useMerchantUpdateFetcher;
