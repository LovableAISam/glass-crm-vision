import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiAccountRuleValue } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface AccountRuleValueData extends ResponseData {
  transactionTypeName: string;
  valueRegisterMember: number;
  valueUnregisterMember: number;
  startDate: string;
  endDate: string;
  accountRuleName: string;
  currencyName: string;
  transactionTypeSecureId: string;
  valueProMember: number;
}

interface AccountRuleValueListResponse extends ResultData<AccountRuleValueData[]> { }

export interface AccountRuleValueListRequest extends DefaultQueryPageRequest {
  accountRuleSecureIds?: string[];
  transactionTypeSecureIds?: string[];
  'active-date'?: string;
  'inactive-date'?: string;
}

function useAccountRuleValueListFetcher(baseUrl: string, payload: AccountRuleValueListRequest) {
  return apiGet<AccountRuleValueListResponse>({
    baseUrl,
    path: `${apiAccountRuleValue}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useAccountRuleValueListFetcher;
