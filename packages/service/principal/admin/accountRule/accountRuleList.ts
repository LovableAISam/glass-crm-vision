import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiAccountRule } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface AccountRuleData extends ResponseData {
  code: string;
  name: string;
  description: string;
}

interface AccountRuleListResponse extends ResultData<AccountRuleData[]> { }

export interface AccountRuleListRequest extends DefaultQueryPageRequest {
  code?: string;
  name?: string;
  excludeUsedAccountRule?: boolean;
}

function useAccountRuleListFetcher(baseUrl: string, payload: AccountRuleListRequest) {
  return apiGet<AccountRuleListResponse>({
    baseUrl,
    path: `${apiAccountRule}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useAccountRuleListFetcher;
