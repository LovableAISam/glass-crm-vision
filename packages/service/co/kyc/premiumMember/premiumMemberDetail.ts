import { apiKycPremiumMember } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { ResponseData } from '@woi/core/api';
import { KycPremiumMemberStatus } from "./premiumMemberList";

interface KycPermiumOccupation extends ResponseData {
  createdBy: string;
  modifiedBy: string;
  name: string;
  secureId: string;
}
export interface KycPermiumAccountInformation extends ResponseData {
  activationStatus: string;
  balance: number;
  createdBy: string;
  dateOfBirth: string;
  email: string;
  gcmId: string;
  isAccountNonExpired: boolean;
  isAccountNonLocked: boolean;
  isCredentialsNonExpired: boolean;
  isEnable: boolean;
  isTemporaryPassword: boolean;
  loyaltyStatus: string;
  name: string;
  phoneNumber: string;
  pictureFileName: string;
  rmNumber: string;
  secretId: string;
  upgradeStatus: string;
  username: string;
}

export interface KycPermiumIdentityCard extends ResponseData {
  address: string;
  cityId: string;
  expiryDate: string;
  identityCardUrl: string;
  kecamatanId: string;
  kelurahanId: string;
  memberId: string;
  number: string;
  postalCode: string;
  provinceId: string;
  type: string;
  licenseType: string;
}

export interface KycPermiumMemberResidence extends ResponseData {
  address: string;
  cityId: string;
  kecamatanId: string;
  kelurahanId: string;
  memberId: string;
  postalCode: string;
  provinceId: string;
}

export interface KycPermiumMember extends ResponseData {
  bloodType: string;
  createdBy: string;
  dateOfBirth: string;
  fullName: string;
  gender: string;
  isDttot: boolean;
  isResidenceSameWithIdentityCard: boolean;
  maritalStatus: string;
  memberId: string;
  modifiedBy: string;
  nationalityId: string;
  occupation: KycPermiumOccupation;
  phoneNumber: string;
  placeOfBirth: string;
  religionId: string;
  secureId: string;
  selfieUrl: string;
  signatureUrl: string;
  status: KycPremiumMemberStatus | null;
}

export interface KycPremiumMemberDetailData {
  accountInformation: KycPermiumAccountInformation;
  identityCard: KycPermiumIdentityCard;
  memberResidence: KycPermiumMemberResidence;
  premiumMember: KycPermiumMember;
}

function useKycPremiumMemberDetailFetcher(baseUrl: string, id: string) {
  return apiGet<KycPremiumMemberDetailData>({
    baseUrl,
    path: `${apiKycPremiumMember}/${id}`,
  });
}

export default useKycPremiumMemberDetailFetcher;
