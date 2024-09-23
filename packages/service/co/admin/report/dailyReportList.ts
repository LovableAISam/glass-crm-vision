import { DefaultQueryPageRequest, PaginationData, constructUrlSearchParams, } from '@woi/core/api';
import { apiDailyReport } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface DailyReportData {
  createdBy: string;
  createdDate: string;
  deletedAt: string;
  effectiveDate: string;
  fileName: string;
  id: number;
  modifiedBy: string;
  modifiedDate: string;
  reportUrl: string;
}


export interface DailyReportRequest extends DefaultQueryPageRequest {
  endAt?: string;
  size?: number;
  startAt?: string;
}

export interface DailyReportResponse extends PaginationData {
  dailyEonboardingLists: DailyReportData[];
}

function useDailyReportFetcher(baseUrl: string, payload: DailyReportRequest) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== "" && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<DailyReportResponse>({
    baseUrl,
    path: `${apiDailyReport}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useDailyReportFetcher;
