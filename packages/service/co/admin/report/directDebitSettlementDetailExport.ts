import { constructUrlSearchParams } from '@woi/core/api';
import { apiDirectDebitSettlementExport } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface DirectDebitSettlementExportResponseData {
  url: string;
}

interface DirectDebitSettlementExportResponse
  extends DirectDebitSettlementExportResponseData {}

export interface DirectDebitSettlementExportRequest {
  startDate?: string;
  endDate?: string;
  format?: string;
  sort?: string;
  status?: string[];
  merchantName?: string;
}

function useDirectDebitSettlementExportFetcher(
  baseUrl: string,
  payload: DirectDebitSettlementExportRequest,
) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== '' && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<DirectDebitSettlementExportResponse>({
    baseUrl,
    path: `${apiDirectDebitSettlementExport}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useDirectDebitSettlementExportFetcher;
