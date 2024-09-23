import { constructUrlSearchParams, DefaultQueryPageRequest, PaginationData } from '@woi/core/api';
import { apiAdminActivity } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type AdminActivityData = {
  activityId?: number | string;
  dateTime?: string;
  description?: string;
  fromUser?: string;
  status?: string;
  toUser?: string;
  type?: string;
};


export interface AdminActivityResponse extends PaginationData {
  transactions: AdminActivityData[];
}

export interface AdminActivityListRequest extends DefaultQueryPageRequest {
  endAt?: string;
  fromUser?: string;
  size?: number;
  startAt?: string;
  status?: string;
  toUser?: string;
  type?: string[];
}

function useAdminActivityListFetcher(baseUrl: string, payload: AdminActivityListRequest) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== "" && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<AdminActivityResponse>({
    baseUrl,
    path: `${apiAdminActivity}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useAdminActivityListFetcher;
