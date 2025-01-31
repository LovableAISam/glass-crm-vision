import { apiMerchantCashoutInquiry } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';

export interface CashoutInquiryResponse {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  failure: boolean;
}

export interface CashoutInquiryRequest {
  accountNumber: string;
  bankCode: string;
  bankId: string;
  bankName: string;
  merchantCode: string;
}

function useMerchantCashoutInquiryFetcher(baseUrl: string, payload: CashoutInquiryRequest) {
  return apiPost<CashoutInquiryResponse>({
    baseUrl,
    path: `${apiMerchantCashoutInquiry}`,
    payload,
  });
}

export default useMerchantCashoutInquiryFetcher;
