import { apiMerchantCashoutInquiry } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';

export interface MerchantCreateQrResponse {
  amount: number;
}

export interface MerchantCreateQrRequest {
  amount: number;
  merchantCode: string;
}

function useMerchantMerchantCreateQrFetcher(
  baseUrl: string,
  payload: MerchantCreateQrRequest,
) {
  return apiPost<MerchantCreateQrResponse>({
    baseUrl,
    path: `${apiMerchantCashoutInquiry}`,
    payload,
  });
}

export default useMerchantMerchantCreateQrFetcher;
