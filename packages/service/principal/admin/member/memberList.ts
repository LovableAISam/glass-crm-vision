import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiMember } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';

type MemberStatus = 'REGISTERED' | 'UNREGISTERED';

export interface MemberData extends ResponseData {
  coId: string;
  coName: string;
  dateOfBirth: string;
  email: string;
  name: string;
  phoneNumber: string;
  pin: string;
  referralCode: string;
  userId: string;
  enable: boolean;
  activeDate: string;
  inactiveDate: string;
  status: MemberStatus | null;
  isLocked: boolean;
}

interface MemberListResponse extends ResultData<MemberData[]> { }

export interface MemberListRequest extends DefaultQueryPageRequest {
  activeDate?: string;
  inactiveDate?: string;
  memberName?: string;
  memberVA?: string;
  status?: boolean[];
  coCodes?: string[];
}

function useMemberListFetcher(baseUrl: string, payload: MemberListRequest) {
  return apiGet<MemberListResponse>({
    baseUrl,
    path: `${apiMember}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useMemberListFetcher;
