import { DefaultRequest, ResponseData } from '@woi/core/api';
import { apiAccountRuleValue } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPost from '@woi/common/api/apiPost';

export interface AccountRuleValueCreateResponse extends ResponseData {}

export interface AccountRuleValueCreateRequest extends DefaultRequest {
  accountRulesId: string;
  transactionTypeId: string;
  valueRegisterMember: number;
  valueUnregisterMember: number;
  currencyId: string;
  startDate: string;
  endDate: string;
}

function useAccountRuleValueCreateFetcher(baseUrl: string, payload: AccountRuleValueCreateRequest) {
  return apiPost<AccountRuleValueCreateResponse>({
    baseUrl,
    path: `${apiAccountRuleValue}`,
    payload,
  });
}

export default useAccountRuleValueCreateFetcher;
