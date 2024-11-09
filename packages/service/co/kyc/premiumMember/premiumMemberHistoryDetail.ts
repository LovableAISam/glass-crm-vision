import { apiKycPremiumMemberHistoryDetail } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { ResponseData } from '@woi/core/api';
import { KycPermiumAccountInformation, KycPermiumIdentityCard, KycPermiumMember, KycPermiumMemberResidence } from "./premiumMemberDetail";
import { KycPremiumMemberStatus } from "./premiumMemberList";

export interface KycPermiumHistory extends ResponseData {
  createdBy: string;
  fullName: string;
  modifiedDate: string;
  phoneNumber: string;
  reason: string;
  status: KycPremiumMemberStatus | null;
}

export interface KycPremiumMemberHistoryDetailData {
  accountInformation: KycPermiumAccountInformation;
  histories: KycPermiumHistory[];
  identityCard: KycPermiumIdentityCard;
  memberResidence: KycPermiumMemberResidence;
  premiumMember: KycPermiumMember;
}

function useKycPremiumMemberHistoryDetailFetcher(baseUrl: string, id: string) {
  return apiGet<KycPremiumMemberHistoryDetailData>({
    baseUrl,
    path: `${apiKycPremiumMemberHistoryDetail}?premiumMemberSecureId=${id}`,
  });
}

export default useKycPremiumMemberHistoryDetailFetcher;
