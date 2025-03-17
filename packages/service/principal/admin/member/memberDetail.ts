import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData } from '@woi/core/api';
import apiGet from '@woi/common/api/apiGet';
import { apiMemberDetail } from "@woi/common/meta/apiPaths/principalApiPaths";

export type MemberStatus = 'REGISTERED' | 'UNREGISTERED' | 'LOCK' | 'ACTIVE' | any;

export type MemberVybeStatus = 'LITE' | 'REGULAR' | 'PRO' | any;

export type UpgradeStatus = 'UPGRADE' | 'NOT_UPGRADE' | any;

export type LoyaltyStatus = 'NOT_REGISTERED' | 'REGISTERED' | any;

export type KycPremiumMemberStatus = 'NONE' | 'PREMIUM' | 'UNREGISTERED' | 'REJECTED' | 'WAITING_TO_REVIEW';

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
  coSecureId?: string;
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
