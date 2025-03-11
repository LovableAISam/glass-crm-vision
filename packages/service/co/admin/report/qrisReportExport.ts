import { constructUrlSearchParams } from '@woi/core/api';
import { apiQRISExport } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface QrisReportExportResponseData {
  url: string;
}

interface QrisReportExportResponse extends QrisReportExportResponseData {}

export interface QrisReportExportRequest {
  startDate?: string;
  endDate?: string;
  format?: string;
  sort?: string;
  kycLocation?: string[];
  merchantCategoryCode?: string[];
  merchantCriteria?: string[];
  merchantName?: string;
  qrisLocation?: string[];
  qrType?: string[];
  qrisType?: string[];
  transactionType?: string[];
}

function useQRISReportExportFetcher(
  baseUrl: string,
  payload: QrisReportExportRequest,
) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== '' && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<QrisReportExportResponse>({
    baseUrl,
    path: `${apiQRISExport}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useQRISReportExportFetcher;
