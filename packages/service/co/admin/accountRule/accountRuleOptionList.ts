import { apiAccountRuleNames } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { constructUrlSearchParams } from '@woi/core/api';

type AccountRuleOptionListResponse = Record<string, string>;

export interface AccountRuleOptionListRequest {
  target?: 'EXCLUDE_USED_ACCOUNT_RULE' | 'ONLY_CREATED_IN_ACCOUNT_RULE_VALUES';
}

function useAccountRuleOptionListFetcher(baseUrl: string, payload: AccountRuleOptionListRequest) {
  return apiGet<AccountRuleOptionListResponse>({
    baseUrl,
    path: `${apiAccountRuleNames}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useAccountRuleOptionListFetcher;
