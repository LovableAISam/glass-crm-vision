import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiKycPremiumMember } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type KycPremiumMemberStatus = 'NONE' | 'PREMIUM' | 'UNREGISTERED' | 'REJECTED' | 'WAITING_TO_REVIEW';

export interface KycPremiumMemberData extends ResponseData {
  identityNumber: number;
  identityType: string;
  fullName: string;
  phoneNumber: string;
  status: KycPremiumMemberStatus;
  createdBy: string;
  modifiedBy: string;
}

interface KycPremiumMemberListResponse extends ResultData<KycPremiumMemberData[]> { }

export interface KycPremiumMemberListRequest extends DefaultQueryPageRequest {
  memberName?: string;
  phoneNumber?: string;
  requestDateFrom?: string;
  requestDateTo?: string;
  status?: KycPremiumMemberStatus[];
}

function useKycPremiumMemberListFetcher(baseUrl: string, payload: KycPremiumMemberListRequest) {
  return apiGet<KycPremiumMemberListResponse>({
    baseUrl,
    path: `${apiKycPremiumMember}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useKycPremiumMemberListFetcher;
