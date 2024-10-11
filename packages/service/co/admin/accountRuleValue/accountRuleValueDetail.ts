import { apiAccountRuleValue } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { ResponseData } from '@woi/core/api';

export interface AccountRuleValueDetailData extends ResponseData {
  transactionTypeName: string;
  transactionTypeSecureId: string;
  valueVerifiedMember: number;
  valueBasicMember: number;
  startDate: string;
  endDate: string;
  accountRuleName: string;
  accountRuleSecureId: string;
  currencySecureId: string;
  currencyName: string;
}

function useAccountRuleValueDetailFetcher(baseUrl: string, id: string) {
  return apiGet<AccountRuleValueDetailData>({
    baseUrl,
    path: `${apiAccountRuleValue}/${id}`,
  });
}

export default useAccountRuleValueDetailFetcher;
