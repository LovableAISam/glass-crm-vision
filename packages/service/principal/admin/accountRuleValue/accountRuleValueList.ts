import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiAccountRuleValue } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface AccountRuleValueDataAccountRule extends ResponseData {
  code: string;
  name: string;
  description: string;
}

export interface AccountRuleValueDataCurrency extends ResponseData {
  code: string;
  name: string;
  description: string;
}

export interface AccountRuleValueDataTransactionType extends ResponseData {
  code: string;
  name: string;
  description: string;
}

export interface AccountRuleValueData extends ResponseData {
  transactionType: AccountRuleValueDataTransactionType
  valueRegisterMember: number;
  valueUnregisterMember: number;
  startDate: string;
  endDate: string;
  accountRules: AccountRuleValueDataAccountRule;
  currency: AccountRuleValueDataCurrency;
}

interface AccountRuleValueListResponse extends ResultData<AccountRuleValueData[]> {}

export interface AccountRuleValueListRequest extends DefaultQueryPageRequest {
  accountRulesName?: string;
  transactionTypeName?: string[];
  'active-date'?: string;
  'inactive-date'?: string;
}

function useAccountRuleValueListFetcher(baseUrl: string, payload: AccountRuleValueListRequest) {
  return apiGet<AccountRuleValueListResponse>({
    baseUrl,
    path: `${apiAccountRuleValue}`,
    config: { params: constructUrlSearchParams(payload)},
  });
}

export default useAccountRuleValueListFetcher;
