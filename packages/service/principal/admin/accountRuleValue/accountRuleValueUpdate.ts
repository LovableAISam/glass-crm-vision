import { DefaultRequest, ResponseData } from '@woi/core/api';
import { apiAccountRuleValue } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPut from '@woi/common/api/apiPut';

export interface AccountRuleValueUpdateResponse extends ResponseData {}

export interface AccountRuleValueUpdateRequest extends DefaultRequest {
  accountRulesId: string;
  transactionTypeId: string;
  valueRegisterMember: number;
  valueUnregisterMember: number;
  currencyId: string;
  startDate: string;
  endDate: string;
}

function useAccountRuleValueUpdateFetcher(baseUrl: string, id: string, payload: AccountRuleValueUpdateRequest) {
  return apiPut<AccountRuleValueUpdateResponse>({
    baseUrl,
    path: `${apiAccountRuleValue}/${id}`,
    payload,
  });
}

export default useAccountRuleValueUpdateFetcher;
