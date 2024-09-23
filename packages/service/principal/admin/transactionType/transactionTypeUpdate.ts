import { DefaultRequest, ResponseData } from '@woi/core/api';
import { apiTransactionType } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPut from '@woi/common/api/apiPut';

export interface TransactionTypeUpdateResponse extends ResponseData {}

export interface TransactionTypeUpdateRequest extends DefaultRequest {
  id: string;
  code: string;
  name: string;
  description: string;
}

function useTransactionTypeUpdateFetcher(baseUrl: string, id: number | string, payload: TransactionTypeUpdateRequest) {
  return apiPut<TransactionTypeUpdateResponse>({
    baseUrl,
    path: `${apiTransactionType}/${id}`,
    payload,
  });
}

export default useTransactionTypeUpdateFetcher;
