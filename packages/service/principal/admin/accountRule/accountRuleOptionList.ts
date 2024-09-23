import { apiAccountRuleNames } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { constructUrlSearchParams } from '@woi/core/api';

type AccountRuleOptionListResponse = Record<string, string>;

export interface AccountRuleOptionListRequest {
  excludeUsedAccountRule?: boolean;
}

function useAccountRuleOptionListFetcher(baseUrl: string, payload: AccountRuleOptionListRequest) {
  return apiGet<AccountRuleOptionListResponse>({
    baseUrl,
    path: `${apiAccountRuleNames}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useAccountRuleOptionListFetcher;
