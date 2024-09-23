import { ResponseData } from '@woi/core/api';
import { apiAccountRule } from '@woi/common/meta/apiPaths/coApiPaths';
import apiDelete from '@woi/common/api/apiDelete';

export interface AccountRuleDeleteResponse extends ResponseData {}

function useAccountRuleDeleteFetcher(baseUrl: string, id: number | string) {
  return apiDelete<AccountRuleDeleteResponse>({
    baseUrl,
    path: `${apiAccountRule}/${id}`,
  });
}

export default useAccountRuleDeleteFetcher;
