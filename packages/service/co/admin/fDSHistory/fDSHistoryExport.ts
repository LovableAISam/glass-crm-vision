import { DefaultQueryPageRequest, constructUrlSearchParams, } from '@woi/core/api';
import { apiDownloadFDSHistory } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface FDSHistoryExportResponseData {
  url: string;
}

interface FDSHistoryExportResponse extends FDSHistoryExportResponseData { }

export interface FDSHistoryExportRequest extends DefaultQueryPageRequest{
  account?: string;
  endDate?: string;
  startDate?: string;
  status?: string;
  size?: number;
  transactionType?: string[];
  format?: string;
}

function useFDSHistoryExportFetcher(baseUrl: string, payload: FDSHistoryExportRequest) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== "" && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<FDSHistoryExportResponse>({
    baseUrl,
    path: `${apiDownloadFDSHistory}`,
    config: { params: constructUrlSearchParams(request) }
  });
}

export default useFDSHistoryExportFetcher;
