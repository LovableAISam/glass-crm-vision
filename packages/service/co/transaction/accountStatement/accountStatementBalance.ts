import { constructUrlSearchParams, DefaultResponseData } from '@woi/core/api';
import { apiAccountStatementBalance } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface AccountStatementBalanceData {
  balance: number;
}

interface AccountStatementBalanceResponse extends DefaultResponseData<AccountStatementBalanceData> { }

export interface AccountStatementBalanceRequest {
  phoneNumber?: string;
}

function useAccountStatementBalanceFetcher(baseUrl: string, payload: AccountStatementBalanceRequest) {
  return apiGet<AccountStatementBalanceResponse>({
    baseUrl,
    path: `${apiAccountStatementBalance}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useAccountStatementBalanceFetcher;
