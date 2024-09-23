import { apiAccountRuleValue } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { AccountRuleValueData } from './accountRuleValueList';

function useAccountRuleValueDetailFetcher(baseUrl: string, id: string) {
  return apiGet<AccountRuleValueData>({
    baseUrl,
    path: `${apiAccountRuleValue}/${id}`,
  });
}

export default useAccountRuleValueDetailFetcher;
