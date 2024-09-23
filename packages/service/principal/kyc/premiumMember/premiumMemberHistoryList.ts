import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiKycPremiumMemberHistory } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type KycPremiumMemberStatus = 'NONE' | 'PREMIUM' | 'UNREGISTERED' | 'REJECTED' | 'WAITING_TO_REVIEW';

interface KycPremiumMemberData extends ResponseData {
  secureId: string;
  identityNumber: number;
  identityType: string;
  fullName: string;
  phoneNumber: string;
  status: KycPremiumMemberStatus;
}

export interface KycPremiumMemberHistoryData extends ResponseData {
  premiumMember: KycPremiumMemberData | null;
  fullName: string;
  phoneNumber: string;
  verificationDate: string;
  verifierName: string;
  status: KycPremiumMemberStatus;
  createdBy: string;
  modifiedBy: string;
}

interface KycPremiumMemberHistoryListResponse extends ResultData<KycPremiumMemberHistoryData[]> { }

export interface KycPremiumMemberHistoryListRequest extends DefaultQueryPageRequest {
  fullName?: string;
  phoneNumber?: string;
  verificationDateFrom?: string;
  verificationDateTo?: string;
  status?: KycPremiumMemberStatus[];
}

function useKycPremiumMemberHistoryListFetcher(baseUrl: string, payload: KycPremiumMemberHistoryListRequest) {
  return apiGet<KycPremiumMemberHistoryListResponse>({
    baseUrl,
    path: `${apiKycPremiumMemberHistory}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useKycPremiumMemberHistoryListFetcher;
