import { DefaultRequest, ResponseData } from '@woi/core/api';
import { apiTransactionType } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';

export interface TransactionTypeCreateResponse extends ResponseData {}

export interface TransactionTypeCreateRequest extends DefaultRequest {
  code: string;
  name: string;
  description: string;
}

function useTransactionTypeCreateFetcher(baseUrl: string, payload: TransactionTypeCreateRequest) {
  return apiPost<TransactionTypeCreateResponse>({
    baseUrl,
    path: `${apiTransactionType}`,
    payload,
  });
}

export default useTransactionTypeCreateFetcher;
