import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiKycPremiumMember } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type KycPremiumMemberStatus = 'STARTED' | 'WAITING_TO_REVIEW' | 'REGISTERED' | 'UNREGISTER' | 'REJECTED' | 'UNVERIFIED' | 'VERIFIED';

export interface KycPremiumMemberData extends ResponseData {
  identityNumber: number;
  identityType: string;
  fullName: string;
  phoneNumber: string;
  status: KycPremiumMemberStatus;
  createdBy: string;
  modifiedBy: string;
  firstName: string;
  middleName: string;
  lastName: string;
  placeOfBirth: string;
  gender: string;
  nationalityId: string;
  email: string;
  suffix: string;
  natureOfWork: string;
  sourceOfFunds: string;
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
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== "" && value.length !== 0) {
      request[key] = value;
    }
  }
  return apiGet<KycPremiumMemberListResponse>({
    baseUrl,
    path: `${apiKycPremiumMember}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useKycPremiumMemberListFetcher;
