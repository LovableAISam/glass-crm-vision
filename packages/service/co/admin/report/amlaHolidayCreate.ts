import { DefaultRequest } from '@woi/core/api';
import { apiCreateAMLAHoliday } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';

export interface AMLAHolidayCreateResponse { }

export interface AMLAHolidayCreateRequest extends DefaultRequest {
  date: string;
  description: string;
  admin: string;
}

function useAMLAHolidayCreateFetcher(baseUrl: string, payload: AMLAHolidayCreateRequest) {
  return apiPost<AMLAHolidayCreateResponse>({
    baseUrl,
    path: `${apiCreateAMLAHoliday}`,
    payload,
  });
}

export default useAMLAHolidayCreateFetcher;
