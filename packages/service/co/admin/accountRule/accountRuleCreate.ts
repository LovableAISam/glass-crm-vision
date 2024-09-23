import { DefaultRequest, ResponseData } from '@woi/core/api';
import { apiAccountRule } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';

export interface AccountRuleCreateResponse extends ResponseData {}

export interface AccountRuleCreateRequest extends DefaultRequest {
  code: string;
  name: string;
  description: string;
}

function useAccountRuleCreateFetcher(baseUrl: string, payload: AccountRuleCreateRequest) {
  return apiPost<AccountRuleCreateResponse>({
    baseUrl,
    path: `${apiAccountRule}`,
    payload,
  });
}

export default useAccountRuleCreateFetcher;
