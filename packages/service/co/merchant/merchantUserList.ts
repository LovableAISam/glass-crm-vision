import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiMerchantUserList, } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type MerchantUserType = "REGULAR" | "PIC";

export interface MerchantUserData extends ResponseData {
  enabled: boolean;
  type: MerchantUserType;
  username: string;
  isLocked: boolean;
  role: string;
}

interface UserListResponse extends ResultData<MerchantUserData[]> { }

export interface MerchantUserListRequest extends DefaultQueryPageRequest {
  merchantCode?: string;
  username?: string;
  type?: MerchantUserType[];
  status?: boolean[];
  role?: string[];
  'active-date'?: string;
  'inactive-date'?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
}

function useMerchantUserListFetcher(baseUrl: string, payload: MerchantUserListRequest) {
  return apiGet<UserListResponse>({
    baseUrl,
    path: `${apiMerchantUserList}/${payload.merchantCode}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useMerchantUserListFetcher;
