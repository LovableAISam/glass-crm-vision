import { constructUrlSearchParams, DefaultQueryPageRequest, DefaultResponseData } from '@woi/core/api';
import { apiTransactionHistoryExport } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface TransactionHistoryExportResponseData {
  url: string;
}

interface TransactionHistoryExportResponse extends DefaultResponseData<TransactionHistoryExportResponseData> { }

export interface TransactionHistoryExportRequest extends DefaultQueryPageRequest {
  status?: string;
  startDate?: string;
  endDate?: string;
  transactionType?: string[];
  phoneNumber?: string;
  receiverAccountNo?: string;
  referenceId?: string;
  description?: string;
  transactionAmount?: string;
  balance?: string;
}

function useTransactionHistoryExportFetcher(baseUrl: string, payload: TransactionHistoryExportRequest) {
  return apiGet<TransactionHistoryExportResponse>({
    baseUrl,
    path: `${apiTransactionHistoryExport}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useTransactionHistoryExportFetcher;
