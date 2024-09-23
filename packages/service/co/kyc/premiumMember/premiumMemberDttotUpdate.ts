import { DefaultRequest } from '@woi/core/api';
import { apiKycPremiumMemberSetDttot } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPatch from '@woi/common/api/apiPatch';

export interface KycPremiumMemberDttotUpdateResponse {
  isDttot: boolean;
}

export interface KycPremiumMemberDttotUpdateRequest extends DefaultRequest {
  id: string;
  isDttot: boolean;
}

function useKycPremiumMemberDttotUpdateFetcher(baseUrl: string, id: string, payload: KycPremiumMemberDttotUpdateRequest) {
  return apiPatch<KycPremiumMemberDttotUpdateResponse>({
    baseUrl,
    path: `${apiKycPremiumMemberSetDttot}/${id}`,
    payload,
  });
}

export default useKycPremiumMemberDttotUpdateFetcher;
