import { DefaultRequest } from '@woi/core/api';
import { apiKycPremiumMemberVerification } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPatch from '@woi/common/api/apiPatch';
import { KycPremiumMemberStatus } from './premiumMemberList';

export interface KycPremiumMemberVerifictionResponse { }

export interface KycPremiumMemberVerifictionRequest extends DefaultRequest {
  id: string;
  reason: string;
  status: KycPremiumMemberStatus;
}

function useKycPremiumMemberVerifictionFetcher(baseUrl: string, id: string, payload: KycPremiumMemberVerifictionRequest) {
  return apiPatch<KycPremiumMemberVerifictionResponse>({
    baseUrl,
    path: `${apiKycPremiumMemberVerification}/${id}`,
    payload,
  });
}

export default useKycPremiumMemberVerifictionFetcher;
