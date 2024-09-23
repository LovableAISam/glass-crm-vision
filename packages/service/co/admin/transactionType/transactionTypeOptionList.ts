import { apiTransactionTypeNames } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';
import { constructUrlSearchParams } from '@woi/core/api';

type TransactionTypeOptionListResponse = Record<string, string>;

export interface TransactionTypeOptionListRequest {
  target?:
  | 'EMAIL'
  | 'SMS'
  | 'EXCLUDE_USED_TRANSACTION_TYPE'
  | 'ONLY_CREATED_IN_ACCOUNT_RULE_VALUES'
  | 'HISTORY';
}

function useTransactionTypeOptionListFetcher(baseUrl: string, payload: TransactionTypeOptionListRequest) {
  return apiGet<TransactionTypeOptionListResponse>({
    baseUrl,
    path: `${apiTransactionTypeNames}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useTransactionTypeOptionListFetcher;
