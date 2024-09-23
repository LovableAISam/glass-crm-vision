import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiPasswordChangedActivity } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface PasswordChangedActivityData extends ResponseData {}

interface PasswordChangedActivityResponse extends ResultData<PasswordChangedActivityData[]> {}

export interface PasswordChangedActivityRequest extends DefaultQueryPageRequest {
  search?: string;
}

function usePasswordChangedActivityFetcher(baseUrl: string, payload: PasswordChangedActivityRequest) {
  return apiGet<PasswordChangedActivityResponse>({
    baseUrl,
    path: `${apiPasswordChangedActivity}`,
    config: { params: constructUrlSearchParams(payload)},
  });
}

export default usePasswordChangedActivityFetcher;
