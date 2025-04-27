import { apiMerchantTransactionHistoryPrint } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface TransactionHistoryPrintResponseData {
  url: string;
}

interface TransactionHistoryPrintResponse extends TransactionHistoryPrintResponseData { }

export interface MerchantTransactionHistoryPrintRequest {
  id: string;
}

function useMerchantTransactionHistoryPrint(baseUrl: string, payload: MerchantTransactionHistoryPrintRequest) {
  return apiGet<TransactionHistoryPrintResponse>({
    baseUrl,
    path: `${apiMerchantTransactionHistoryPrint}?id=${payload.id}`,
    // config: { params: constructUrlSearchParams(payload.id) },
  });
}

export default useMerchantTransactionHistoryPrint;
