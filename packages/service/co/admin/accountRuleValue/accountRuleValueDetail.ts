import { apiAccountRuleValue } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { ResponseData } from '@woi/core/api';

export interface AccountRuleValueDetailData extends ResponseData {
  transactionTypeName: string;
  transactionTypeSecureId: string;
  valueRegisterMember: number;
  valueUnregisterMember: number;
  valueProMember: number;
  startDate: string;
  endDate: string;
  accountRuleName: string;
  accountRuleSecureId: string;
  currencySecureId: string;
  currencyName: string;
  intervalTime: number;
}

function useAccountRuleValueDetailFetcher(baseUrl: string, id: string) {
  return apiGet<AccountRuleValueDetailData>({
    baseUrl,
    path: `${apiAccountRuleValue}/${id}`,
  });
}

export default useAccountRuleValueDetailFetcher;
