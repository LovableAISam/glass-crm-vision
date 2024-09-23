import { DefaultQueryPageRequest, PaginationData, constructUrlSearchParams, } from '@woi/core/api';
import { apiAMLAHoliday } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface AMLAHolidayData {
  id: string;
  holidayDate: string;
  description: string;
}


export interface AMLAHolidayRequest extends DefaultQueryPageRequest {
  size?: number;
  year?: string[];
}

export interface DailyReportResponse extends PaginationData {
  data: AMLAHolidayData[];
}

function useAMLAHolidayFetcher(baseUrl: string, payload: AMLAHolidayRequest) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== "" && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<DailyReportResponse>({
    baseUrl,
    path: `${apiAMLAHoliday}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useAMLAHolidayFetcher;
