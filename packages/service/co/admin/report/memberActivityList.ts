import { constructUrlSearchParams, DefaultQueryPageRequest, PaginationData } from '@woi/core/api';
import { apiMemberActivity } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type MemberActivityData = {
  activityId?: number | string;
  createdDate?: string;
  referenceId?: string;
  type?: string;
  account?: string;
  rmNumber?: string;
  description?: string;
};


export interface MemberActivityResponse extends PaginationData {
  activities: MemberActivityData[];
}

export interface MemberActivityListRequest extends DefaultQueryPageRequest {
  account?: string;
  endAt?: string;
  startAt?: string;
  size?: number;
  type?: string[];
}

function useMemberActivityListFetcher(baseUrl: string, payload: MemberActivityListRequest) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== "" && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<MemberActivityResponse>({
    baseUrl,
    path: `${apiMemberActivity}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useMemberActivityListFetcher;
