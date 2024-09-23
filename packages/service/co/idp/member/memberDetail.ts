import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData } from '@woi/core/api';
import { apiMemberDetail } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { KycPremiumMemberStatus } from '../../kyc/premiumMember/premiumMemberList';
import { LoyaltyStatus, MemberStatus, MemberVybeStatus, UpgradeStatus } from './memberList';

export interface MemberDetailPremium extends ResponseData {
  address: string;
  city: { name: string; } | null;
  dateOfBirth: string;
  name: string;
  gender: string;
  isDttot: boolean | null;
  identityCardUrl: string;
  identityNumber: number;
  identityType: string;
  email: string;
  occupation: { name: string; } | null;
  phoneNumber: string;
  placeOfBirth: string;
  province: { name: string; country: { name: string; }; } | null;
  selfieUrl: string;
  signatureUrl: string;
  status: KycPremiumMemberStatus | null;
  zipCode: number;
  vybeMember: MemberVybeStatus | null;
}

export interface MemberDetailData extends ResponseData {
  email: string;
  name: string;
  username: string;
  phoneNumber: string;
  rmNumber: string;
  vybeMember: MemberVybeStatus | null;
  upgradeStatus: UpgradeStatus | null;
  activationStatus: MemberStatus | null;
  loyaltyStatus: LoyaltyStatus | null;
  isEnable: boolean;
  isAccountNonLocked: boolean;
  isCredentialsNonExpired: boolean;
  isAccountNonExpired: boolean;
  isTemporaryPassword: boolean;
  createdBy: string;
  pictureFileName: string;
  accountNumber: string;
  upgradeDate: string;
  balance: number;
}

export interface MemberDetailRequest extends DefaultQueryPageRequest {
  kycId?: string;
  memberSecureId?: string;
  phoneNumber?: string | null;
}

function useMemberDetailFetcher(baseUrl: string, payload: MemberDetailRequest) {
  return apiGet<MemberDetailData>({
    baseUrl,
    path: `${apiMemberDetail}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useMemberDetailFetcher;
