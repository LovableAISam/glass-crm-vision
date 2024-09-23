import { constructUrlSearchParams, } from '@woi/core/api';
import { apiDownloadMemberActivity } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface ActivityMemberHistoryExportResponseData {
  url: string;
}

interface ActivityMemberHistoryExportResponse extends ActivityMemberHistoryExportResponseData { }

export interface ActivityMemberHistoryExportRequest {
  account?: string;
  endAt?: string;
  fileExtension?: string;
  sort?: string;
  startAt?: string;
  type?: string[];
}

function useActivityMemberHistoryExportFetcher(baseUrl: string, payload: ActivityMemberHistoryExportRequest) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== "" && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<ActivityMemberHistoryExportResponse>({
    baseUrl,
    path: `${apiDownloadMemberActivity}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useActivityMemberHistoryExportFetcher;
