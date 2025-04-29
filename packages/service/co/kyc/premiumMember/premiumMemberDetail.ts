import { apiKycPremiumMember } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { ResponseData } from '@woi/core/api';
// import { KycPremiumMemberStatus } from "./premiumMemberList";

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
  // address: string;
  // cityId: string;
  // expiryDate: string;
  // identityCardUrl: string;
  // kecamatanId: string;
  // kelurahanId: string;
  // memberId: string;
  // number: string;
  // postalCode: string;
  // provinceId: string;
  // type: string;
  // licenseType: string;

  createdDate: string;
  modifiedDate: string;
  memberId: string;
  number: string;
  type: string;
  licenseType: string;
  expiryDate: string;
  address: string;
  provinceId: string;
  cityId: string;
  barangay: string;
  postalCode: number;
  identityCardUrl: string;
  id: string;

}

export interface KycPermiumMemberResidence extends ResponseData {
  // address: string;
  // cityId: string;
  // kecamatanId: string;
  // kelurahanId: string;
  // memberId: string;
  // postalCode: string;
  // provinceId: string;
  // barangay: string;

  createdDate: string;
  modifiedDate: string;
  memberId: string;
  address: string;
  cityId: string;
  provinceId: string;
  barangay: string;
  postalCode: string;
  id: string;

}

export interface KycPermiumMember extends ResponseData {
  // bloodType: string;
  // createdBy: string;
  // dateOfBirth: string;
  // fullName: string;
  // gender: string;
  // isDttot: boolean;
  // isResidenceSameWithIdentityCard: boolean;
  // maritalStatus: string;
  // memberId: string;
  // modifiedBy: string;
  // nationalityId: string;
  // phoneNumber: string;
  // placeOfBirth: string;
  // religionId: string;
  // secureId: string;
  // selfieUrl: string;
  // signatureUrl: string;
  // status: KycPremiumMemberStatus | null;

  // motherMaidenName: string;
  // transactionDate: string;
  // referralCode: string;
  // industryId: string;
  // jobTitle: string;
  // employer: string;
  // cityOfBirth: string;
  // districtOfBirth: string;

  // email: string;
  // firstName: string;
  // middleName: string;
  // lastName: string;
  // suffix: string;
  // natureOfWork: string;
  // sourceOfFunds: string;


  phoneNumber: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  dateOfBirth: string;
  gender: string;
  selfieUrl: string;
  signatureUrl: string;
  placeOfBirth: string;
  nationalityId: string;
  natureOfWork: string;
  sourceOfFunds: string;
  isDttot: string;
  status: string;
  referralCode: string;

  // Yang belum ada
  motherMaidenName: string;
  cityOfBirth: string;
  districtOfBirth: string;
  employer: string;
  jobTitle: string;
  occupation: KycPermiumOccupation;

}

export interface KycPremiumMemberDetailData {
  // accountInformation: KycPermiumAccountInformation;
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
