import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiTransactionType } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface TransactionTypeData extends ResponseData {
  name: string;
  code: string;
  description: string;
}

interface TransactionTypeListResponse extends ResultData<TransactionTypeData[]> { }

export interface TransactionTypeListRequest extends DefaultQueryPageRequest {
  code?: string;
  name?: string;
  target?: 'EMAIL' | 'SMS' | 'FDS' | 'EXCLUDE_USED_TRANSACTION_TYPE' | 'ONLY_CREATED_IN_ACCOUNT_RULE_VALUES';
}

function useTransactionTypeListFetcher(baseUrl: string, payload: TransactionTypeListRequest) {
  return apiGet<TransactionTypeListResponse>({
    baseUrl,
    path: `${apiTransactionType}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useTransactionTypeListFetcher;
