import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiSCP } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface SCPData extends ResponseData {
  merchantId: string;
  name: string;
  secretKey: string;
  userCredential: string;
}

interface SCPListResponse extends ResultData<SCPData[]> {}

export interface SCPListRequest extends DefaultQueryPageRequest {
  search?: string;
}

function useSCPListFetcher(baseUrl: string, payload: SCPListRequest) {
  return apiGet<SCPListResponse>({
    baseUrl,
    path: `${apiSCP}`,
    config: { params: constructUrlSearchParams(payload)},
  });
}

export default useSCPListFetcher;
