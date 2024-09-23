import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData } from '@woi/core/api';
import { apiMemberLock } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type MemberStatus = 'LOCK' | 'ACTIVE';

export type MemberVybeStatus = 'LITE' | 'REGULAR' | 'PRO';

export type UpgradeStatus = 'UPGRADE' | 'NOT_UPGRADE';

export type LoyaltyStatus = 'NOT_REGISTERED' | 'REGISTERED';

export type PrivilegeType = 'REQUESTER' | 'APPROVER';

export type ActionType = 'DEDUCT' | 'TOPUP';

interface ResultData<T> {
  data: T;
  privilegeType: PrivilegeType;
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

export interface MemberLockData extends ResponseData {
  name: string;
  username: string;
  phoneNumber: string;
  rmNumber: string;
  accountNumber: string;
  balance: number;
  amount: number;
  balanceAfter: number;
  referenceNumber: string;
  balanceCorrectionId: string;
  type: ActionType;
}

interface MemberLockListResponse extends ResultData<MemberLockData[]> { }

export interface MemberLockListRequest extends DefaultQueryPageRequest {
  name?: string;
  phoneNumber?: string;
}

function useMemberLockListFetcher(baseUrl: string, payload: MemberLockListRequest) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== "" && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<MemberLockListResponse>({
    baseUrl,
    path: `${apiMemberLock}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useMemberLockListFetcher;
