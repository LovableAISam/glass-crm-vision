import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiReferral } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export type ReferralType = 'FUND_TYPE' | 'CONTACT_TYPE' | 'USER_CREDENTIAL_CHANNEL';

export interface ReferralData extends ResponseData {
  code: string;
  value: string;
}

interface ReferralListResponse extends ResultData<ReferralData[]> {}

export interface ReferralListRequest extends DefaultQueryPageRequest {
  search?: string;
  type: ReferralType;
}

function useReferralListFetcher(baseUrl: string, payload: ReferralListRequest) {
  return apiGet<ReferralListResponse>({
    baseUrl,
    path: `${apiReferral}`,
    config: { params: constructUrlSearchParams(payload)},
  });
}

export default useReferralListFetcher;
