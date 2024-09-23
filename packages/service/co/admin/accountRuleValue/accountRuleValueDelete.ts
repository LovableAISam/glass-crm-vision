import { ResponseData } from '@woi/core/api';
import { apiAccountRuleValue } from '@woi/common/meta/apiPaths/coApiPaths';
import apiDelete from '@woi/common/api/apiDelete';

export interface AccountRuleValueDeleteResponse extends ResponseData {}

function useAccountRuleValueDeleteFetcher(baseUrl: string, id: number | string) {
  return apiDelete<AccountRuleValueDeleteResponse>({
    baseUrl,
    path: `${apiAccountRuleValue}/${id}`,
  });
}

export default useAccountRuleValueDeleteFetcher;
