import { apiKycPremiumMember } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { ResponseData } from '@woi/core/api';
import { KycPremiumMemberStatus } from './premiumMemberHistoryList';

interface KycPremiumMemberDetailDataOccupation extends ResponseData {
  name: string;
  secureId: string;
}

interface KycPremiumMemberDetailDataCountry extends ResponseData {
  name: string;
}

interface KycPremiumMemberDetailDataProvince extends ResponseData {
  name: string;
  secureId: string;
  country: KycPremiumMemberDetailDataCountry | null;
}

interface KycPremiumMemberDetailDataCity extends ResponseData {
  name: string;
  secureId: string;
}

export interface KycPremiumMemberDetailData extends ResponseData {
  address: string;
  city: KycPremiumMemberDetailDataCity | null;
  dateOfBirth: string;
  fullName: string;
  gender: string;
  isDttot: boolean | null;
  identityCardUrl: string;
  identityNumber: number;
  identityType: string;
  email: string;
  occupation: KycPremiumMemberDetailDataOccupation | null;
  phoneNumber: string;
  placeOfBirth: string;
  province: KycPremiumMemberDetailDataProvince | null;
  selfieUrl: string;
  signatureUrl: string;
  status: KycPremiumMemberStatus | null;
  zipCode: number;
}

function useKycPremiumMemberDetailFetcher(baseUrl: string, id: string) {
  return apiGet<KycPremiumMemberDetailData>({
    baseUrl,
    path: `${apiKycPremiumMember}/${id}`,
  });
}

export default useKycPremiumMemberDetailFetcher;
