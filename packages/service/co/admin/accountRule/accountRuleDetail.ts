import { apiAccountRule } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { ResponseData } from '@woi/core/api';

export interface AccountRuleData extends ResponseData {
  code: string;
  name: string;
  description: string;
}

function useAccountRuleDetailFetcher(baseUrl: string, id: string) {
  return apiGet<AccountRuleData>({
    baseUrl,
    path: `${apiAccountRule}/${id}`,
  });
}

export default useAccountRuleDetailFetcher;
