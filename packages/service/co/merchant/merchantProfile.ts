import { apiMerchantProfile } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { ResponseData } from '@woi/core/api';

export interface MerchantProfileResponse extends ResponseData {
  id: string;
  merchantCode: string;
  merchantName: string;
  accountNumber: string;
  balance: number;
  statusMerchant: boolean;
  effectiveDateFrom: string;
  effectiveDateTo: string;
  co: string;
  failure: boolean;
  qrType: string;
}

function useMerchantProfileFetcher(baseUrl: string, merchantCode: string) {
  return apiGet<MerchantProfileResponse>({
    baseUrl,
    path: `${apiMerchantProfile}?merchantCode=${merchantCode}`,
  });
}

export default useMerchantProfileFetcher;
