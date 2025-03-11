import { DefaultRequest, ResponseData } from '@woi/core/api';
import { apiAccountRuleValue } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPut from '@woi/common/api/apiPut';

export interface AccountRuleValueUpdateResponse extends ResponseData { }

export interface AccountRuleValueUpdateRequest extends DefaultRequest {
  accountRuleId: string;
  accountRuleName: string;
  transactionTypeId: string;
  transactionTypeName: string;
  valueRegisterMember: number;
  valueUnregisterMember: number;
  currencyId: string;
  currencyName: string;
  startDate: string;
  endDate: string;
  intervalTime: number;
}

function useAccountRuleValueUpdateFetcher(baseUrl: string, id: string, payload: AccountRuleValueUpdateRequest) {
  return apiPut<AccountRuleValueUpdateResponse>({
    baseUrl,
    path: `${apiAccountRuleValue}/${id}`,
    payload,
  });
}

export default useAccountRuleValueUpdateFetcher;
