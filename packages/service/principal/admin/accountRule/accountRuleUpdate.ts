import { DefaultRequest, ResponseData } from '@woi/core/api';
import { apiAccountRule } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPut from '@woi/common/api/apiPut';

export interface AccountRuleUpdateResponse extends ResponseData {}

export interface AccountRuleUpdateRequest extends DefaultRequest {
  code: string;
  name: string;
  description: string;
}

function useAccountRuleUpdateFetcher(baseUrl: string, id: string, payload: AccountRuleUpdateRequest) {
  return apiPut<AccountRuleUpdateResponse>({
    baseUrl,
    path: `${apiAccountRule}/${id}`,
    payload,
  });
}

export default useAccountRuleUpdateFetcher;
