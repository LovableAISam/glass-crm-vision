import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiMember } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type MemberStatus = 'LOCK' | 'ACTIVE' | any;

export type MemberVybeStatus = 'LITE' | 'REGULAR' | 'PRO' | any;

export type UpgradeStatus = 'UPGRADE' | 'NOT_UPGRADE' | 'VERIFIED' | any;

export type LoyaltyStatus = 'NOT_REGISTERED' | 'REGISTERED' | any;

export interface MemberData extends ResponseData {
  email: string;
  name: string;
  username: string;
  phoneNumber: string;
  rmNumber: string;
  vybeMember: MemberVybeStatus;
  upgradeStatus: UpgradeStatus;
  activationStatus: MemberStatus;
  loyaltyStatus: LoyaltyStatus;
  isEnable: boolean;
  isAccountNonLocked: boolean;
  isCredentialsNonExpired: boolean;
  isTemporaryPassword: boolean;
  createdBy: string;
  pictureFileName: string;
  accountNumber: string;
  dateOfBirth: string;
  upgradeDate: string;
  secretId: string;
  gcmId: string;
  balance: number;
  isAccountNonExpired: boolean;
  activeDate: string;
  enable: boolean;
  id: string;
  inactiveDate: string;
  isLocked: boolean;
  modifiedDate: string;
  referralCode: string;
  coId: string;
  status: UpgradeStatus;
}

interface MemberListResponse extends ResultData<MemberData[]> { }

export interface MemberListRequest extends DefaultQueryPageRequest {
  'active-date'?: string;
  'inactive-date'?: string;
  name?: string;
  phoneNumber?: string;
  rmNumber?: string;
  status?: string[];
  upgradeStatus?: string[];
  vybeMember?: string[];
}

function useMemberListFetcher(baseUrl: string, payload: MemberListRequest) {
  return apiGet<MemberListResponse>({
    baseUrl,
    path: `${apiMember}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useMemberListFetcher;
