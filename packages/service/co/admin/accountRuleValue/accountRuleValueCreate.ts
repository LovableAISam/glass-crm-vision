import { DefaultRequest, ResponseData } from '@woi/core/api';
import { apiAccountRuleValue } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';

export interface AccountRuleValueCreateResponse extends ResponseData { }

export interface AccountRuleValueCreateRequest extends DefaultRequest {
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

function useAccountRuleValueCreateFetcher(baseUrl: string, payload: AccountRuleValueCreateRequest) {
  return apiPost<AccountRuleValueCreateResponse>({
    baseUrl,
    path: `${apiAccountRuleValue}`,
    payload,
  });
}

export default useAccountRuleValueCreateFetcher;
