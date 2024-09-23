import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiUser } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type UserType = "REGULAR" | "PIC";

export interface UserData extends ResponseData {
  co: string;
  enabled: boolean;
  role: string;
  type: UserType;
  username: string;
  isLocked: boolean;
  password: string;
  description: string;
}

interface UserListResponse extends ResultData<UserData[]> { }

export interface UserListRequest extends DefaultQueryPageRequest {
  username?: string;
  type?: UserType[];
  status?: boolean[];
  role?: string[];
  co?: string[];
  'active-date'?: string;
  'inactive-date'?: string;
}

function useUserListFetcher(baseUrl: string, payload: UserListRequest) {
  return apiGet<UserListResponse>({
    baseUrl,
    path: `${apiUser}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useUserListFetcher;
