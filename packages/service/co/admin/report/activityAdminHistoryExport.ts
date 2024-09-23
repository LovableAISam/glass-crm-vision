import { constructUrlSearchParams, } from '@woi/core/api';
import { apiDownloadAdminActivity } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface ActivityAdminHistoryExportResponseData {
  url: string;
}

interface ActivityAdminHistoryExportResponse extends ActivityAdminHistoryExportResponseData { }

export interface ActivityAdminHistoryExportRequest {
  endAt?: string;
  fileExtension?: string;
  fromUser?: string;
  sort?: string;
  startAt?: string;
  toUser?: string;
  type?: string[];
}

function useActivityAdminHistoryExportFetcher(baseUrl: string, payload: ActivityAdminHistoryExportRequest) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== "" && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<ActivityAdminHistoryExportResponse>({
    baseUrl,
    path: `${apiDownloadAdminActivity}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useActivityAdminHistoryExportFetcher;
