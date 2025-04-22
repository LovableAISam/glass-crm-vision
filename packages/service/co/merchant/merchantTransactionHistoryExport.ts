import { constructUrlSearchParams, DefaultQueryPageRequest } from '@woi/core/api';
import { apiMerchantTransactionHistoryExport } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface TransactionHistoryExportResponseData {
  url: string;
}

interface TransactionHistoryExportResponse extends TransactionHistoryExportResponseData { }

export interface MerchantTransactionHistoryExportRequest extends DefaultQueryPageRequest {
  merchantCode?: string;
  'Start Date'?: string;
  'End Date'?: string;
  fileExtension?: string;
}

function useMerchantTransactionHistoryExport(baseUrl: string, payload: MerchantTransactionHistoryExportRequest) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== "" && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<TransactionHistoryExportResponse>({
    baseUrl,
    path: `${apiMerchantTransactionHistoryExport}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useMerchantTransactionHistoryExport;
